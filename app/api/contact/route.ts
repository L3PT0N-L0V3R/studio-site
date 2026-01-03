import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/**
 * ENV (Recommended)
 * - CONTACT_TO             (required for delivery)
 * - CONTACT_FROM           (required for delivery)
 * - SMTP_HOST              (required for delivery)
 * - SMTP_PORT              (required for delivery)
 * - SMTP_USER              (required for delivery)
 * - SMTP_PASS              (required for delivery)
 *
 * ENV (Optional)
 * - BOOKING_URL            (included in auto-reply if set)
 * - CONTACT_FALLBACK_EMAIL (used for "mailto:" fallback if delivery fails)
 * - CONTACT_FALLBACK_WEBHOOK_URL (if set, POSTs lead JSON here when email delivery fails)
 * - CONTACT_RATE_LIMIT_PER_HOUR (default 12)
 */

function env(name: string) {
  const v = process.env[name];
  return v && String(v).trim().length ? String(v).trim() : undefined;
}

function safeJson(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampLen(s: string, max: number) {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

/** In-memory rate limiter (best-effort on serverless; still reduces bursts) */
type RateBucket = { count: number; resetAt: number };
const RL_KEY = "__qubewise_contact_rl__";
function getRateMap(): Map<string, RateBucket> {
  const g = globalThis as any;
  if (!g[RL_KEY]) g[RL_KEY] = new Map<string, RateBucket>();
  return g[RL_KEY];
}

function makeRequestId() {
  // simple trace id for logs + user messaging
  return Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
}

async function postFallbackWebhook(url: string, payload: any) {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const requestId = makeRequestId();
  const ip = getIp(req);

  try {
    // ---- Rate limit (best-effort) ----
    const limitPerHour = Number(env("CONTACT_RATE_LIMIT_PER_HOUR") || "12");
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;

    const map = getRateMap();
    const key = `ip:${ip}`;
    const bucket = map.get(key);

    if (!bucket || now > bucket.resetAt) {
      map.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      bucket.count += 1;
      map.set(key, bucket);
      if (bucket.count > limitPerHour) {
        return safeJson(
          {
            ok: false,
            error: "Too many submissions. Please try again later.",
            requestId,
          },
          429
        );
      }
    }

    const body = await req.json().catch(() => null);

    const name = clampLen(String(body?.name ?? ""), 120);
    const email = clampLen(String(body?.email ?? ""), 160);
    const budget = clampLen(String(body?.budget ?? ""), 120);
    const message = clampLen(String(body?.message ?? ""), 8000);

    // Honeypot: bots fill "website" fields
    const website = clampLen(String(body?.website ?? ""), 200);
    if (website) {
      // Pretend success to not tip off bots
      return safeJson({ ok: true, delivered: true, requestId });
    }

    // Basic validation
    if (name.length < 2 || !isValidEmail(email) || message.length < 10) {
      return safeJson(
        { ok: false, error: "Please complete all required fields.", requestId },
        400
      );
    }

    // Build payload for logs/fallback
    const lead = {
      requestId,
      receivedAt: new Date().toISOString(),
      ip,
      source: String(body?.source ?? "website-contact"),
      name,
      email,
      budget: budget || "—",
      message,
    };

    // ---- Attempt email delivery if SMTP is configured ----
    const SMTP_HOST = env("SMTP_HOST");
    const SMTP_PORT = env("SMTP_PORT");
    const SMTP_USER = env("SMTP_USER");
    const SMTP_PASS = env("SMTP_PASS");

    const CONTACT_TO = env("CONTACT_TO");
    const CONTACT_FROM = env("CONTACT_FROM");
    const BOOKING_URL = env("BOOKING_URL");

    const hasSmtp =
      SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_TO && CONTACT_FROM;

    let delivered = false;
    let deliveryError: string | null = null;

    if (hasSmtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST!,
          port: Number(SMTP_PORT!),
          secure: Number(SMTP_PORT!) === 465,
          auth: { user: SMTP_USER!, pass: SMTP_PASS! },
        });

        const subject = `New lead — Qubewise (${budget || "no budget selected"})`;

        // 1) Internal notification
        await transporter.sendMail({
          from: `Qubewise <${CONTACT_FROM}>`,
          to: CONTACT_TO,
          replyTo: email,
          subject,
          text: [
            `New contact submission`,
            ``,
            `Request ID: ${requestId}`,
            `Name: ${name}`,
            `Email: ${email}`,
            `Budget: ${budget || "—"}`,
            ``,
            `Message:`,
            message,
          ].join("\n"),
        });

        // 2) Auto-reply (best-effort; internal delivery is the priority)
        try {
          await transporter.sendMail({
            from: `Qubewise <${CONTACT_FROM}>`,
            to: email,
            replyTo: CONTACT_TO,
            subject: `We received your message — Qubewise`,
            text: [
              `Hi ${name},`,
              ``,
              `Thanks for reaching out to Qubewise. We received your message and will reply within 1 business day.`,
              ``,
              BOOKING_URL
                ? `If you'd like to move faster, you can book a quick intro call here:\n${BOOKING_URL}\n`
                : ``,
              `If you reply with these, we can scope faster:`,
              `1) your website (if you have one)`,
              `2) what you want the site to accomplish (leads, booking, sales, etc.)`,
              `3) timeline + budget range`,
              ``,
              `Reference: ${requestId}`,
              ``,
              `— Dammon`,
              `Qubewise`,
              `qubewise.com`,
            ]
              .filter(Boolean)
              .join("\n"),
          });
        } catch {
          // ignore auto-reply failures
        }

        delivered = true;
      } catch (e: any) {
        delivered = false;
        deliveryError = e?.message ? String(e.message) : "SMTP delivery failed";
      }
    } else {
      delivered = false;
      deliveryError = "SMTP not configured";
    }

    // ---- If delivery failed, try webhook fallback (optional) ----
    const fallbackWebhook = env("CONTACT_FALLBACK_WEBHOOK_URL");
    let fallbackWebhookOk = false;

    if (!delivered && fallbackWebhook) {
      fallbackWebhookOk = await postFallbackWebhook(fallbackWebhook, lead);
    }

    // Always log server-side for traceability in Vercel logs
    console.log(
      JSON.stringify({
        event: "contact_submission",
        ...lead,
        delivered,
        deliveryError,
        fallbackWebhookOk,
      })
    );

    // Provide a user-facing fallback if delivery isn’t confirmed
    const fallbackEmail = env("CONTACT_FALLBACK_EMAIL") || CONTACT_TO;

    if (!delivered) {
      return safeJson({
        ok: true,
        delivered: false,
        requestId,
        fallback: fallbackEmail
          ? {
              mailto: `mailto:${fallbackEmail}?subject=${encodeURIComponent(
                `Inquiry (${requestId})`
              )}`,
              email: fallbackEmail,
            }
          : undefined,
      });
    }

    return safeJson({ ok: true, delivered: true, requestId });
  } catch (err: any) {
    // Do not leak internal details. Log with requestId for debugging.
    console.error(
      JSON.stringify({
        event: "contact_error",
        requestId,
        ip,
        error: err?.message ?? String(err),
      })
    );

    return safeJson(
      {
        ok: false,
        error: "Server error. Please try again.",
        requestId,
      },
      500
    );
  }
}
