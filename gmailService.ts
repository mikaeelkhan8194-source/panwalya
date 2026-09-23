import { getAccessToken } from './firebase';

/**
 * Encodes string to base64url for RFC 2822 Gmail payload
 */
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface SendEmailParams {
  to: string;
  subject: string;
  bodyHtml: string;
  fromName?: string;
}

export async function sendGmailMessage(params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, error: 'User is not authenticated with Google or access token expired.' };
    }

    const emailContent = [
      `Content-Type: text/html; charset="UTF-8"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: 7bit`,
      `to: ${params.to}`,
      `subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`,
      ``,
      params.bodyHtml,
    ].join('\r\n');

    const raw = base64UrlEncode(emailContent);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errData.error?.message || `Gmail API responded with status ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Error sending Gmail email:', err);
    return { success: false, error: err?.message || 'Failed to send email' };
  }
}

export async function checkGmailProfile(): Promise<{ email?: string; messagesTotal?: number; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { error: 'No access token' };
    }

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { error: `Failed to fetch profile: ${res.statusText}` };
    }

    const data = await res.json();
    return { email: data.emailAddress, messagesTotal: data.messagesTotal };
  } catch (err: any) {
    return { error: err.message };
  }
}
