const stores = new Map();
let lastCleanupAt = 0;

function clientKey(req, name) {
  return `${name}:${req.ip || req.socket.remoteAddress || "unknown"}`;
}

function useDatabaseStore() {
  return process.env.RATE_LIMIT_STORE === "database" || process.env.NODE_ENV === "production";
}

async function databaseLimit(key, windowMs, max) {
  const { prisma } = await import("../lib/prisma.js");
  const now = new Date();
  const resetAt = new Date(Date.now() + windowMs);

  if (Date.now() - lastCleanupAt > windowMs) {
    lastCleanupAt = Date.now();
    prisma.rateLimitBucket.deleteMany({ where: { resetAt: { lt: now } } }).catch(() => {});
  }

  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });
  if (!existing || existing.resetAt <= now) {
    const bucket = await prisma.rateLimitBucket.upsert({
      where: { key },
      update: { count: 1, resetAt },
      create: { key, count: 1, resetAt }
    });
    return bucket;
  }

  return prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } }
  });
}

export function rateLimit({ name, windowMs, max, message }) {
  return async (req, res, next) => {
    const now = Date.now();
    const key = clientKey(req, name);

    if (useDatabaseStore()) {
      try {
        const bucket = await databaseLimit(key, windowMs, max);
        res.set("RateLimit-Limit", String(max));
        res.set("RateLimit-Remaining", String(Math.max(0, max - bucket.count)));
        res.set("RateLimit-Reset", String(Math.ceil(bucket.resetAt.getTime() / 1000)));

        if (bucket.count > max) {
          return res.status(429).json({
            message: message || "Too many requests. Please try again later."
          });
        }

        return next();
      } catch (error) {
        return next(error);
      }
    }

    const entry = stores.get(key) || { count: 0, resetAt: now + windowMs };

    if (entry.resetAt <= now) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    stores.set(key, entry);

    res.set("RateLimit-Limit", String(max));
    res.set("RateLimit-Remaining", String(Math.max(0, max - entry.count)));
    res.set("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      return res.status(429).json({
        message: message || "Too many requests. Please try again later."
      });
    }

    next();
  };
}
