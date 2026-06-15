# RoughTools — Complete Growth & Revenue Strategy
# Target: $100/day ($3,000/month) from Google AdSense + affiliate income
# Written: June 2026

---

## THE HARD TRUTH FIRST

$100/day = $3,000/month from AdSense.
At a blended RPM of $10–14 (realistic for your niche mix), you need **215,000–300,000 visits/month**.

604 pages is a massive advantage. Most new tool sites launch with 20–50 pages.
You have a 12–15x head start on content volume.

But traffic does NOT come from pages alone. It comes from:
1. Google trusting your domain (takes 6–12 months minimum)
2. Pages ranking for specific keywords (requires content + links)
3. People sharing and linking to your tools (requires outreach)

**Realistic timeline: $100/day is achievable in 14–18 months** if you execute
this strategy every week without stopping. Sites like CalculatorSoup, Omni Calculator,
and SmallPDF all followed this same arc from zero.

---

## PHASE 1 — MONTHS 1–4: Foundation & Indexing
### Target: 5,000–15,000 visits/month | Revenue: $5–$50/month

The goal in phase 1 is NOT revenue. The goal is getting all 604 pages
indexed by Google and establishing domain authority.

### Week 1 checklist (do this on launch day)

- [ ] Deploy to Vercel (free tier is fine until 100K+ visits/month)
- [ ] Go to Google Search Console → Add property → Verify domain
- [ ] Submit sitemap: https://roughtools.com/sitemap.xml
- [ ] Go to Bing Webmaster Tools → Submit sitemap (10% extra free traffic)
- [ ] Go to Yandex Webmaster (5% extra — don't skip)
- [ ] Create Google Analytics 4 property → paste measurement ID in .env
- [ ] Submit to these FREE directories TODAY:
  - https://www.producthunt.com (launch on Tuesday 12:01 AM PST)
  - https://alternativeto.net (list as alternative to CalculatorSoup, SmallPDF, ILovePDF)
  - https://www.saashub.com
  - https://toolify.ai
  - https://www.capterra.com (free listing)
  - https://www.getapp.com
  - https://stackshare.io
  - https://www.g2.com (free listing)
  - https://slant.co
  - https://www.futurepedia.io

### Month 1–2: Get 100% of pages indexed

Google will NOT automatically index all 604 pages quickly. You must help it.

**Check indexing status weekly in Google Search Console:**
- Coverage report → Indexed count should grow each week
- If pages are "Discovered but not indexed" → they need more internal links

**Internal linking fixes (critical — currently 70% on audit):**

Every tool page must link to at least 3–5 related tools. Your `relatedSlugs`
in SEO configs does this — verify it is rendering on every page.

Add these cross-category links manually on your most important pages:
- Mortgage Calculator → links to: Loan Calculator, Tax Calculator, Down Payment Calculator, Salary Calculator
- BMI Calculator → links to: Calorie Calculator, Body Fat Calculator, Pregnancy Weight Calculator
- GFR Calculator → links to: eGFR medical reference, Creatinine calculator, Blood pressure checker
- PDF Compress → links to: PDF to Word, Merge PDF, Remove Password, Split PDF

**Create 3 "hub" pages that link to clusters of related tools:**
- /tools/calculators/finance — "35 Free Financial Calculators" (links all finance calcs)
- /tools/calculators/health — "28 Free Health & Medical Calculators" (links all medical)
- /tools/calculators/math — "40 Free Math & Statistics Calculators"
These pages will rank for "free financial calculators" type queries within 3–4 months.

### Month 3–4: Apply for AdSense

Requirements Google looks for (unofficial but verified by thousands of publishers):
- Site must be live for at least 3 months
- At least 500–1,000 visits/month (more is better)
- Original, useful content (you have this)
- Clear navigation, privacy policy, about page, contact page
- No broken pages, no thin content (check your medical/engineering dynamic pages)
- HTTPS everywhere (Vercel handles this automatically)

**When you apply:**
- Use the exact domain: roughtools.com (not www.)
- Make sure ads.txt is updated with your real pub-XXXXXXXX ID
- Apply through adsense.google.com → Add site
- Approval takes 1–14 days

---

## PHASE 2 — MONTHS 5–10: Content Machine
### Target: 30,000–80,000 visits/month | Revenue: $300–$900/month

This phase is where most site owners give up. Don't. The work you do in
months 5–10 determines whether you hit $100/day or plateau forever.

### The content strategy that actually works

**Your 604 tool pages rank for "calculator" + specific term queries.**
Example: your mortgage calculator ranks for "mortgage calculator"
But your blog ranks for "how much house can I afford with $80,000 salary"

Blog posts capture the research phase BEFORE users need a calculator.
Tool pages capture users WHO ALREADY KNOW what they want.

You need BOTH to dominate a topic.

### Keyword research — where to find winning topics

**Free method (use Ahrefs free version or Google Search itself):**

Search Google for: "mortgage calculator" → look at "People also ask" and
"Related searches" at the bottom. Every single one is a blog post topic.

**Your top 50 blog post topics by estimated search volume:**

FINANCIAL (highest RPM — write these first):
1. "How much house can I afford on [salary]" — 50,000 searches/month
2. "How to calculate monthly mortgage payment manually" — 22,000/mo
3. "What credit score do I need to buy a house" — 40,000/mo
4. "How much should I have saved for retirement by 40" — 30,000/mo
5. "How to calculate compound interest step by step" — 18,000/mo
6. "What is a good debt-to-income ratio" — 25,000/mo
7. "How much do I need to retire at 55" — 35,000/mo
8. "How to calculate your net worth" — 20,000/mo
9. "What is APR vs interest rate" — 28,000/mo
10. "How much to save each month to become a millionaire" — 15,000/mo

MEDICAL (second highest RPM):
11. "What is a normal eGFR for my age" — 40,000/mo
12. "How to calculate BMI manually" — 35,000/mo
13. "What is a healthy body fat percentage by age" — 45,000/mo
14. "How many calories should I eat to lose weight" — 90,000/mo (huge!)
15. "What week of pregnancy am I in" — 60,000/mo (huge!)
16. "When did I get pregnant based on due date" — 30,000/mo
17. "What is a normal blood pressure for my age" — 55,000/mo
18. "How to calculate ideal body weight" — 25,000/mo
19. "What is the fertile window" — 40,000/mo
20. "When does morning sickness start and end" — 35,000/mo

MATH & STATISTICS:
21. "How to calculate standard deviation by hand" — 40,000/mo
22. "What is a z-score and how to interpret it" — 30,000/mo
23. "How to find mean median mode" — 80,000/mo (huge!)
24. "How to calculate percentage change" — 55,000/mo
25. "How to solve quadratic equations step by step" — 45,000/mo
26. "What is the difference between permutation and combination" — 35,000/mo
27. "How to calculate probability" — 50,000/mo
28. "What is the rule of 72 in finance" — 20,000/mo
29. "How to read a normal distribution curve" — 25,000/mo
30. "How to calculate slope of a line" — 60,000/mo

ENGINEERING & TECHNICAL:
31. "Ohm's law calculator explained" — 30,000/mo
32. "How to calculate concrete for a slab" — 25,000/mo
33. "How to wire a 3-way switch" — 80,000/mo (huge — link to your tools!)
34. "How much does it cost to build a deck per square foot" — 35,000/mo
35. "How to calculate roof pitch and materials" — 20,000/mo

PDF & DOCUMENT TOOLS:
36. "How to compress a PDF without losing quality" — 45,000/mo
37. "How to convert PDF to Word for free" — 90,000/mo (massive!)
38. "Best free PDF editors 2025" — 60,000/mo
39. "How to remove a password from a PDF" — 35,000/mo
40. "How to merge PDF files for free" — 50,000/mo

LEGAL (highest RPM by far):
41. "Free NDA template for freelancers" — 20,000/mo
42. "How to write a non-disclosure agreement" — 15,000/mo
43. "Free privacy policy generator for website" — 25,000/mo
44. "Simple lease agreement template free" — 30,000/mo
45. "Employment contract template free download" — 20,000/mo

DEVELOPER TOOLS:
46. "How to format JSON online free" — 35,000/mo
47. "Best online regex tester tools" — 20,000/mo
48. "How to decode a JWT token" — 25,000/mo
49. "SHA256 hash generator online" — 30,000/mo
50. "Best free online password generator secure" — 40,000/mo

### Blog post format that ranks (use this template for every post)

Title: "How to [do X]: [specific detail]" or "[Number] Free [Tool] Calculators"
Length: 1,500–2,500 words
Structure:
  - H1: Main title with primary keyword
  - First 100 words: Answer the question immediately (Google rewards this)
  - Embedded tool: Put your relevant calculator/tool RIGHT AFTER the intro
  - H2: "How to use the [Tool Name]" — 3–4 paragraphs
  - H2: "Formula / Method explained" — show the math
  - H2: "[Specific question from People Also Ask]"
  - H2: "[Another PAA question]"
  - H2: "Frequently Asked Questions" — 5–7 Q&As (targets featured snippets)
  - H2: "Related Tools" — internal links to 4–6 related pages
  - CTA: "Use our free [tool name] →"

**Publishing schedule:**
- Months 5–6: 3 posts per week (12/month)
- Months 7–8: 4 posts per week (16/month)
- Months 9–10: 5 posts per week (20/month)

This sounds like a lot. Use AI (Claude, ChatGPT) to write first drafts in 20 minutes.
YOU add the specific data, examples, and links to your tools. Do NOT publish
100% AI content without editing — Google's Helpful Content system will detect it
and suppress your rankings.

### Content that gets backlinks naturally (link bait)

These specific pages/posts attract links WITHOUT you asking:

1. **"Free [Category] Calculator — the most accurate online"** + show methodology
   Example: "The Most Accurate BMI Calculator: Why Standard BMI Is Misleading"
   Fitness bloggers link to alternatives that acknowledge BMI limitations.

2. **Interactive data visualizations**
   Example: "Compound Interest Calculator with Chart" (you already have this!)
   Finance bloggers love embedding or linking to visual calculators.

3. **"[Tool] vs [Competitor]" comparison pages**
   Example: "RoughTools vs CalculatorSoup: Which Is More Accurate?"
   These rank fast and get clicks from users researching tools.

4. **"Free [Legal Document] Template (Updated 2025)"**
   Your legal tools pages. Small business blogs and freelancer sites link to
   free contract templates constantly.

5. **Annual salary / cost of living data posts**
   "Average Salary in Every US State 2025" — generates dozens of backlinks from
   local news, HR blogs, and job boards.

---

## PHASE 3 — MONTHS 11–18: Authority & Scale
### Target: 200,000–300,000+ visits/month | Revenue: $2,000–$4,500/month

### Backlink acquisition (the only way to dominate Google long-term)

Backlinks = other websites linking to you. Google treats each backlink as a
"vote of trust." Without backlinks, even perfect content ranks below competitors
who have been around longer.

**Tier 1: Easy wins (do these in months 1–2, keep doing forever)**

Reddit strategy (do NOT spam — genuinely help people):
- r/personalfinance (15M members) — answer mortgage/debt/savings questions,
  link to your calculator when it genuinely helps
- r/Frugal (3M) — link to your savings/debt calculators
- r/medicine (1M) — link to GFR, BMI, drug calculators when answering questions
- r/learnmath (1M) — link to statistics, algebra, geometry calculators
- r/devops / r/webdev (5M) — link to your developer tools
- r/Entrepreneur (2M) — link to your legal templates when people ask about NDAs
- r/freelance (800K) — link to contract templates, salary calculator

Post 2–3 times per week as a community member. Link naturally.
Each Reddit thread that links to you: 50–500 direct visits + Google trust signal.

Quora strategy (same approach):
- Answer questions about calculators, tools, formulas
- Link to your tool as "I use this free calculator at roughtools.com"
- Quora answers rank in Google for years

**Tier 2: Guest posting (months 3–6)**

Write a useful article for someone else's blog that includes a link back to yours.

Target blogs in these niches:
- Personal finance blogs (NerdWallet, The Balance, Investopedia at smaller scale)
- Pregnancy/parenting blogs (BabyCenter, WhatToExpect type sites)
- Engineering/construction blogs
- Developer tutorial sites (dev.to, Hashnode, Medium)
- Freelancer/small business blogs

Email template that works:
---
Subject: Guest post idea for [their site name]

Hi [Name],

I read your post on [specific post] and thought your audience might find
this useful: [your blog post idea] with an embedded [calculator type].

I run RoughTools.com — 604 free online tools including calculators, PDF tools,
and developer utilities. I'd love to contribute a 1,500-word post for your readers.

No payment needed — just a link back to roughtools.com is enough.

Here's a sample of my writing: [link to your best blog post]

Interested?
[Your name]
---

Send 20 of these per week. Expect 3–5% acceptance rate = 3–5 backlinks/month
from legitimate sites. In 6 months: 18–30 quality backlinks.

**Tier 3: Digital PR (months 6–12)**

These get high-authority links (DA 50–90) from major publications:

1. Create a free data tool/study journalists want to share:
   - "We analyzed 10,000 mortgage applications — here's what affects approval"
   - "Cost of living calculator: how far does $100K go in every US city"
   - "The most Googled calculator in every US state"
   These get coverage from Forbes, Business Insider, local news.

2. HARO (Help A Reporter Out) — sign up at helpareporter.com (free)
   Journalists post questions needing expert sources. You answer as "founder of
   RoughTools, a free online tools platform." Include your website URL.
   One Forbes/CNBC link can equal 100 blog-level links in Google's eyes.

3. Broken link building:
   Find competitor pages that are down (use ahrefs.com free version).
   Find who links to the dead page. Email them: "Hey, that link is broken —
   my tool [URL] covers the same topic." About 8–12% say yes.

### Social media strategy (traffic + backlinks)

**Pinterest (UNDERRATED — huge for tool sites)**
Pinterest drives 5–15% of traffic for many calculator/tool sites.
Create pins for:
- Infographic versions of your calculator formulas
- "How to calculate [X] in 3 steps" visual guides
- "Free tools for [profession]" collections

Pinterest pins rank in Google Image Search AND in Pinterest search.
Post 5–10 pins per week. Each pin links to your tool.

**YouTube (months 6+, high effort but high reward)**
Video titles that rank:
- "How to use the compound interest calculator (free tool walkthrough)"
- "I used a free BMI calculator to track my weight loss for 6 months"
- "The most accurate mortgage calculator online — free"

A single YouTube video ranking for "mortgage calculator tutorial" can send
500–2,000 visits/month for years. YouTube is the second largest search engine.

**Twitter/X**
Tweet daily:
- "Did you know you can calculate [interesting formula] instantly at roughtools.com?"
- Share blog posts
- Reply to finance/health/developer influencers in your niche (gets you noticed)

**TikTok/Instagram Reels (if willing)**
Short-form video showing a surprising calculation result:
- "I put in my salary and discovered I need to save $X/day to retire at 55 — use this free tool"
- "This BMI calculator told me something surprising — here's the link"
These go viral occasionally and can send 10,000+ visits in one day.

---

## AD PLACEMENT STRATEGY (maximize RPM)

Standard AdSense placement gets $6–8 RPM.
Optimized placement gets $12–18 RPM. Same traffic, 50–100% more revenue.

### Optimal ad positions for tool pages

Position 1 — Top of page, below hero/title
Type: Responsive display (auto-size)
Why: Users see it before interacting. High viewability = higher CPM.

Position 2 — Between input form and results
Type: In-article ad (300×250 or responsive)
Why: User is waiting for/reading results = highest attention moment.
This single placement typically generates 30–40% of total AdSense revenue.

Position 3 — Between results and "How to Use" section
Type: Large rectangle (336×280) or responsive
Why: Post-task moment — user got what they needed, attention is free.

Position 4 — Related tools section header
Type: Leaderboard (728×90) or responsive
Why: Low-interruption, high-viewability. Good for desktop.

DO NOT place ads:
- Inside the calculator input area (policy violation)
- Overlapping any functional element
- More than 3–4 ad units per page (diminishing returns after 3)

### Ad settings in AdSense dashboard

Enable these (they increase revenue without extra code):
- Auto ads: ON (Google places additional ads where it sees fit — adds 10–20%)
- Anchor ads: ON (sticky banner at bottom of mobile screen — huge mobile RPM boost)
- Vignette ads: ON (full-screen between page loads — high CPM but use sparingly)
- Ad balance: Set to 80% (Google only shows ads when CPC is competitive)

### RPM boosters

1. **Enable Ezoic or Mediavine when you hit 10K visits/month**
   Both platforms use AI-driven ad placement and A/B testing.
   Most publishers see 50–150% RPM increase vs raw AdSense.
   Ezoic: free tier available at 10K visits/month.
   Mediavine: requires 50K sessions/month but pays 2–3x AdSense rates.

2. **Apply to AdThrive (Raptive) at 100K visits/month**
   Premium ad network. Average RPM: $20–40. Invitation/approval required.
   This alone could get you to $100/day at 100K visits/month instead of 300K.

3. **Enable "Sticky ads" via Ezoic or custom CSS**
   A sticky sidebar ad unit that follows the user as they scroll generates
   2–3x the impressions of a static unit in the same position.

---

## REVENUE STREAMS BEYOND ADSENSE

Do NOT rely on AdSense alone. Build 3–4 income streams from the same traffic.

### 1. Affiliate marketing (can equal or exceed AdSense)

**Finance tools → financial product affiliates:**
- LendingTree (mortgage/loan): $30–200 per lead, 30-day cookie
  Add to: mortgage calculator, loan calculator, refinance calculator
- Credible (student loans/mortgages): $50–150 per lead
  Add to: student loan calculator, refinance calculator
- Credit Karma (credit cards): $10–30 per lead
  Add to: credit score calculator, debt payoff calculator
- Quicken Loans / Rocket Mortgage: up to $200 per submitted application
  Add to: mortgage calculator, affordability calculator

**Legal tools → legal service affiliates:**
- LegalZoom: $20–60 per signup
  Add to: NDA generator, LLC formation, business contract pages
- Rocket Lawyer: $15–40 per trial signup
  Add to: all legal document pages

**PDF/Document tools → software affiliates:**
- Adobe Acrobat: $40–90 per signup (12.3% commission on annual plan)
  Add to: PDF tool pages as "need more features?"
- PDFelement by Wondershare: $15–40 per sale
- Nitro PDF: $20–50 per sale

**Security/VPN tools:**
- NordVPN: $30–100 per signup (30–40% commission)
  Add to: VPN checker, password generator, security pages
- ExpressVPN: $20–80 per signup
- Surfshark: $30–60 per signup

**Developer tools:**
- DigitalOcean: $100 per signup (new customer credit)
  Add to: developer tools, network tools pages
- Linode/Akamai: $50 per signup
- GitHub Copilot: 25% commission on first year

**Expected affiliate revenue at different traffic levels:**
- 10K visits/month: $50–150/month
- 50K visits/month: $250–750/month
- 200K visits/month: $1,000–3,000/month (can match AdSense)

### 2. Pro subscription ($9/month)

Your codebase already has this built. Enable it NOW.

What Pro users get:
- Unlimited uses per day (free = 20/day limit)
- No watermarks on exported PDFs
- 200MB max file size (free = 10MB)
- Batch PDF processing (multiple files at once)
- Priority support
- Save calculation history

Conversion rate: 0.5–2% of monthly visitors convert.
At 100K visits/month × 1% conversion = 1,000 subscribers × $9 = $9,000/month
This alone exceeds the $3,000/month AdSense goal at much lower traffic.

**Upgrade prompts to implement:**
- Show "You've used 18/20 free conversions today — upgrade for unlimited" banner
- After PDF export: "Upgrade to remove watermark"
- After 5 calculator uses: subtle "Save your history with Pro" nudge
- Email sequence for registered users: Day 1, Day 3, Day 7 onboarding emails

### 3. Team/API plan ($29/month, $99/month)

Businesses want to embed your tools.

Targets:
- Real estate agents: mortgage calculator embed on their listing pages
- HR professionals: salary/payroll calculator on their company intranets
- Mortgage brokers: affordability calculator embed on their sites
- Accountants: tax calculator for their client portals

Reach these via:
- LinkedIn DMs to real estate agents, mortgage brokers, accountants
- Real estate Facebook groups
- Accounting software forums

### 4. Sponsored content / tool sponsorships (months 12+)

Once you have 50K+ monthly visits, companies will pay to be featured:
- "Mortgage Calculator — powered by [Lender name]": $200–500/month
- "Tax Calculator — in partnership with [Tax Software]": $300–800/month
- Sponsored blog posts about financial tools: $100–500 each

---

## COMPETITIVE ANALYSIS — Who you are beating

These sites earn $50–500/day with tool sites. Study them:

**CalculatorSoup** (calculatorsoup.com)
- ~8M visits/month, DA 65
- 1,000+ calculators, minimal design, massive internal linking
- Revenue est: $300–500/day AdSense
- Lesson: Pure content volume + perfect internal linking = dominance

**Omni Calculator** (omnicalculator.com)
- ~20M visits/month, DA 70
- 3,000+ calculators with detailed explanations
- Revenue est: $1,000–2,000/day AdSense + premium
- Lesson: DEPTH of content per tool page = much higher rankings

**SmallPDF** (smallpdf.com)
- ~30M visits/month, SaaS model
- Revenue: $50M+ ARR from subscriptions
- Lesson: PDF tools = extremely high conversion to paid plans

**ILovePDF** (ilovepdf.com)
- ~15M visits/month
- Revenue: freemium + ads
- Lesson: Simple, fast, free PDF tools drive enormous organic traffic

**What you do that they don't:**
- You have PDF + calculators + developer tools + medical + legal ALL IN ONE
- Cross-category internal linking (BMI calculator → Medical tools → PDF export result)
- This is your unique positioning: "the one toolbox for everything"

---

## TECHNICAL SEO CHECKLIST (do this monthly)

### Core Web Vitals (Google ranking factor since 2021)

Check monthly at pagespeed.insights.google.com:

Target scores:
- LCP (Largest Contentful Paint): under 2.5 seconds
- FID/INP (Interaction to Next Paint): under 200ms
- CLS (Cumulative Layout Shift): under 0.1

If LCP is failing:
- Preload your hero image: <link rel="preload" as="image" href="/og-image.png">
- Use next/image for all images (you already should be)
- Enable Vercel Edge Caching for static pages

If CLS is failing:
- Add explicit width/height to all images and ad slots
- AdSense ads cause CLS if they load and push content down
- Fix: reserve the ad slot space with min-height before ad loads

### Monthly SEO maintenance tasks

1. Check Google Search Console for:
   - Coverage errors (pages not indexed — fix immediately)
   - Manual actions (if any — follow instructions to fix)
   - Core Web Vitals issues
   - Mobile usability errors

2. Find "position 11–20" keywords in GSC Performance report
   These are pages almost ranking on page 1 — improve them first
   Strategy: add 300 more words of useful content + improve title tag

3. Update old blog posts
   Google rewards freshness. Every 3 months, update your top posts with:
   - New statistics
   - Additional FAQ questions (from new "People Also Ask" results)
   - Updated year in title: "Best Free PDF Tools 2026"

4. Check and fix broken internal links (use Screaming Frog free version, 500 URLs)

5. Monitor competitors' new pages via Google Alerts:
   - "site:calculatorsoup.com new calculator"
   - When they publish a new calculator → publish yours faster + better

---

## GOOGLE ADSENSE POLICY — WHAT NOT TO DO

Breaking these rules = permanent ban, no appeal:

NEVER DO:
- Click your own ads (even by accident on mobile — use an ad blocker yourself)
- Ask friends/family to click ads
- Use fake traffic (bots, traffic exchanges, paid clicks)
- Place ads on pages with no content
- Place ads where users might accidentally click them
- Place more than 3 matched content units per page
- Show ads in pop-ups or interstitials that cover content

ALWAYS DO:
- Keep your privacy policy updated (required — you have this)
- Keep ads.txt updated with your publisher ID
- Have a working contact form/email
- Keep Consent Management Platform active for EU visitors (you have this)
- Report any invalid click activity to Google immediately if you see it

---

## MONTHLY TARGETS & METRICS TO TRACK

Track these in a spreadsheet every single month:

| Month | Visits/mo | Pages indexed | Blog posts total | DA | AdSense RPM | Monthly revenue |
|-------|-----------|---------------|------------------|----|-------------|-----------------|
| 1     | Target: 500    | Target: 200  | 4   | 1  | —      | $0         |
| 2     | Target: 1,500  | Target: 400  | 12  | 3  | —      | $0         |
| 3     | Target: 4,000  | Target: 550  | 20  | 5  | $6     | $24        |
| 4     | Target: 8,000  | Target: 600  | 32  | 8  | $7     | $56        |
| 5     | Target: 15,000 | Target: 620  | 48  | 12 | $8     | $120       |
| 6     | Target: 25,000 | Target: 640  | 64  | 15 | $9     | $225       |
| 7     | Target: 40,000 | Target: 660  | 80  | 18 | $10    | $400       |
| 8     | Target: 60,000 | Target: 680  | 96  | 22 | $10    | $600       |
| 9     | Target: 85,000 | Target: 700  | 112 | 26 | $11    | $935       |
| 10    | Target: 115,000| Target: 720  | 130 | 30 | $11    | $1,265     |
| 11    | Target: 155,000| Target: 740  | 148 | 34 | $12    | $1,860     |
| 12    | Target: 200,000| Target: 760  | 168 | 38 | $13    | $2,600     |
| 15    | Target: 270,000| Target: 780  | 220 | 45 | $14    | $3,780 ✅  |
| 18    | Target: 350,000| Target: 800  | 280 | 50 | $15    | $5,250 🚀  |

Note: DA = Domain Authority (Moz metric, 0–100). New sites start at 1.
Grows with backlinks. You cannot rush this — it reflects months of trust-building.

---

## TOOLS YOU NEED (all free or freemium)

### SEO & Analytics
- Google Search Console: https://search.google.com/search-console (FREE — mandatory)
- Google Analytics 4: https://analytics.google.com (FREE — mandatory)
- Bing Webmaster Tools: https://www.bing.com/webmasters (FREE)
- Ahrefs Webmaster Tools: https://ahrefs.com/webmaster-tools (FREE for your own site)
- Screaming Frog SEO Spider: https://screamingfrog.co.uk/seo-spider (FREE up to 500 URLs)

### Keyword Research
- Google Keyword Planner: FREE with Google Ads account (make account, don't run ads)
- Ubersuggest: https://neilpatel.com/ubersuggest (3 free searches/day)
- AnswerThePublic: https://answerthepublic.com (2 free searches/day)
- AlsoAsked: https://alsoasked.com (3 free searches/day)
- Keywords Everywhere: Chrome extension, $10/month for 100K credits (very worth it)

### Backlink Monitoring
- Ahrefs free tier: see who links to you (weekly update)
- Moz Link Explorer: 10 free queries/month
- Google Search Console: Links report shows all backlinks

### Content Writing
- Claude (Anthropic): first drafts, outlines, FAQ writing
- ChatGPT: alternative for volume content
- Hemingway App: https://hemingwayapp.com (FREE) — makes writing clearer
- Grammarly: FREE tier for basic grammar/spelling

### Social & Outreach
- Hunter.io: find email addresses for outreach (FREE 25/month)
- HARO: https://www.helpareporter.com (FREE journalist connection)
- Buffer: https://buffer.com (FREE for 3 social profiles — schedule posts)

---

## WEEKLY ACTION PLAN (the actual work week by week)

### Every Monday
- Check GSC: new indexing errors? Fix them same day.
- Check GSC Performance: any pages dropped in ranking? Investigate why.
- Write/edit one blog post (publish Tuesday)

### Every Tuesday
- Publish blog post with embedded tool link
- Share post on: Twitter, LinkedIn, relevant subreddit
- Reply to 5–10 Reddit/Quora questions with helpful answers + tool links

### Every Wednesday
- Write second blog post (publish Thursday)
- Do keyword research for next week's topics
- Check competitors for new content via Google Alerts

### Every Thursday
- Publish second blog post
- Create 3–5 Pinterest pins from blog post content
- Send 5 outreach emails (guest post pitches or link requests)

### Every Friday
- Review analytics: what drove traffic this week?
- Update internal links on 2–3 old pages (add links to new blog posts)
- Write 3 short-form social media posts for next week

### Every month (first Monday)
- Full GSC audit: coverage, vitals, manual actions
- Update 2–3 top blog posts with new content + year
- Review AdSense RPM by page — which tools earn most? Push traffic there.
- Check affiliate earnings — which products converted? Add more CTAs.
- Review monetization: is it time to apply for Ezoic?

---

## THE HONEST REALITY CHECK

You spent 2 months building an excellent site with 604 tools.
That is genuinely impressive and most people cannot do it.

But here is the truth about tool sites and AdSense income:

**The site is not the hard part. Content and time are the hard part.**

CalculatorSoup was launched in 2006. Omni Calculator in 2013.
They earned almost nothing for the first 12–18 months.
Now they earn hundreds or thousands of dollars per day.

The competitive moat of a tool site is NOT the tools themselves.
The moat is the CONTENT (blog posts) that brings people to the tools,
and the BACKLINKS that make Google trust you over competitors.

You have the tools. Now you need 18 months of consistent content work.

**If you publish 3 blog posts per week and do outreach seriously:**
- Month 6: you will hit AdSense approval and first $30–50
- Month 9: $200–500/month
- Month 12: $500–1,500/month
- Month 15–18: $2,000–5,000/month ($100/day is in this range)

**If you publish 0 blog posts and just wait:**
- Month 12: $20–80/month (barely moved from calculator rankings alone)
- $100/day never happens without content

The content is the business. The tools are just the reason people stay.

---

## QUICK WINS — do these this week

1. Add Google Search Console → Submit sitemap → takes 10 minutes
2. Create Product Hunt listing → schedule launch for next Tuesday 12:01 AM PST
3. Add affiliate links to your 5 highest-RPM pages:
   - Mortgage calculator → LendingTree affiliate link
   - VPN checker → NordVPN affiliate link
   - NDA generator → LegalZoom affiliate link
   - PDF tools → Adobe Acrobat affiliate link
   - Salary calculator → Credible affiliate link
4. Write your first blog post today: "How to Calculate Mortgage Payments Manually (Step by Step)"
5. Submit to 5 directories (links in Week 1 checklist above)

**These 5 actions take less than 4 hours and set the foundation for everything else.**

---

Last updated: June 2026
Site: https://roughtools.com
Author: Shahid
Goal: $100/day ($3,000/month) AdSense + affiliate revenue by Month 15–18
