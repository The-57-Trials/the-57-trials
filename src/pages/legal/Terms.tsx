import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="[DATE]" version="1.0">
      <h2>1. Who we are</h2>
      <p>
        The 57 Trials is operated by <strong>[TRADING NAME]</strong>, a sole trader established
        in England.
      </p>
      <ul>
        <li>Trading address: <strong>[BUSINESS ADDRESS]</strong></li>
        <li>Email: <strong>[CONTACT EMAIL]</strong></li>
        <li>
          VAT: <strong>[TRADING NAME] is not VAT registered. No VAT is charged on any price
          shown.</strong>
        </li>
        <li>ICO registration number: <strong>[ICO REG NUMBER]</strong></li>
      </ul>
      <p>
        “We”, “us” and “our” mean [TRADING NAME]. “You” and “your” mean you, the member. We call
        members <strong>runners</strong>.
      </p>

      <h2>2. Read this before you pay</h2>
      <p>These Terms are a contract between you and us. By paying, you accept them.</p>
      <p>
        Two other documents form part of this contract and you should read them too: the{' '}
        <Link to="/disclaimer">Health &amp; Safety Disclaimer</Link> and the{' '}
        <Link to="/refunds">Cancellation &amp; Refund Policy</Link>. The{' '}
        <Link to="/privacy">Privacy Policy</Link> explains what we do with your data.
      </p>
      <p>
        <strong>Nothing in these Terms removes or reduces your legal rights as a consumer.</strong>{' '}
        Where any term conflicts with your statutory rights, your statutory rights win.
      </p>

      <h2>3. You must be 18</h2>
      <p>
        The 57 Trials is for adults. You must be <strong>18 or over</strong> to create an account
        or pay. If we find you are under 18 we will close your account and refund any unused
        portion of what you paid.
      </p>

      <h2>4. What you are buying</h2>
      <p>
        The 57 Trials is a sequence of 57 challenges. Each is delivered as a{' '}
        <strong>written briefing</strong> in your account.
      </p>
      <p>
        <strong>The trials are physical in nature.</strong> You perform them yourself, in your
        own time, in a place of your choosing, unsupervised. We do not watch you, coach you,
        train you, assess you, or verify what you do. Read the{' '}
        <Link to="/disclaimer">Health &amp; Safety Disclaimer</Link> before you pay.
      </p>
      <p><strong>One line at a time.</strong> Trials unlock in order. You cannot skip ahead.</p>

      <h3>Entry Pass — £10, one-time</h3>
      <ul>
        <li>Your bib number. Assigned on signup. Permanent, and never reissued.</li>
        <li>Access to trials 01–05.</li>
        <li>Access to the board as an unranked runner.</li>
        <li>Access unlocks immediately on payment (see section 8).</li>
      </ul>

      <h3>Circuit Pass — £4.99 per month, recurring</h3>
      <ul>
        <li>Trials 06–57.</li>
        <li>A rank on the board.</li>
        <li>New briefings as they are released.</li>
        <li>Renews automatically each month until you cancel. Cancel any time.</li>
      </ul>

      <p>
        Both prices are in <strong>pounds sterling</strong> and are the{' '}
        <strong>total you pay</strong>. No VAT. No additional charges. UK delivery of milestone
        items is included.
      </p>
      <p>An Entry Pass is required before a Circuit Pass. A Circuit Pass alone gives you nothing.</p>

      <h2>5. Milestone items</h2>
      <p>At trials <strong>15, 30, 45 and 57</strong> we send you a physical item.</p>
      <p>
        <strong>
          These are rewards included within your pass. They are not separately purchased, and no
          part of the price is separately attributable to them.
        </strong>
      </p>
      <ul>
        <li>We ask for a delivery address when you reach a milestone. Not before.</li>
        <li>
          We dispatch within <strong>30 days</strong> of the milestone unlocking, provided you
          have given us a valid address.
        </li>
        <li>We currently ship to <strong>[SHIPPING TERRITORIES]</strong>.</li>
        <li>
          If an item arrives damaged, faulty, or not as described, tell us and we will replace
          it. <strong>This does not affect your rights under the Consumer Rights Act 2015,
          which we cannot exclude.</strong>
        </li>
        <li>
          You must hold an active Circuit Pass when a milestone is reached to qualify for items
          at trials 30, 45 and 57.
        </li>
      </ul>

      <h2>6. Your account</h2>
      <ul>
        <li>One account per person. Do not share logins.</li>
        <li>You are responsible for keeping your password secure.</li>
        <li>Give us accurate information and keep it current.</li>
        <li>Tell us immediately at [CONTACT EMAIL] if someone else has your account.</li>
      </ul>

      <h2>7. The board and your display name</h2>
      <ul>
        <li>
          Your <strong>display name is public to other members</strong>. Choose accordingly. Do
          not use your full real name unless you want other members to see it.
        </li>
        <li>Your rank, clear count and progress are visible to other members.</li>
        <li>Only runners with an active Circuit Pass hold a rank.</li>
        <li>You can change your display name in your account at any time.</li>
        <li>
          You can ask us to remove you from the board entirely without losing access to your
          trials. Email [CONTACT EMAIL].
        </li>
        <li>
          Display names that are offensive, impersonate another person, contain slurs, or
          promote a business may be changed or removed by us.
        </li>
      </ul>

      <h2>8. Immediate access and your cancellation right</h2>
      <p>You have a legal right to cancel a distance contract within <strong>14 days</strong>.</p>
      <p>
        Because your trials unlock immediately on payment,{' '}
        <strong>
          we ask you to give up that right in respect of digital content supplied immediately
        </strong>{' '}
        — otherwise we would have to make you wait 14 days before you could start.
      </p>
      <blockquote>
        I want access to my trials straight away, and I understand that once access is given I
        lose my 14-day right to cancel the digital content I have received.
      </blockquote>
      <p>If you do not tick this, we cannot give you immediate access.</p>
      <p>
        <strong>This is limited.</strong> It applies only to digital content already supplied. It
        does <strong>not</strong> affect your right to cancel your Circuit Pass at any time, our
        voluntary refund promises in the{' '}
        <Link to="/refunds">Cancellation &amp; Refund Policy</Link>, your rights if the service
        is faulty or not as described, or your rights in respect of any milestone item.
      </p>

      <h2>9. Payment</h2>
      <ul>
        <li>
          Payments are processed by <strong>Stripe Payments UK Limited</strong>. We never see or
          store your full card number.
        </li>
        <li>
          The Circuit Pass renews automatically each month on the anniversary of your first
          subscription payment, at £4.99, until cancelled.
        </li>
        <li>We email you a receipt for every payment. Every receipt tells you how to cancel.</li>
        <li>
          <strong>Cancel any time</strong> from your account. It takes effect at the end of your
          current paid month and you keep access until then.
        </li>
        <li>
          If a payment keeps failing your Circuit Pass will lapse and trials 06+ will lock.{' '}
          <strong>Your cleared lines stay cleared.</strong>
        </li>
        <li>
          We may change our prices. Existing subscribers get at least{' '}
          <strong>30 days’ notice by email</strong> and can cancel before a change takes effect.
        </li>
      </ul>

      <h2>10. What you may and may not do</h2>
      <p>You may use the briefings for your own personal, non-commercial use. You may not:</p>
      <ul>
        <li>copy, republish, screenshot, share, resell or redistribute any briefing;</li>
        <li>share your account or your access;</li>
        <li>attempt to reach trials you have not unlocked, or bypass any access control;</li>
        <li>submit false clears, or manipulate the board;</li>
        <li>scrape, crawl or automate access to the service;</li>
        <li>use the service to harass, abuse or threaten anyone.</li>
      </ul>

      <h2>11. If we suspend or close your account</h2>
      <p>
        We may suspend or close your account if you seriously or repeatedly breach these Terms,
        if we reasonably suspect fraud or chargeback abuse, or if we are required to by law.
        Where we reasonably can, we will tell you why first. If we close your account for a
        breach you did not commit, we will refund the unused portion of any pass you paid for.
      </p>

      <h2>12. Changes</h2>
      <p>
        If we make a change to these Terms that materially affects you, we will give you at
        least <strong>30 days’ notice by email</strong>. If you do not accept it, you may cancel
        before it takes effect and we will refund any unused portion of a pass.
      </p>

      <h2>13. Our responsibility to you</h2>
      <p>
        <strong>
          We do not exclude or limit our liability to you in any way where it would be unlawful
          to do so. This includes liability for death or personal injury caused by our
          negligence, for fraud or fraudulent misrepresentation, and for any liability that
          cannot be excluded or limited under English law.
        </strong>
      </p>
      <p>Subject to that:</p>
      <ul>
        <li>
          We supply written briefings.{' '}
          <strong>
            We are not your coach, trainer, instructor, supervisor or medical adviser, and we do
            not undertake any of those roles.
          </strong>
        </li>
        <li>We are not responsible for losses that were not reasonably foreseeable.</li>
        <li>We are not responsible for business losses.</li>
        <li>We do not guarantee the service will be uninterrupted or error-free.</li>
        <li>
          Where our liability can lawfully be limited, our total liability for all claims in any
          12-month period is limited to the total amount you paid us in that period.{' '}
          <strong>This limit does not apply to death or personal injury caused by our
          negligence.</strong>
        </li>
      </ul>

      <h2>14. Complaints</h2>
      <p>
        Email [CONTACT EMAIL] with “COMPLAINT” in the subject. We aim to acknowledge within{' '}
        <strong>2 working days</strong> and resolve within <strong>14 days</strong>. You can also
        contact the <strong>Citizens Advice consumer service</strong> on{' '}
        <strong>0808 223 1133</strong>.
      </p>

      <h2>15. Law and jurisdiction</h2>
      <p>
        These Terms are governed by the law of <strong>England and Wales</strong>. If you live in
        Scotland or Northern Ireland, you may also bring proceedings in your home courts.
      </p>
    </LegalLayout>
  )
}
