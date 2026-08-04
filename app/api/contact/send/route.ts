import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// 5 letters per hour per IP; 50 per day in total (Resend free tier is 100/day)
const IP_LIMIT = 5;
const IP_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_DAILY_LIMIT = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

const FIELD_LIMITS: Record<string, number> = {
  name: 100,
  email: 200,
  subject: 200,
  message: 5000,
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  // Initialize Resend inside the function to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot: real users never fill this hidden field. Pretend success
    // so bots don't learn they were filtered out.
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
      if (typeof body[field] !== "string" || body[field].length > limit) {
        return NextResponse.json(
          { error: `Field "${field}" is too long (max ${limit} characters)` },
          { status: 400 }
        );
      }
    }

    const ip = getClientIp(request);
    if (
      !rateLimit(`contact:${ip}`, IP_LIMIT, IP_WINDOW_MS) ||
      !rateLimit("contact:global", GLOBAL_DAILY_LIMIT, DAY_MS)
    ) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL || "ad.pankrat@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <h3>Message:</h3>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
