import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const budget = String(body?.budget ?? "").trim();
    const message = String(body?.message ?? "").trim();

    // Simple honeypot: if filled, treat as spam.
    const website = String(body?.website ?? "").trim();
    if (website) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
    }

    // Very light email sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 });
    }

    const SMTP_HOST = requiredEnv("SMTP_HOST");
    const SMTP_PORT = Number(requiredEnv("SMTP_PORT"));
    const SMTP_USER = requiredEnv("SMTP_USER");
    const SMTP_PASS = requiredEnv("SMTP_PASS");

    const CONTACT_TO = requiredEnv("CONTACT_TO");
    const CONTACT_FROM = requiredEnv("CONTACT_FROM");
    const BOOKING_URL = requiredEnv("BOOKING_URL");

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `New lead — QubeWise (${budget || "no budget selected"})`;

    // 1) Internal notification (to you)
    await transporter.sendMail({
      from: `QubeWise <${CONTACT_FROM}>`,
      to: CONTACT_TO,
      replyTo: email, // so hitting "Reply" goes to the lead
      subject,
      text: [
        `New contact submission`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budget || "—"}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });

    // 2) Auto-reply to lead (from hello@)
    await transporter.sendMail({
      from: `QubeWise <${CONTACT_FROM}>`,
      to: email,
      replyTo: CONTACT_TO,
      subject: `We received your message — QubeWise`,
      text: [
        `Hi ${name},`,
        ``,
        `Thanks for reaching out to QubeWise. We received your message and will reply within 1 business day.`,
        ``,
        `If you'd like to move faster, you can book a quick intro call here:`,
        BOOKING_URL,
        ``,
        `To help us scope accurately, feel free to reply with:`,
        `1) your website (if you have one)`,
        `2) what you want the site to accomplish (leads, booking, sales, etc.)`,
        `3) timeline + budget range`,
        ``,
        `— Dammon`,
        `QubeWise`,
        `qubewise.com`,
      ].join("\n"),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Server error" }),
      { status: 500 }
    );
  }
}
