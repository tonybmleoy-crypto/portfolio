# Portfolio analytics: measurement version 2

The public site sends events only from `lopatinanton.vercel.app`. Development,
preview, admin, lab and other non-public routes are excluded at collection.
The existing PostHog anonymous identity is preserved; no user fingerprinting is added.

## Excluding owner visits and tests

Open `https://lopatinanton.vercel.app/?analytics_internal=1` once in each browser
used for editing or reviewing the site. The marker persists in that browser's
local storage. `?analytics_internal=0` removes the marker. This does not mark
past visits or other browsers, and storage restrictions can prevent persistence.

For QA, open `?analytics_test=1`. This marks all events in that tab's session as
test traffic. `?analytics_test=0` resets it. Neither marker authenticates a user.
Every event carries `analytics_traffic` (`external`, `internal`, `test`) and
`measurement_version` (`2`). Do not infer these properties for old events.

## Event definitions

| Event | Definition |
| --- | --- |
| `portfolio_viewed` | Public route rendered; funnel entry, once per route visit. Native `$pageview` remains the pageview metric. |
| `case_selected` | Explicit case-card click; records card position and placement. |
| `case_card_seen` | At least 50% of a card visible and focused for 1s, or an explicit click. Once per card/position/placement per route visit. |
| `case_viewed` | Case route rendered, with entry method (`link`, `auto_scroll`, `direct_or_external`, `history_or_navigation`). |
| `case_auto_advanced` | The existing scroll-to-next-case behavior initiated navigation; not a manual case selection. |
| `case_scroll_depth` | Case body reached 50% or 90%; once per threshold per visit. Not proof of reading. |
| `case_engaged` | At least 30 seconds while visible and focused, plus at least 50% of the case body reached. Once per visit. Not proof of reading. |
| `contact_opened` | Contact dialog actually opened, with profile, case-nav or keyboard placement. |
| `contact_intent` | Explicit Telegram/email link click or successful email copy. An intention, not a confirmed message or lead. |
| `resume_opened` | Resume link clicked. Not a confirmed download or read. |
| `social_opened` | LinkedIn/Behance link clicked; not included in contact intent. |

The engagement timer is capped between samples to avoid counting browser suspension.
Background/unfocused time is excluded. Custom actions can change native bounce and
session-duration behavior; avoid comparing those metrics across instrumentation versions.

## Reporting

Use the production host, existing test-account filters and native bot classification.
Exclude internal/test traffic. For version-2 action funnels, require
`measurement_version = 2` and `analytics_traffic = external`. Keep historical
pageviews as a separate legacy period rather than interpreting missing new events as zero conversion.

Use ordered, same-session funnels. Report step counts as well as percentages.
Case-to-contact funnels must keep the same case identifier when evaluating a case.
Case selection rates use `case_card_seen` as the exposure denominator, matching
card slug, position and placement; card clicks alone cannot show that a lower-position cover is worse. Do not compare raw case opens as
unbiased interest, particularly when automatic next-case navigation is included.

## Tagged links to distribute

Use these for new links; existing visits cannot be attributed retroactively.

- Telegram: `https://lopatinanton.vercel.app/?utm_source=telegram&utm_medium=social&utm_campaign=portfolio`
- LinkedIn: `https://lopatinanton.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio`
- Behance: `https://lopatinanton.vercel.app/?utm_source=behance&utm_medium=referral&utm_campaign=portfolio`
- Resume: `https://lopatinanton.vercel.app/?utm_source=resume&utm_medium=document&utm_campaign=portfolio`

Do not put names, email addresses or other personal data in campaign parameters.
