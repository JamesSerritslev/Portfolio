import type { ContactFormValues } from "@/lib/contact-schema";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Inline defaults use the light palette so clients that strip CSS stay readable. */
const LIGHT = {
  bodyBg: "#f4f3ef",
  cardBg: "#ffffff",
  headerBorder: "#e8e6df",
  cardBorder: "#9f956c",
  primary: "#111111",
  accent: "#9f956c",
  footer: "#777777",
  link: "#111111",
} as const;

const CARD_RADIUS = "16px";

const EMAIL_STYLES = `
  :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }

  .email-card {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border-radius: ${CARD_RADIUS} !important;
    overflow: hidden !important;
  }

  .email-header {
    border-top-left-radius: ${CARD_RADIUS} !important;
    border-top-right-radius: ${CARD_RADIUS} !important;
  }

  .email-footer {
    border-bottom-left-radius: ${CARD_RADIUS} !important;
    border-bottom-right-radius: ${CARD_RADIUS} !important;
  }

  @media (prefers-color-scheme: light) {
    body,
    .email-body,
    .email-outer {
      background-color: #f4f3ef !important;
    }

    .email-card,
    .email-header,
    .email-content,
    .email-footer,
    .email-field-label,
    .email-field-value {
      background-color: #ffffff !important;
    }

    .email-card {
      border-color: #9f956c !important;
    }

    .email-header {
      border-bottom-color: #e8e6df !important;
    }

    .text-primary,
    .text-primary a {
      color: #111111 !important;
    }

    .text-accent {
      color: #9f956c !important;
    }

    .text-footer {
      color: #777777 !important;
    }
  }

  @media (prefers-color-scheme: dark) {
    body,
    .email-body,
    .email-outer {
      background-color: #0a0a0a !important;
    }

    .email-card,
    .email-header,
    .email-content,
    .email-footer,
    .email-field-label,
    .email-field-value {
      background-color: #111111 !important;
    }

    .email-card {
      border-color: #9f956c !important;
    }

    .email-header {
      border-bottom-color: #2a2a2a !important;
    }

    .text-primary,
    .text-primary a {
      color: #ffffff !important;
    }

    .text-accent {
      color: #9f956c !important;
    }

    .text-footer {
      color: #888888 !important;
    }
  }
`.trim();

export function buildContactInquiryEmail(data: ContactFormValues) {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeMessage = escapeHtml(data.message).replaceAll("\n", "<br />");

  const subject = "PORTFOLIO INQUIRY";

  const html = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <meta name="x-apple-disable-message-reformatting" content="" />
    <title>${escapeHtml(subject)}</title>
    <style type="text/css">${EMAIL_STYLES}</style>
  </head>
  <body class="email-body" bgcolor="${LIGHT.bodyBg}" style="margin:0;padding:0;background-color:${LIGHT.bodyBg};color:${LIGHT.primary};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" class="email-body" width="100%" cellspacing="0" cellpadding="0" bgcolor="${LIGHT.bodyBg}" style="background-color:${LIGHT.bodyBg};padding:32px 16px;">
      <tr>
        <td align="center" class="email-outer" bgcolor="${LIGHT.bodyBg}" style="background-color:${LIGHT.bodyBg};">
          <table role="presentation" class="email-card" width="100%" cellspacing="0" cellpadding="0" bgcolor="${LIGHT.cardBg}" style="max-width:560px;background-color:${LIGHT.cardBg};border:1px solid ${LIGHT.cardBorder};border-radius:${CARD_RADIUS};border-collapse:separate;border-spacing:0;overflow:hidden;">
            <tr>
              <td class="email-header" bgcolor="${LIGHT.cardBg}" style="padding:24px 28px 16px;background-color:${LIGHT.cardBg};border-bottom:1px solid ${LIGHT.headerBorder};border-top-left-radius:${CARD_RADIUS};border-top-right-radius:${CARD_RADIUS};">
                <p class="text-accent" style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${LIGHT.accent};">Portfolio inquiry</p>
              </td>
            </tr>
            <tr>
              <td class="email-content" bgcolor="${LIGHT.cardBg}" style="padding:8px 28px 24px;background-color:${LIGHT.cardBg};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="${LIGHT.cardBg}" style="font-size:14px;line-height:1.6;background-color:${LIGHT.cardBg};">
                  <tr>
                    <td class="text-accent email-field-label" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.accent};width:88px;vertical-align:top;background-color:${LIGHT.cardBg};">Name</td>
                    <td class="text-primary email-field-value" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.primary};background-color:${LIGHT.cardBg};">${safeName}</td>
                  </tr>
                  <tr>
                    <td class="text-accent email-field-label" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.accent};vertical-align:top;background-color:${LIGHT.cardBg};">Email</td>
                    <td class="text-primary email-field-value" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.primary};background-color:${LIGHT.cardBg};"><a href="mailto:${safeEmail}" class="text-primary" style="color:${LIGHT.link};text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td class="text-accent email-field-label" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.accent};vertical-align:top;background-color:${LIGHT.cardBg};">Phone</td>
                    <td class="text-primary email-field-value" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.primary};background-color:${LIGHT.cardBg};">${safePhone}</td>
                  </tr>
                  <tr>
                    <td class="text-accent email-field-label" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.accent};vertical-align:top;background-color:${LIGHT.cardBg};">Message</td>
                    <td class="text-primary email-field-value" bgcolor="${LIGHT.cardBg}" style="padding:0 0 10px;color:${LIGHT.primary};background-color:${LIGHT.cardBg};">${safeMessage}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-footer" bgcolor="${LIGHT.cardBg}" style="padding:0 28px 28px;background-color:${LIGHT.cardBg};border-bottom-left-radius:${CARD_RADIUS};border-bottom-right-radius:${CARD_RADIUS};">
                <p class="text-footer" style="margin:0;font-size:12px;line-height:1.5;color:${LIGHT.footer};">
                  Reply directly to this email to reach ${safeName}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  const text = [
    "Portfolio inquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  return { subject, html, text };
}
