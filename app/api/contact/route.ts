import { buildContactInquiryEmail } from "@/emails/contact-inquiry-email";
import { contactFormSchema } from "@/lib/contact-schema";
import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid form data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured yet. Please try again later." },
        { status: 503 },
      );
    }

    const resend = getResend();
    const to =
      process.env.CONTACT_TO_EMAIL?.trim() || "jamesserritslev@gmail.com";
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Portfolio Contact <onboarding@resend.dev>";
    const { subject, html, text } = buildContactInquiryEmail(parsed.data);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: parsed.data.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your message right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
