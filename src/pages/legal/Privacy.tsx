import LegalLayout from './LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="[DATE]" version="1.0">
      <h2>1. Who is responsible for your data</h2>
      <p>
        <strong>[TRADING NAME]</strong> is the data controller for the personal data described
        here.
      </p>
      <ul>
        <li>Address: <strong>[BUSINESS ADDRESS]</strong></li>
        <li>Email: <strong>[CONTACT EMAIL]</strong></li>
        <li>ICO registration number: <strong>[ICO REG NUMBER]</strong></li>
      </ul>

      <h2>2. The short version</h2>
      <p>
        We collect the least we can. Your email, your progress, your display name, and a record
        that you confirmed you were fit to take part. Your card details go to Stripe, never to
        us. We ask for your postal address only when you have earned something and we need to
        post it. We don’t sell your data and we don’t run advertising trackers.
      </p>

      <h2>3. What we collect and why</h2>
      <div className="table-scroll">
        <table className="board-table">
          <thead>
            <tr><th>What</th><th>Why</th><th>Lawful basis</th><th>How long</th></tr>
          </thead>
          <tbody>
            <tr><td>Email address</td><td>Your account; service emails</td><td>Contract</td><td>Life of account + 30 days</td></tr>
            <tr><td>Password (hashed — we never see it)</td><td>Securing your account</td><td>Contract</td><td>Life of account + 30 days</td></tr>
            <tr><td>Display name</td><td>Your identity on the board (public to members)</td><td>Contract</td><td>Life of account + 30 days</td></tr>
            <tr><td>Bib number</td><td>Your permanent identifier</td><td>Contract</td><td>Life of account + 30 days</td></tr>
            <tr><td>Trial progress, clears, timestamps</td><td>Delivering the sequence; your rank</td><td>Contract</td><td>Life of account + 30 days</td></tr>
            <tr><td>Stripe customer and subscription IDs</td><td>Taking payment</td><td>Contract</td><td>6 years (tax)</td></tr>
            <tr><td>Transaction records</td><td>Accounting and tax</td><td>Legal obligation</td><td><strong>6 years</strong></td></tr>
            <tr><td>Postal address (milestone only)</td><td>Posting your milestone item</td><td>Contract</td><td>12 months after final dispatch</td></tr>
            <tr><td>Health screening confirmation — a yes/no, the version shown, a timestamp</td><td>Evidence you confirmed you were fit</td><td>Legitimate interests + <strong>explicit consent</strong></td><td>Life of account, then 6 years</td></tr>
            <tr><td>IP address, security logs</td><td>Security, fraud prevention, debugging</td><td>Legitimate interests</td><td>90 days</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>We do not collect your screening answers.</strong> The questions are shown to you
        on screen. You assess yourself against them. We record only that you confirmed — never
        which conditions do or do not apply to you. This is deliberate.
      </p>
      <p><strong>We never see your full card number.</strong> Stripe processes it directly.</p>

      <h2>4. What is public</h2>
      <p>
        Your <strong>display name</strong>, your <strong>rank</strong> and your{' '}
        <strong>clear count</strong> are visible to other members on the board. Nothing else is
        — not your email, real name, address, or health confirmation.
      </p>
      <p>
        You can change your display name at any time. You can ask to be removed from the board
        entirely, without losing access to your trials, by emailing [CONTACT EMAIL].
      </p>

      <h2>5. Emails we send you</h2>
      <p>
        <strong>Service emails</strong> — account confirmation, password resets, receipts,
        renewal reminders, cancellation confirmations, milestone dispatch, policy changes. These
        are part of the service.
      </p>
      <p>
        <strong>Content announcements</strong> — when new briefings drop. You can opt out at
        signup, from your account, or via the unsubscribe link in every one. Opting out never
        affects your access.
      </p>
      <p>We do not send third-party marketing and we never sell or rent your details.</p>

      <h2>6. Health screening data — the detail</h2>
      <p>
        We store <strong>only</strong> the confirmation, the version of the questions shown, and
        the date and time. Never the answers.
      </p>
      <p>
        Even this limited record may count as data concerning health under UK GDPR. We therefore
        ask for your <strong>explicit consent</strong> as a separate, clearly labelled step,
        before you pay. If you do not give it, you cannot create an account and you will not be
        charged.
      </p>
      <p>
        We keep this record for the life of your account and then for <strong>6 years</strong>,
        because if a claim were ever made it is the evidence of what you confirmed and when. We
        keep it even after you delete your account, and we tell you so at that point.
      </p>

      <h2>7. Who we share your data with</h2>
      <div className="table-scroll">
        <table className="board-table">
          <thead><tr><th>Provider</th><th>What they do</th><th>Where</th></tr></thead>
          <tbody>
            <tr><td>Supabase</td><td>Database, authentication, account and progress data</td><td><strong>London, United Kingdom (eu-west-2)</strong></td></tr>
            <tr><td>Stripe Payments UK Limited</td><td>Payments, subscriptions, card data</td><td>UK entity; group processing may involve the US</td></tr>
            <tr><td>[EMAIL PROVIDER]</td><td>Sending service emails</td><td>[LOCATION]</td></tr>
            <tr><td>Render</td><td>Serving the website</td><td>[LOCATION]</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>We do not sell your data. We do not share it for advertising.</strong></p>

      <h2>8. Data outside the UK</h2>
      <p>
        Your account and progress data is stored in <strong>London (eu-west-2)</strong>. Some
        providers, in particular Stripe, are part of international groups and some processing
        may take place outside the UK. Where that happens we rely on{' '}
        <strong>
          UK adequacy regulations and/or the International Data Transfer Addendum issued by the
          Information Commissioner’s Office
        </strong>
        .
      </p>

      <h2>9. Cookies</h2>
      <ul>
        <li><strong>Authentication</strong> — keeps you logged in. Strictly necessary.</li>
        <li><strong>Stripe</strong> — fraud prevention when you pay. Strictly necessary.</li>
      </ul>
      <p>
        <strong>
          We do not use advertising cookies, tracking pixels, or third-party analytics.
        </strong>{' '}
        Because we only use strictly necessary cookies, we do not show a consent banner. If that
        ever changes, we will ask for your consent first.
      </p>

      <h2>10. Your rights</h2>
      <p>
        You have the right to access, correct, erase, restrict, object, port, and withdraw
        consent. Email [CONTACT EMAIL] and we will respond within <strong>one month</strong>.
      </p>
      <p>
        <strong>What deleting your account does.</strong> We cancel any active subscription,
        remove you from the board, and delete your account and progress within 30 days. We{' '}
        <strong>must</strong> keep transaction records for 6 years (HMRC) and your health
        screening confirmation for 6 years (section 6).
      </p>

      <h2>11. Security</h2>
      <ul>
        <li>All traffic is encrypted in transit (HTTPS).</li>
        <li>Passwords are hashed. We never see them and cannot recover them.</li>
        <li>Database access is restricted by row-level security.</li>
        <li>We never store card details.</li>
      </ul>
      <p>
        If a breach occurs that is likely to risk your rights and freedoms, we report it to the
        ICO within <strong>72 hours</strong> and tell you directly if the risk to you is high.
      </p>

      <h2>12. Children</h2>
      <p>Adults only. We do not knowingly collect data from anyone under 18.</p>

      <h2>13. Complaining</h2>
      <p>
        Come to us first: [CONTACT EMAIL]. You also have the right to complain to the{' '}
        <strong>Information Commissioner’s Office</strong> — Wycliffe House, Water Lane,
        Wilmslow, Cheshire SK9 5AF, helpline <strong>0303 123 1113</strong>,{' '}
        <a href="https://ico.org.uk" target="_blank" rel="noreferrer noopener">ico.org.uk</a>.
      </p>
    </LegalLayout>
  )
}
