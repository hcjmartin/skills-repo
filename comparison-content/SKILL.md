---
name: "comparison-content"
description: "Use when writing, auditing or updating public competitor comparison content (pages, blog posts or articles): X vs Y, alternatives, \"best X tools\" roundups and feature tables, including fairness reviews and keeping pricing and features current."
license: MIT
---

# Comparison content that stays fair and stays accurate

Comparison content is one of the highest-converting forms of content a company can publish, and one of the easiest to get wrong. It goes wrong in two ways: it reads as biased (and loses the reader's trust), or it goes stale (and spreads misinformation). This skill covers both: how to write pages that are fair to competitors while still showing your strengths, and how to keep them accurate over time.

## Why comparison content is worth it

A reader searching "A vs B" or "best X tools" has already decided they need *something*; the only question left is which one. Comparison content sits at the exact point in the funnel where that decision is made. Your job is to help them make it well, ideally in your favour, but not always.

One multi-year case study of ~90 comparison pages found:

| Content type | Relative conversion to signup |
| --- | --- |
| Head-to-head comparisons (You vs X) | ~10% (≈4× a typical blog post) |
| Alternatives and "best X tools" roundups | ~4% (≈1.5×) |
| All other blog posts | ~2.5% (baseline) |

Roughly half of comparison-driven signups happened within 24 hours of reading, and about three quarters within 30 days. Roundups drive more traffic; head-to-heads convert better. A good program has both.

## The common hesitations (and the answers)

1. **"It feels unnatural to praise competitors on our own site."** Crediting a competitor is the cheapest trust signal in content marketing and almost nobody does it. Do it.
2. **"The maintenance overhead is too high."** Competitors ship, reprice, get acquired. A page written in March can be wrong by June. This is solvable, but only if you treat it as an engineering problem (see Maintenance below), not a calendar reminder.

## Two non-negotiable principles

1. **Do no harm.** No trash-talking, no straw-manning, no sneaky tricks. Admit when and where a competitor is better.
2. **Respect the reader's intelligence and meet them where they are.** The reader is smart, busy, and halfway to a decision. Give them the answer as accurately and directly as possible and let them make the right call for their use case. Readers can spot generic, AI-generated comparison filler instantly, and it's a bad look.

## Choosing what to compare

- **Follow your product.** Every new product or capability you launch brings a new set of competitors. Plan comparison content alongside launches.
- **Compare on your wedge.** Early on, compare on the axis that genuinely differentiates you (e.g. open source, pricing model, all-in-one vs point solution). That's what the reader you're best for cares about.
- **Use all three formats:**
  - *Head-to-head* ("You vs Competitor"): highest conversion, highest maintenance.
  - *Alternatives* ("Best Competitor alternatives"): captures people already unhappy or evaluating away from a tool.
  - *Roundups* ("Best X tools", "Best open source X tools"): largest audience, longest shelf life.
- **Scale deliberately.** A handful of pages can be maintained by hand. Once you're past ~10 pages, each with feature tables and pricing that changes quarterly, set up the maintenance system before writing more.

## Writing the page: be the comparison you'd want to read

You won't have every feature every competitor has. Say so. Your credibility with the reader is worth more than anything you'd "win" by fudging. You are not the right solution for everyone; you're the best solution for *someone*, and the page's job is to capture *that* reader. That means occasionally losing a deal on your own website. Accept it and focus on your ideal customer.

### Habits to adopt

**1. Acknowledge your gaps and credit their wins.**
- Write sentences like: "If you need X, they do it better than we do today."
- It's fine to soften with what's coming (a roadmap link, "we're working on it"), but be unambiguous about where you are *right now*, because the reader is deciding today.
- When you ship the missing capability, update the page. Content should match what you've shipped, not what you aspire to.

**2. Write a "Who should pick them" section.**
- If you can't write a fair paragraph about where the competitor wins and who it suits better, you don't understand them well enough to compare. Go read their docs.
- Use the same section to be honest about who you are and aren't building for (e.g. "they're built primarily for marketers; we're built primarily for engineers").
- A reader who isn't a fit should leave feeling *helped*, not hustled.

**3. Write for LLM readers too.**
- Answer engines increasingly synthesize comparisons, and they plausibly favor sources that read as balanced. Read like a source, not an ad.
- Honesty used to be purely a brand decision; it is now also a distribution decision.

**4. Take corrections from competitors, and invite them.**
- Explicitly welcome competitors to email, message, or submit corrections (even pull requests if your content source is public).
- Merge valid corrections quickly and gracefully. When offered humble pie, eat it.
- Dodgy comparisons are the fastest way to go viral for the wrong reasons on developer forums and social media. Fair ones don't make enemies.

**5. Be careful with feature mapping.**
- Vendors use different names for the same feature, and some have hundreds of features. Research what a competitor's feature actually does before marking it missing.
- Tables have no "sort of" column, so every row is a judgment call. When it's genuinely partial, say so in a footnote or note rather than forcing a yes/no.
- Expect to get some wrong. Build the process so wrong answers get fixed fast.

### The litmus test

Before publishing, ask: *If this competitor wrote this exact page about us, how would I feel reading it?* Would it feel like they did their homework, or would I feel misrepresented and annoyed? If the latter, rewrite.

### Suggested page structure (head-to-head)

1. **TL;DR**: a direct, two-to-four sentence answer: the core difference and who each tool suits.
2. **At a glance**: product scope, pricing model, deployment options (cloud/self-host), target user.
3. **Feature comparison table**: rendered from structured data (see Maintenance), grouped by product area.
4. **Where we're stronger**: specific and evidence-backed, no superlatives.
5. **Where they're stronger**: specific and generous.
6. **Pricing comparison**: model, free tier, how cost scales; link to both pricing pages and date-stamp it.
7. **Who should pick them / who should pick us**: honest fit guidance, including who you're not built for.
8. **Migration or getting-started notes**, if relevant.
9. **Last reviewed date** and an invitation for corrections.

For roundups and alternatives pages: state your selection criteria up front, include yourself honestly (not always at #1 if that's not true for the stated criteria), give each tool a fair "best for" line, and include its genuine weaknesses alongside yours.

## Maintaining pages: treat accuracy as an engineering problem

### 1. One centralized data file per competitor

Keep everything you claim about each competitor in a single structured file (one file per company), and render every comparison table from those files through a single shared component. Example shape:

```typescript
export const competitorName = {
  name: 'Competitor',
  products: {
    error_tracking: {
      available: true,
      features: { source_maps: true, issue_grouping: true /* ... */ },
    },
    session_replay: { available: true, features: { /* ... */ } },
    product_analytics: { available: false },
  },
  platform: { self_hosting: true, sso: 'Business plan and above' /* ... */ },
  pricing: { model: 'Usage-based, per event and per replay' },
  lastVerified: '2026-01-15',
}
```

- **Shared feature dictionary:** feature keys come from one dictionary, so a feature means the same thing on every page it appears on.
- **Update once, publish everywhere:** when a competitor ships something, change one line in one file and every page mentioning them updates on the next deploy.
- **Consider making the files public.** Competitors can then see exactly what you claim and submit corrections directly, which is the best accuracy mechanism you'll get for free.
- Keep your own product's capabilities in the same structured format so both sides of every table come from data.

### 2. Automated drift detection, with a human in the loop

Data files solve "update once," not "notice that something changed." Run two recurring monitors (an agent or scheduled job):

- **Competitor monitor:** reads each competitor data file, visits that competitor's pricing and docs pages, and reports where what they say and what you say have drifted apart.
- **Self monitor:** reads your comparison pages against your own changelog, docs, in-flight work and internal discussions, and flags where you're *underselling yourself*. Understating your own product is a surprisingly common and embarrassing error, especially if you ship fast.

What makes these better than a simple page-change alert:

1. **Memory between runs**: it doesn't re-flag the same thing every week, and it learns what "normal" looks like for each site.
2. **Selective by design**: most runs should end with nothing to report. It ignores changes that don't affect the comparison.
3. **Shows its evidence**: what their page says now, what your file says, a suggested edit, and sources.
4. **A human ships the fix**: the monitor posts a digest to a team channel with a link to open the change. A person decides whether it's warranted, makes the edit, and merges it.

The monitor notices; a human decides. Nobody needs a recurring task to manually re-read every competitor's pricing page.

### 3. Periodic content passes

Beyond data accuracy, schedule periodic reviews of the prose itself: tone, fairness, whether "who should pick them" still holds, and whether claims about your own roadmap are now out of date.

## Workflow when asked to write a comparison page

1. Identify the format (head-to-head, alternatives, roundup) and the target reader (who you're best for).
2. Research the competitor from primary sources: their docs, pricing page, and changelog. Note dates.
3. Populate or update the competitor's structured data file using the shared feature dictionary. Flag ambiguous feature mappings.
4. Draft using the structure above, including explicit "where they're stronger" and "who should pick them" sections.
5. Check that every claim about your own product reflects what's shipped today, not the roadmap.
6. Apply the litmus test. Strip superlatives, straw men and unsupported claims.
7. Add a last-reviewed date and a corrections invitation.
8. Confirm the page is covered by the drift monitors.

## Audit checklist for an existing page

- [ ] Pricing and plan details match the competitor's current pricing page
- [ ] No features marked missing that the competitor actually has (check their docs, not just their marketing)
- [ ] Your own recently shipped capabilities are reflected
- [ ] Gaps you've since closed are no longer listed as gaps
- [ ] There is a fair "where they win" / "who should pick them" section
- [ ] No disparaging language or straw-man framing
- [ ] Roadmap claims are clearly labeled as future, not present
- [ ] Passes the litmus test
- [ ] Last-reviewed date is current

## Mindset

You won't reach a final form, and you'll get things wrong. Start anyway. Be fair, be accurate, and automate the noticing so humans only have to do the deciding. Writing honestly about the companies competing with you is counterintuitive, but it's one of the most effective organic content strategies available.

## Source

Adapted from: https://posthog.com/blog/comparison-content-guide.md (MIT-licensed source material, copyright PostHog Inc.). See `LICENSE` for full terms.