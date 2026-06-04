export type Severity = "low" | "medium" | "high" | "critical";

export interface ScoreBreakdown {
  evidence: number;
  sources: number;
  logic: number;
  consistency: number;
}

export interface Manipulation {
  category:
    | "Fear Appeals"
    | "Outrage Triggers"
    | "Urgency Language"
    | "Emotional Framing"
    | "Polarization Language"
    | "Conspiracy Indicators";
  confidence: number;
  excerpt: string;
  explanation: string;
}

export interface BiasFinding {
  type: "Political" | "Commercial" | "Selection" | "Framing";
  severity: Severity;
  explanation: string;
  examples: string[];
}

export interface Fallacy {
  type:
    | "Strawman"
    | "Ad Hominem"
    | "False Dilemma"
    | "Slippery Slope"
    | "Appeal to Emotion"
    | "Hasty Generalization";
  excerpt: string;
  explanation: string;
  confidence: number;
}

export type EvidenceStatus =
  | "Supported"
  | "Partially Supported"
  | "Weak Evidence"
  | "Unsupported";

export interface Claim {
  id: string;
  text: string;
  status: EvidenceStatus;
  confidence: number;
  supporting: string[];
  contradicting: string[];
}

export interface Source {
  name: string;
  domain: string;
  reliability: number;
  bias: string;
  type: "Primary" | "Secondary" | "Aggregator" | "Opinion";
}

export interface Analysis {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  url?: string;
  type: "Political" | "News" | "Social Media" | "Press Release";
  analyzedAt: string;
  wordCount: number;
  credibility: number;
  evidence: number;
  bias: number;
  manipulation: number;
  reliability: number;
  breakdown: ScoreBreakdown;
  riskLevel: Severity;
  executiveSummary: string;
  body: string;
  claims: Claim[];
  manipulations: Manipulation[];
  biases: BiasFinding[];
  fallacies: Fallacy[];
  sources: Source[];
  verificationActions: string[];
  finalAssessment: string;
}

const political: Analysis = {
  id: "ana_01h9k2",
  title: "Senator Hollis Pledges Sweeping Reform Amid Polling Slump",
  excerpt:
    "In a fiery speech to supporters, Senator Hollis vowed to dismantle 'the rotten establishment' and restore prosperity within his first 100 days.",
  source: "The Capital Beacon",
  url: "https://capital-beacon.example/hollis-reform",
  type: "Political",
  analyzedAt: "2026-06-02T14:22:00Z",
  wordCount: 1284,
  credibility: 38,
  evidence: 32,
  bias: 71,
  manipulation: 64,
  reliability: 41,
  breakdown: { evidence: 32, sources: 44, logic: 36, consistency: 41 },
  riskLevel: "high",
  executiveSummary:
    "The article presents Senator Hollis's policy claims uncritically while deploying loaded language, undefined economic figures, and unnamed insiders. Multiple statistics are unsourced or contradict publicly available data from the Congressional Budget Office. The piece exhibits strong framing bias and several appeals to emotion.",
  body: `Senator Marcus Hollis took the stage in Dayton last night and delivered what aides are calling his most consequential speech to date. "If we don't act now," Hollis warned, "the rotten establishment will hollow out the middle class within a generation." Hollis pledged a sweeping reform package, claiming it would create "millions of jobs" and "save the average family thousands" — though no analysis was provided. A senior insider told the Beacon that Hollis polls "stronger than any challenger in two decades," a claim contradicted by recent Pew data. Critics, Hollis said, are "career bureaucrats afraid of losing their grip." The crowd erupted. Analysts warn the country is at a "tipping point" — one that, supporters insist, only Hollis can navigate.`,
  claims: [
    {
      id: "c1",
      text: "The reform package will create millions of jobs.",
      status: "Unsupported",
      confidence: 22,
      supporting: [],
      contradicting: ["No economic modeling provided", "CBO range estimates 180k–420k"],
    },
    {
      id: "c2",
      text: "Hollis polls stronger than any challenger in two decades.",
      status: "Weak Evidence",
      confidence: 28,
      supporting: ["Quoted unnamed insider"],
      contradicting: ["Pew 2026 data shows mid-pack standing"],
    },
    {
      id: "c3",
      text: "The middle class will be hollowed out within a generation.",
      status: "Partially Supported",
      confidence: 54,
      supporting: ["BLS wage stagnation trend"],
      contradicting: ["Median household income up 3.1% YoY"],
    },
  ],
  manipulations: [
    {
      category: "Fear Appeals",
      confidence: 88,
      excerpt: "the rotten establishment will hollow out the middle class within a generation",
      explanation:
        "Frames inaction as catastrophic without quantifying risk, prompting emotional rather than evidentiary response.",
    },
    {
      category: "Outrage Triggers",
      confidence: 74,
      excerpt: "career bureaucrats afraid of losing their grip",
      explanation:
        "Targets a vague out-group to provoke indignation and consolidate in-group identity.",
    },
    {
      category: "Urgency Language",
      confidence: 81,
      excerpt: "If we don't act now",
      explanation:
        "Creates time pressure that discourages deliberation and verification.",
    },
  ],
  biases: [
    {
      type: "Political",
      severity: "high",
      explanation:
        "Language consistently elevates Hollis while characterizing opponents in pejorative terms.",
      examples: ['"most consequential speech to date"', '"career bureaucrats"'],
    },
    {
      type: "Framing",
      severity: "medium",
      explanation:
        "Crowd reactions and dramatic staging are used as implicit evidence of legitimacy.",
      examples: ['"The crowd erupted"', '"tipping point"'],
    },
    {
      type: "Selection",
      severity: "medium",
      explanation:
        "No dissenting expert voices, official rebuttals, or counter-data are presented.",
      examples: ["Zero opposition sources cited"],
    },
  ],
  fallacies: [
    {
      type: "False Dilemma",
      excerpt: "only Hollis can navigate",
      explanation: "Presents a binary choice between Hollis and ruin, ignoring alternatives.",
      confidence: 82,
    },
    {
      type: "Ad Hominem",
      excerpt: "career bureaucrats afraid of losing their grip",
      explanation: "Attacks critics' character rather than engaging their arguments.",
      confidence: 76,
    },
    {
      type: "Appeal to Emotion",
      excerpt: "hollow out the middle class within a generation",
      explanation: "Uses dread to bypass analytic evaluation.",
      confidence: 71,
    },
  ],
  sources: [
    {
      name: "The Capital Beacon",
      domain: "capital-beacon.example",
      reliability: 48,
      bias: "Right-leaning",
      type: "Secondary",
    },
    { name: "Unnamed insider", domain: "—", reliability: 12, bias: "Unknown", type: "Opinion" },
  ],
  verificationActions: [
    "Request the campaign's economic modeling for the reform package",
    "Cross-check polling claim against Pew, Gallup, and 538 aggregates",
    "Obtain CBO scoring for any introduced legislation",
    "Identify the 'senior insider' or treat the quote as unverified",
  ],
  finalAssessment:
    "Low credibility. The piece reads as advocacy framed as reporting. Recommend treating any policy or polling claim as unverified pending corroboration.",
};

const news: Analysis = {
  id: "ana_02p4r7",
  title: "City Water Authority Confirms Lead Levels Within Federal Limits",
  excerpt:
    "After three weeks of resident concern, the City Water Authority published full quarterly testing data.",
  source: "Riverside Daily",
  url: "https://riverside-daily.example/water-lead-testing",
  type: "News",
  analyzedAt: "2026-06-01T09:10:00Z",
  wordCount: 942,
  credibility: 81,
  evidence: 84,
  bias: 22,
  manipulation: 14,
  reliability: 78,
  breakdown: { evidence: 84, sources: 79, logic: 82, consistency: 80 },
  riskLevel: "low",
  executiveSummary:
    "Reporting is well-sourced, includes primary documents, and accurately characterizes EPA thresholds. Minor framing concerns around headline emphasis, but the body presents qualifying detail and dissenting expert opinion.",
  body: `The City Water Authority released full quarterly lead testing data Tuesday, confirming that levels in 412 of 418 sampled homes fall within EPA action limits. Authority director Lena Park said the six exceedances were traced to internal household plumbing rather than the municipal supply. Independent toxicologist Dr. Aaron Wei of State University reviewed the dataset and concurred with the methodology, while noting that "EPA limits do not imply zero risk for vulnerable groups." Park said replacement of legacy service lines remains on schedule for completion in 2028. Resident advocacy group Clean Tap Coalition welcomed the disclosure but urged faster pipe replacement.`,
  claims: [
    {
      id: "c1",
      text: "412 of 418 sampled homes are within EPA action limits.",
      status: "Supported",
      confidence: 92,
      supporting: ["Published dataset", "Independent toxicologist review"],
      contradicting: [],
    },
    {
      id: "c2",
      text: "Exceedances trace to household plumbing, not municipal supply.",
      status: "Partially Supported",
      confidence: 68,
      supporting: ["Authority statement", "Sampling location data"],
      contradicting: ["No third-party plumbing audit cited"],
    },
  ],
  manipulations: [
    {
      category: "Emotional Framing",
      confidence: 32,
      excerpt: "three weeks of resident concern",
      explanation: "Mild framing emphasizing public anxiety, but not exaggerated.",
    },
  ],
  biases: [
    {
      type: "Framing",
      severity: "low",
      explanation: "Headline emphasizes compliance while body fairly notes residual risk.",
      examples: ['"Within Federal Limits"'],
    },
  ],
  fallacies: [],
  sources: [
    { name: "City Water Authority", domain: "city.gov.example", reliability: 78, bias: "Official", type: "Primary" },
    { name: "Dr. Aaron Wei, State University", domain: "stateu.edu.example", reliability: 86, bias: "Academic", type: "Primary" },
    { name: "Clean Tap Coalition", domain: "cleantap.example", reliability: 64, bias: "Advocacy", type: "Secondary" },
  ],
  verificationActions: [
    "Download published testing dataset and verify summary statistics",
    "Confirm EPA action thresholds against current federal register",
    "Request independent plumbing audit on the six exceedance sites",
  ],
  finalAssessment:
    "High credibility. Suitable as a primary reference with standard caveats on official-source framing.",
};

const social: Analysis = {
  id: "ana_03q8m1",
  title: "Viral Thread: 'They Don't Want You to Know About This Supplement'",
  excerpt:
    "A 14-post thread claims a common kitchen spice reverses metabolic disease, citing 'suppressed' research.",
  source: "X (formerly Twitter)",
  url: "https://x.example/post/12894",
  type: "Social Media",
  analyzedAt: "2026-05-30T18:44:00Z",
  wordCount: 612,
  credibility: 12,
  evidence: 8,
  bias: 78,
  manipulation: 91,
  reliability: 14,
  breakdown: { evidence: 8, sources: 11, logic: 18, consistency: 22 },
  riskLevel: "critical",
  executiveSummary:
    "Thread is a textbook health-misinformation pattern: conspiracy framing, unverifiable studies, financial conflict via affiliate links, and emotionally manipulative language. No primary research cited resolves to a real publication.",
  body: `THREAD 🧵: They don't want you to know this. A common kitchen spice has been shown in SUPPRESSED studies to reverse type 2 diabetes in weeks. Big Pharma is terrified. I almost lost everything before I discovered this. Doctors will NEVER tell you. Save this post before it's deleted. (affiliate link below)`,
  claims: [
    {
      id: "c1",
      text: "A common kitchen spice reverses type 2 diabetes in weeks.",
      status: "Unsupported",
      confidence: 4,
      supporting: [],
      contradicting: ["No peer-reviewed evidence", "Contradicts ADA clinical guidance"],
    },
    {
      id: "c2",
      text: "Research on this spice has been suppressed.",
      status: "Unsupported",
      confidence: 6,
      supporting: [],
      contradicting: ["No retraction records", "PubMed shows active publication"],
    },
  ],
  manipulations: [
    { category: "Conspiracy Indicators", confidence: 96, excerpt: "They don't want you to know", explanation: "Classic 'hidden truth' framing to short-circuit skepticism." },
    { category: "Urgency Language", confidence: 92, excerpt: "Save this post before it's deleted", explanation: "Manufactured scarcity to drive immediate sharing." },
    { category: "Fear Appeals", confidence: 88, excerpt: "I almost lost everything", explanation: "Personal-catastrophe anchor to build emotional identification." },
    { category: "Polarization Language", confidence: 79, excerpt: "Big Pharma is terrified", explanation: "Constructs an enemy out-group to reinforce in-group trust." },
  ],
  biases: [
    {
      type: "Commercial",
      severity: "critical",
      explanation: "Affiliate link presents direct financial incentive for the claim.",
      examples: ["affiliate link below"],
    },
  ],
  fallacies: [
    { type: "Hasty Generalization", excerpt: "reverses type 2 diabetes in weeks", explanation: "Sweeping medical claim with no qualifying conditions.", confidence: 89 },
    { type: "Appeal to Emotion", excerpt: "I almost lost everything", explanation: "Substitutes feeling for evidence.", confidence: 82 },
  ],
  sources: [{ name: "@anon_health_truth", domain: "x.example", reliability: 6, bias: "Self-promotional", type: "Opinion" }],
  verificationActions: [
    "Search PubMed and Cochrane for the specific clinical claim",
    "Disclose and evaluate affiliate relationships",
    "Consult ADA and WHO clinical guidance",
    "Do not share until independently verified",
  ],
  finalAssessment: "Critical risk. Treat as misinformation. Do not amplify.",
};

const press: Analysis = {
  id: "ana_04t6w9",
  title: "Helix Robotics Announces 'Industry-Defining' Q2 Results",
  excerpt: "Helix touts record growth while burying a 14% drop in core hardware revenue.",
  source: "Helix Robotics Investor Relations",
  url: "https://helix.example/ir/q2",
  type: "Press Release",
  analyzedAt: "2026-05-28T12:00:00Z",
  wordCount: 1107,
  credibility: 54,
  evidence: 61,
  bias: 58,
  manipulation: 47,
  reliability: 62,
  breakdown: { evidence: 61, sources: 70, logic: 52, consistency: 49 },
  riskLevel: "medium",
  executiveSummary:
    "Financial figures appear accurate but selectively presented. Strong adjective use, prominent non-GAAP framing, and de-emphasis of core hardware decline. Recommend cross-referencing the 10-Q.",
  body: `Helix Robotics today announced industry-defining Q2 results, with record adjusted EBITDA growth of 38% year-over-year. The Company's diversified services portfolio delivered exceptional momentum, validating management's long-term strategy. Hardware results reflect transitional product mix dynamics. The Board remains confident in Helix's category leadership.`,
  claims: [
    { id: "c1", text: "Record adjusted EBITDA growth of 38% YoY.", status: "Partially Supported", confidence: 64, supporting: ["Press release", "10-Q filing"], contradicting: ["Non-GAAP — GAAP earnings declined 6%"] },
    { id: "c2", text: "Industry-defining results.", status: "Weak Evidence", confidence: 24, supporting: [], contradicting: ["Two competitors posted higher GAAP growth"] },
    { id: "c3", text: "Hardware reflects 'transitional product mix dynamics.'", status: "Weak Evidence", confidence: 30, supporting: [], contradicting: ["10-Q shows 14% hardware revenue decline"] },
  ],
  manipulations: [
    { category: "Emotional Framing", confidence: 66, excerpt: "industry-defining", explanation: "Superlative without comparative data." },
    { category: "Polarization Language", confidence: 32, excerpt: "category leadership", explanation: "Asserts dominance to deflect competitive scrutiny." },
  ],
  biases: [
    { type: "Commercial", severity: "high", explanation: "Source has direct financial incentive to favor positive framing.", examples: ['"exceptional momentum"', '"validating management"'] },
    { type: "Selection", severity: "medium", explanation: "Highlights non-GAAP metrics; omits GAAP decline.", examples: ["No GAAP EBITDA disclosed in summary"] },
  ],
  fallacies: [
    { type: "Strawman", excerpt: "transitional product mix dynamics", explanation: "Reframes a revenue decline as a strategic phase.", confidence: 58 },
  ],
  sources: [
    { name: "Helix Robotics IR", domain: "helix.example", reliability: 62, bias: "Issuer", type: "Primary" },
    { name: "SEC 10-Q filing", domain: "sec.gov.example", reliability: 92, bias: "Regulatory", type: "Primary" },
  ],
  verificationActions: [
    "Reconcile non-GAAP EBITDA to GAAP in the 10-Q",
    "Benchmark growth claims against direct competitors",
    "Review segment breakdown for hardware vs services",
  ],
  finalAssessment: "Moderate credibility. Underlying numbers are likely accurate; narrative framing requires careful disaggregation.",
};

export const analyses: Analysis[] = [political, news, social, press];

export const getAnalysis = (id: string) => analyses.find((a) => a.id === id);

export const trendData = [
  { month: "Jan", analyses: 142, avgCredibility: 64 },
  { month: "Feb", analyses: 168, avgCredibility: 61 },
  { month: "Mar", analyses: 201, avgCredibility: 58 },
  { month: "Apr", analyses: 234, avgCredibility: 57 },
  { month: "May", analyses: 289, avgCredibility: 55 },
  { month: "Jun", analyses: 312, avgCredibility: 53 },
];

export const manipulationDistribution = [
  { name: "Emotional Framing", value: 184 },
  { name: "Fear Appeals", value: 142 },
  { name: "Urgency", value: 121 },
  { name: "Outrage", value: 98 },
  { name: "Polarization", value: 74 },
  { name: "Conspiracy", value: 41 },
];

export const fallacyDistribution = [
  { name: "Appeal to Emotion", value: 156 },
  { name: "Hasty Generalization", value: 118 },
  { name: "False Dilemma", value: 92 },
  { name: "Ad Hominem", value: 71 },
  { name: "Strawman", value: 58 },
  { name: "Slippery Slope", value: 39 },
];

export const credibilityBuckets = [
  { range: "0–20", count: 38 },
  { range: "21–40", count: 71 },
  { range: "41–60", count: 124 },
  { range: "61–80", count: 142 },
  { range: "81–100", count: 67 },
];

export const sourceReliability = [
  { tier: "Primary / Official", value: 84 },
  { tier: "Academic", value: 88 },
  { tier: "Major News", value: 71 },
  { tier: "Trade Press", value: 62 },
  { tier: "Aggregator", value: 48 },
  { tier: "Anonymous / Social", value: 18 },
];
