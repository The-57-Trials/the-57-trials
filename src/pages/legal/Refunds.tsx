import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'
import { PRICE_CIRCUIT } from '../../lib/types'

export default function Refunds() {
  return (
    <LegalLayout title="Cancellation & Refunds" updated="[DATE]" version="1.0">
      <p>
        This policy forms part of our <Link to="/terms">Terms of Service</Link>.{' '}
        <strong>It does not reduce your legal rights.</strong>
      </p>

      <h2>1. Cancelling your Circuit Pass — the simple bit</h2>
      <p><strong>Cancel any time, online, in about ten seconds.</strong></p>
      <p>Account → Manage billing → Cancel subscription.</p>
      <ul>
        <li>
          It takes effect at the <strong>end of your current paid month</strong>. You keep access
          until then.
        </li>
        <li>No cancellation fee, no notice period.</li>
        <li>We email you a confirmation within 7 days.</li>
        <li>
          <strong>Your cleared lines stay cleared.</strong> Trials 06+ lock, your record does not
          reset. Resubscribe and you pick up where you stopped.
        </li>
        <li>Your Entry Pass and bib number are permanent.</li>
      </ul>

      <h2>2. Your legal right to cancel within 14 days</h2>
      <p>
        Under the Consumer Contracts (Information, Cancellation and Additional Charges)
        Regulations 2013 you normally have <strong>14 days</strong> to cancel a distance contract
        and get a full refund. The 14 days run from the day your contract with us is made.
      </p>

      <h2>3. The Entry Pass — please read before you pay</h2>
      <p>
        Your trials unlock the moment you pay. That is digital content supplied immediately. The
        law says that if you ask for it immediately, and you acknowledge that doing so ends your
        14-day right to cancel it, then that right ends once we supply it.
      </p>
      <p>So at checkout we ask you to confirm, separately:</p>
      <blockquote>
        I want access to my trials straight away, and I understand that once access is given I
        lose my 14-day right to cancel the digital content I have received.
      </blockquote>
      <p>
        If you tick it and we give you access,{' '}
        <strong>you cannot then cancel the Entry Pass under the 14-day rule.</strong> We confirm
        this back to you by email.
      </p>
      <p>
        If you would rather keep your 14-day right, don’t tick it, contact us at [CONTACT EMAIL],
        and we will hold your access until the 14 days have passed.
      </p>

      <h2>4. The Circuit Pass — we go further than the law requires</h2>
      <p>
        The legal position on subscriptions like this one is not perfectly clear-cut, so we are
        not going to argue about it.
      </p>
      <p>
        <strong>
          If you cancel your Circuit Pass within 14 days of your first subscription payment, we
          will refund that first month on a pro-rata basis for the days you did not use.
        </strong>
      </p>
      <p>You keep any trials you have cleared. We do not claw those back.</p>
      <p>
        This applies to your <strong>first</strong> Circuit Pass payment only. Later renewals are
        not refundable, because you can cancel any time before a renewal and we remind you first.
      </p>
      <p>To claim it, email [CONTACT EMAIL] within 14 days of the first payment.</p>

      <h2>5. Renewals</h2>
      <ul>
        <li>Your Circuit Pass renews monthly at <strong>{PRICE_CIRCUIT}</strong>.</li>
        <li>We email a reminder before each renewal.</li>
        <li>Every receipt and reminder tells you how to cancel.</li>
        <li>Price changes come with at least <strong>30 days’ notice</strong>.</li>
      </ul>

      <h2>6. If something is wrong with the service</h2>
      <p>
        If the digital content is <strong>faulty, not as described, or not of satisfactory
        quality</strong>, you have rights under the <strong>Consumer Rights Act 2015</strong> to
        a repair, replacement, price reduction or refund.{' '}
        <strong>We cannot exclude these rights and we are not trying to.</strong>
      </p>

      <h2>7. Milestone items</h2>
      <p>
        Milestone items at trials 15, 30, 45 and 57 are{' '}
        <strong>rewards included in your pass</strong>, not separately purchased goods.
      </p>
      <p>
        If an item arrives <strong>damaged, faulty, or not as described</strong>, tell us and we
        will replace it free of charge.{' '}
        <strong>Your rights under the Consumer Rights Act 2015 apply in full.</strong>
      </p>
      <p>
        Because these items are personal awards bearing your bib number, we do not operate a
        general change-of-mind returns process for them. If you don’t want an item, tell us
        before we dispatch and we won’t send it.
      </p>

      <h2>8. How to cancel — the formal route</h2>
      <p>
        Use the wording below, the standard model cancellation form, or just say it in your own
        words. Email [CONTACT EMAIL] or write to [BUSINESS ADDRESS].
      </p>
      <blockquote>
        I hereby give notice that I cancel my contract for the supply of the following service:
        <br />Ordered on: [DATE]
        <br />Name: [YOUR NAME]
        <br />Bib number: [YOUR BIB NUMBER]
        <br />Date: [DATE]
      </blockquote>

      <h2>9. How refunds are paid</h2>
      <ul>
        <li>To your <strong>original payment method</strong>.</li>
        <li>Within <strong>14 days</strong> of us accepting the cancellation.</li>
        <li>No fee for issuing a refund.</li>
        <li>How quickly it appears is down to your bank — usually 3–5 working days.</li>
      </ul>

      <h2>10. Chargebacks</h2>
      <p>
        If something has gone wrong, <strong>talk to us first</strong>. A refund from us is
        faster than a chargeback from your bank. Email [CONTACT EMAIL] and we will sort it out.
      </p>
    </LegalLayout>
  )
}
