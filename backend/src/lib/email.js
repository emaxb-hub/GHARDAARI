const defaultFrontendUrl = "http://127.0.0.1:5500";

function frontendUrl() {
  return (process.env.FRONTEND_URL || process.env.APP_BASE_URL || defaultFrontendUrl).replace(/\/+$/, "");
}

function senderAddress() {
  return process.env.EMAIL_FROM || "GharDaari <onboarding@resend.dev>";
}

function shouldReturnDevTokens() {
  return process.env.NODE_ENV !== "production";
}

function emailProvider() {
  return String(process.env.EMAIL_PROVIDER || "console").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailConfigured() {
  if (emailProvider() === "resend") {
    return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  }

  return emailProvider() === "console";
}

async function sendResendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Resend email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: senderAddress(),
      to,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend email failed with ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json().catch(() => ({}));
}

async function sendEmail(message) {
  const provider = emailProvider();

  if (provider === "resend") {
    await sendResendEmail(message);
    return { sent: true, provider };
  }

  if (provider === "console" && shouldReturnDevTokens()) {
    console.info(JSON.stringify({
      level: "info",
      type: "email-preview",
      to: message.to,
      subject: message.subject,
      text: message.text
    }));
    return { sent: false, provider };
  }

  throw new Error("Email service is not configured for production.");
}

function resetPasswordUrl(token) {
  return `${frontendUrl()}/reset-password.html?token=${encodeURIComponent(token)}`;
}

function verifyEmailUrl(token) {
  return `${frontendUrl()}/verify-email.html?token=${encodeURIComponent(token)}`;
}

export function canSendProductionEmail() {
  return emailConfigured();
}

export function canExposeDevTokens() {
  return shouldReturnDevTokens();
}

export async function sendPasswordResetEmail(user, token) {
  const link = resetPasswordUrl(token);
  const name = escapeHtml(user.fullName);
  return sendEmail({
    to: user.email,
    subject: "Reset your GharDaari password",
    text: `Hi ${user.fullName}, reset your GharDaari password here: ${link}. This link expires in 1 hour.`,
    html: `<p>Hi ${name},</p><p>Reset your GharDaari password here:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`
  });
}

export async function sendVerificationEmail(user, token) {
  const link = verifyEmailUrl(token);
  const name = escapeHtml(user.fullName);
  return sendEmail({
    to: user.email,
    subject: "Verify your GharDaari email",
    text: `Hi ${user.fullName}, verify your GharDaari email here: ${link}. This link expires in 24 hours.`,
    html: `<p>Hi ${name},</p><p>Verify your GharDaari email here:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`
  });
}
