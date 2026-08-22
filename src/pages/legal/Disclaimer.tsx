import LegalLayout from './LegalLayout'

/** The PAR-Q screening list is exported so the signup gate shows the same text
 *  it records consent against — they must never drift apart. */
export const SCREENING_VERSION = '1.0'

export const SCREENING_QUESTIONS = [
  'A doctor has said you have a heart condition, or that you should only do physical activity recommended by a doctor.',
  'You get chest pain during physical activity, or you have had chest pain when not physically active.',
  'You lose your balance because of dizziness, or you have lost consciousness.',
  'You have a bone, joint or soft-tissue problem that could be made worse by physical activity.',
  'You are taking prescribed medication for blood pressure or a heart condition.',
  'You have asthma, diabetes, epilepsy, high or low blood pressure, or any other long-term condition affected by exertion.',
  'You are pregnant, have given birth in the last six months, or are undergoing fertility treatment.',
  'You are recovering from surgery, illness or injury.',
  'You have any history of exercise-related collapse, blackout or seizure.',
  'You know of any other reason you should not do strenuous physical activity.',
]

export default function Disclaimer() {
  return (
    <LegalLayout title="Health & Safety Disclaimer" updated="[DATE]" version={SCREENING_VERSION}>
      <p><strong>Read all of this. Do not skim it.</strong></p>

      <h2>1. What this is</h2>
      <p>
        The 57 Trials asks you to do physical things. Some of them are hard. All physical
        activity carries risk of injury, and in rare cases serious injury.
      </p>
      <p>
        This page tells you what we are responsible for, what you are responsible for, and what
        the law says about both. It is part of our Terms of Service.
      </p>

      <h2>2. What we are — and what we are not</h2>
      <p>We write briefings. You read them and decide what to do.</p>
      <p><strong>We are not:</strong></p>
      <ul>
        <li>your coach, trainer or instructor;</li>
        <li>your supervisor;</li>
        <li>a medical professional, and nothing here is medical advice;</li>
        <li>present, watching, or able to help if something goes wrong.</li>
      </ul>
      <p><strong>We do not:</strong></p>
      <ul>
        <li>assess your fitness;</li>
        <li>know your medical history;</li>
        <li>see where you train, what equipment you use, or whether anyone is with you;</li>
        <li>verify what you actually did.</li>
      </ul>
      <p>
        <strong>You decide</strong> what to attempt, when, where, how hard, and when to stop.
        Every single time.
      </p>

      <h2>3. Before you start — screen yourself</h2>
      <p>
        Before your account is created we show you the questions below. Answer them honestly,
        to yourself.
      </p>
      <p>
        <strong>
          If any of them apply to you — or if you are unsure — talk to your doctor before you
          attempt any trial.
        </strong>
      </p>
      <ul>
        {SCREENING_QUESTIONS.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <p>
        <strong>We do not record your answers.</strong> We record only that you confirmed, the
        version of the questions shown, and the date. Your health details stay yours.
      </p>
      <p>
        <strong>Re-screen yourself.</strong> Things change. If your health changes at any point
        during the 57, stop and reassess. Do not assume the confirmation you gave on day one
        still holds on day two hundred.
      </p>

      <h2>4. Your responsibilities</h2>
      <p>By taking part you agree that you will:</p>
      <ul>
        <li><strong>Be honest</strong> in your screening confirmation.</li>
        <li><strong>Get medical clearance</strong> where any screening question applies to you.</li>
        <li><strong>Warm up</strong> properly and <strong>build up gradually</strong>.</li>
        <li>
          <strong>Choose a safe place</strong> — appropriate surface, adequate space and light,
          no hazards, and somewhere you can summon help where relevant.
        </li>
        <li><strong>Use safe, well-maintained equipment</strong> you know how to use.</li>
        <li>
          <strong>Stop immediately</strong> on chest pain, pressure or tightness; shortness of
          breath beyond normal exertion; dizziness, faintness or nausea; sharp or sudden pain;
          numbness or tingling; palpitations; or anything else that feels wrong.{' '}
          <strong>Seek medical attention. Do not push through it.</strong>
        </li>
        <li>
          <strong>Not attempt any trial</strong> while unwell, injured, exhausted, dehydrated,
          or under the influence of anything affecting judgement or coordination.
        </li>
        <li>
          <strong>Adapt or skip</strong> anything that is not safe for you.{' '}
          <strong>Nothing in the 57 is worth an injury.</strong> A rank is not worth an injury.
          There is no penalty for scaling a trial down and no one is checking.
        </li>
        <li><strong>Tell someone</strong> where you are if a trial takes you somewhere isolated.</li>
        <li>Comply with the law and with the rules of any premises you use.</li>
      </ul>

      <h2>5. You accept the inherent risks</h2>
      <p>
        You understand and accept that physical activity carries inherent risks including, but
        not limited to: muscle strains, sprains and tears; joint injuries; fractures; cuts,
        bruises and abrasions; heat exhaustion; dehydration; exhaustion and fainting;
        aggravation of an existing condition; and, in rare cases, serious injury, cardiac
        events, or death.
      </p>
      <p>You accept those inherent risks voluntarily and take part at your own risk.</p>

      <h2>6. The limits of this disclaimer — read this carefully</h2>
      <p>We are being straight with you here, because a lot of businesses are not.</p>
      <p>
        <strong>
          Nothing in this disclaimer, and nothing you tick, excludes or limits our liability for
          death or personal injury caused by our negligence. It cannot. Under section 2(1) of
          the Unfair Contract Terms Act 1977 and section 65 of the Consumer Rights Act 2015, any
          attempt to do that would be void and unenforceable, and we are not attempting it.
        </strong>
      </p>
      <p>
        Nor do we exclude liability for fraud or fraudulent misrepresentation, or anything else
        that cannot lawfully be excluded.
      </p>
      <p><strong>What this disclaimer does do:</strong></p>
      <ul>
        <li>Tells you clearly what the risks are, so you can decide with your eyes open.</li>
        <li>Records that you screened yourself and confirmed you are fit to take part.</li>
        <li>Sets out what we do and do not undertake to do for you.</li>
        <li>
          Makes clear you accept the risks inherent in physical activity itself, as opposed to
          any failure of care on our part.
        </li>
      </ul>
      <p><strong>What it does not do:</strong></p>
      <ul>
        <li>It does not stop you claiming if we were negligent and you were hurt as a result.</li>
        <li>It does not take away any of your statutory rights.</li>
      </ul>
      <p>
        If you are ever seriously injured and you believe we were at fault,{' '}
        <strong>get independent legal advice</strong>. Nothing on this page should stop you.
      </p>

      <h2>7. Emergencies</h2>
      <p>
        <strong>In an emergency in the UK, call 999.</strong> For urgent but non-emergency
        medical advice, call <strong>111</strong>.
      </p>
      <p>
        Do not contact us first. We cannot help you medically and we may not see your message
        for hours.
      </p>

      <h2>8. Under 18s</h2>
      <p>The 57 Trials is for adults. <strong>You must be 18 or over.</strong></p>
    </LegalLayout>
  )
}
