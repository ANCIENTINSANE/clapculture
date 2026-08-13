export interface EmailTemplateOptions {
  preheader?: string;
  title: string;
  customerName: string;
  bodyHtml: string;
  buttonText?: string;
  buttonUrl?: string;
  footerNotice?: string;
}

/**
 * Unified HTML Email Template Provider for CLAPCULTURE.
 * Reusable across all transactional emails (Order confirmation, Payment verified, Shipping update, Admin alerts).
 * Only the content variables change between different email services.
 */
export function buildClapCultureEmailTemplate(options: EmailTemplateOptions): string {
  const {
    preheader = 'CLAPCULTURE — Redefining Streetwear',
    title,
    customerName,
    bodyHtml,
    buttonText,
    buttonUrl,
    footerNotice = 'You received this email regarding your order with CLAPCULTURE.',
  } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090909;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #090909;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #141414;
      border: 1px solid #262626;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background-color: #090909;
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid #262626;
    }
    .brand-logo {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 0.15em;
      color: #ffffff;
      text-transform: uppercase;
      text-decoration: none;
      margin: 0;
    }
    .brand-badge {
      display: inline-block;
      margin-top: 8px;
      background-color: #d2f000;
      color: #090909;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.2em;
      padding: 3px 10px;
      text-transform: uppercase;
      border-radius: 2px;
    }
    .content-body {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .email-title {
      font-size: 24px;
      font-weight: 800;
      color: #d2f000;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.6;
      color: #d4d4d4;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #d2f000;
      color: #090909;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    .footer {
      background-color: #090909;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #262626;
      font-size: 12px;
      color: #737373;
    }
    .footer a {
      color: #d2f000;
      text-decoration: none;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <!-- Preheader text for email client preview -->
  <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>

  <div class="wrapper">
    <div class="main-card">
      <!-- HEADER -->
      <div class="header">
        <div class="brand-logo">CLAPCULTURE</div>
        <div class="brand-badge">FOR THE REBELS</div>
      </div>

      <!-- CONTENT BODY -->
      <div class="content-body">
        <div class="greeting">Hi ${customerName},</div>
        <div class="email-title">${title}</div>
        <div class="body-text">
          ${bodyHtml}
        </div>

        ${
          buttonText && buttonUrl
            ? `
          <div class="cta-container">
            <a href="${buttonUrl}" target="_blank" class="cta-button">${buttonText}</a>
          </div>
        `
            : ''
        }
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p style="margin: 0 0 8px 0;">${footerNotice}</p>
        <p style="margin: 0;">
          © ${new Date().getFullYear()} CLAPCULTURE. All rights reserved. | Design & Developed by <a href="https://vcard.stemlen.com/u/surendra" target="_blank">surendra.codes</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
