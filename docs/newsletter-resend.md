# Shangazi newsletter / Resend configuration

The newsletter page and footer post to `/api/newsletter`. The route saves contacts to the dedicated Resend segment only after a visitor explicitly checks the consent box. It returns a success response only if Resend accepts the operation.

## Required secrets and access

- `RESEND_API_KEY`: the existing transactional-email key may remain send-only.
- `RESEND_MARKETING_API_KEY`: create a **Full access** Resend key in Resend API Keys. Required for creating/listing contacts, managing segments, and creating/sending broadcasts. Never expose it to the browser.
- `RESEND_NEWSLETTER_SEGMENT_ID`: UUID of the dedicated **Shangazi Newsletter** segment. The old `RESEND_SEGMENT_ID` is a fallback for backward compatibility; don't assume an old audience ID is a segment.
- `NEWSLETTER_ADMIN_EMAILS`: comma-separated sign-in emails of trusted staff. **Fail closed:** the admin UI and endpoints return 404/403 if no addresses are configured.
- `RESEND_NEWSLETTER_FROM` (optional): verified Resend sender, e.g. `Shangazi <comms@shangazi.rw>`.

Create the full-access key at https://resend.com/api-keys then set it in local `.env` and in your production host's encrypted environment settings.

Run once from the repository root:

```bash
# /Users/chastedjaziri/Documents/GitHub/shangazi
node --env-file=.env scripts/setup-newsletter-segment.mjs
```

The script reuses an existing segment with the exact name **Shangazi Newsletter** or creates a new one and writes its UUID only to the ignored local `.env`. Copy `RESEND_NEWSLETTER_SEGMENT_ID` to the production host as well.

## Admin

Sign in as a configured admin and open `/admin/newsletter`, or follow the link in Account Settings. The dashboard loads live subscribers and Resend segments, creates or renames segments, adds/removes existing contacts, saves draft broadcasts, and can send an API-created newsletter draft only after typing `SEND NEWSLETTER`.

- The active newsletter segment cannot be deleted by the app.
- Unsubscribed contacts are never automatically re-subscribed.
- Draft creation **does not send** email. Sending is separate and requires a deliberate admin confirmation.
- Broadcasts include `{{{RESEND_UNSUBSCRIBE_URL}}}`, rendered by Resend.
- Existing newsletter subscriber data is maintained by Resend, not a duplicate local database.

## Verification checklist

1. Enable `RESEND_MARKETING_API_KEY` with full access and run the setup script.
2. Set `NEWSLETTER_ADMIN_EMAILS` for your actual Neon Auth admin login.
3. Confirm the newsletter segment appears in Resend.
4. Sign up using an email address you control on `/newsletter` and via the footer, then confirm exactly one contact appears in the chosen segment.
5. Verify an unsubscribed address cannot be silently reactivated.
6. Create a broadcast draft and review it in the Resend dashboard. Sending to a real mailing list requires a separate, explicit action.
7. Set the same secret environment variables in production and deploy.

### Operational considerations

- The existing Resend key in the project was tested and returned HTTP 401: **"This API key is restricted to only send emails."** As a result, live segment creation and contact storage cannot be completed with that key.
- The application does not currently implement double opt-in, a distributed subscription rate limiter, or separate consent-audit records. Add those before large-scale marketing use if required by your compliance policy.
- For changes to API permissions, issue a new restricted-purpose key rather than disclosing credentials in Git, logs, or chats.
