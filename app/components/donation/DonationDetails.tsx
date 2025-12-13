export default function DonationDetails() {
  return (
    <div className="donation-methods">
      <div className="donation-card">
        <div className="donation-card-title">Mobile Money (MTN Rwanda)</div>
        <div className="donation-card-value">+250 788 123 456</div>
        <div className="donation-card-note">Reference: SHANGAZI SUPPORT</div>
      </div>
      <div className="donation-card">
        <div className="donation-card-title">Bank Transfer</div>
        <div className="donation-card-value">Bank of Kigali</div>
        <div className="donation-card-meta">Account Name: Shangazi Media</div>
        <div className="donation-card-meta">Account Number: 0001122334455</div>
        <div className="donation-card-meta">SWIFT: BKIGRWRW</div>
      </div>
      <div className="donation-card">
        <div className="donation-card-title">International Support</div>
        <div className="donation-card-value">PayPal</div>
        <div className="donation-card-meta">paypal.me/shangazi</div>
        <div className="donation-card-note">Email confirmation will be sent for every contribution.</div>
      </div>
    </div>
  )
}
