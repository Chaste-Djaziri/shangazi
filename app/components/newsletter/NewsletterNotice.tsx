// app/components/newsletter/NewsletterNotice.tsx
export function NewsletterNotice({ error, message }: { error?: string; message?: string }) {
  return <>{error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {message && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}</>;
}
