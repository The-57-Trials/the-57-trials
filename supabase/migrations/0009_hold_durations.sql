-- 0009: HOLD trials now actually take as long as they say they do.
--
-- A HOLD trial has a duration and nothing enforced it - a member could open
-- SEVEN GLASSES and clear it the same day. min_gap_minutes on trial N gates
-- CLEARING N against when N-1 was cleared, and N opens the moment N-1 clears,
-- so that field already expresses "this trial takes D days" exactly. No new
-- column is needed: the gap is a cooldown when trial_type is not HOLD, and is
-- the trial itself when it is.
--
-- Value is max(cooldown, duration) - a duration must never shorten a cooldown
-- that D2 set for recovery reasons.

update public.trials set min_gap_minutes = v.mins
from (values
  ( 5, 10080),  --  7 days · SEVEN GLASSES     (was 1440)
  (10, 14400),  -- 10 days · THE SAME HOUR     (was 1440)
  (11,  7200),  --  5 days · SILENT HOUR       (was 1440)
  (16,  7200),  --  5 days · THE EARLY BIB     (was 1440)
  (21, 30240),  -- 21 days · TWENTY-ONE DAYS   (was 1440)
  (27, 10080),  --  7 days · SEVEN AND SEVEN   (was 2880)
  (43,  4320),  --  1 day  · THE REST DAY      (cooldown already longer)
  (51, 10080)   --  7 days · THE QUIET WEEK    (cooldown already equal)
) as v(num, mins)
where public.trials.num = v.num;
