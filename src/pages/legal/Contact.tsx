import LegalLayout from './LegalLayout'

export default function Contact() {
  return (
    <LegalLayout title="Contact" updated="[DATE]" version="1.0">
      <h2>Who runs this</h2>
      <p>
        The 57 Trials is operated by <strong>[TRADING NAME]</strong>, a sole trader established
        in England.
      </p>
      <ul>
        <li>Trading address: <strong>[BUSINESS ADDRESS]</strong></li>
        <li>Email: <strong>[CONTACT EMAIL]</strong></li>
      </ul>

      <h2>Getting an answer</h2>
      <ul>
        <li>General questions — we aim to reply within <strong>2 working days</strong>.</li>
        <li>
          Billing, refunds and cancellations — email us and we will sort it. A refund from us is
          faster than a chargeback from your bank.
        </li>
        <li>
          Complaints — put “COMPLAINT” in the subject line. We acknowledge within 2 working days
          and aim to resolve within 14.
        </li>
        <li>Data protection requests — we respond within one month.</li>
      </ul>

      <h2>Medical emergencies</h2>
      <p>
        <strong>Do not contact us.</strong> In an emergency in the UK call{' '}
        <strong>999</strong>. For urgent but non-emergency medical advice call{' '}
        <strong>111</strong>. We cannot help medically and may not see your message for hours.
      </p>
    </LegalLayout>
  )
}
