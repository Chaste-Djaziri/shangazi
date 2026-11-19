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

## Newsletter Studio (administration)

The previous long, single-page admin component has been replaced by dedicated screens:

- `/admin/newsletter` — Overview: subscriber count, group count, and recent campaigns.
- `/admin/newsletter/audience` — Audience: search, filter by subscribed status, inspect individual segments, and manage memberships of existing contacts.
- `/admin/newsletter/segments` — Audience groups: create, rename, and remove segments; choose a segment when creating a campaign. The primary newsletter segment cannot be deleted through this app.
- `/admin/newsletter/broadcasts` — Broadcasts: search, filter by status/audience, and open details.
- `/admin/newsletter/broadcasts/[id]` — A single campaign: read metadata, inspect its HTML in a sandboxed desktop/mobile email frame, inspect text, edit an API-created draft, or explicitly confirm a send.
- `/admin/newsletter/compose` — Compose: email subject, inbox preview text, audience group, visible heading, Markdown formatting toolbar, templates, and email render preview. An optional `?segmentId=...` preselects a group. `?edit=...` loads an existing draft.

### Editor and content sources

The composer supports Markdown headings, bold/italic text, lists, block quotes, links, and remotely hosted images. It converts Markdown into table-based, email-compatible HTML before saving an **unsent** draft in Resend, along with the plain-text source. Raw user-authored HTML is escaped. Rendered previews are displayed inside sandboxed iframes. Resend supplies per-recipient substitutions and the unsubscribe URL when a broadcast is sent.

The composer can search **published Sanity posts, courses, and videos** and insert a link block. **Sanity is a content source; Resend remains the system of record for subscriber groups, broadcast drafts, and delivery.** Maintaining a second newsletter campaign database in Sanity is intentionally avoided, as it could cause version and delivery-state conflicts. A later requirement for long-form editorial approval workflows can justify a distinct Sanity newsletter-document schema with explicit publishing/sync rules.

Broadcast drafts created in the Resend visual editor may not be editable or sendable through the Resend API, even when they are visible in the API list. Use the original editor for such drafts. Do not send any broadcast during testing without a deliberate user action.

### Safe live check

```bash
# /Users/chastedjaziri/Documents/GitHub/shangazi
node --env-file=.env scripts/check-newsletter-readonly.mjs
```

This checks the segment, segment list, first page of segment contacts, and first page of broadcasts. It does not create contacts, draft campaigns, or send mail.
