export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const line = JSON.stringify({
      level: res.statusCode >= 500 ? "error" : "info",
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip
    });
    process.stdout.write(`${line}\n`);
  });

  next();
}

export function errorLogger(error, req, res, next) {
  process.stderr.write(JSON.stringify({
    level: "error",
    method: req.method,
    path: req.originalUrl,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  }) + "\n");
  next(error);
}
