import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "MAP",
    title: "State risk scoring",
    desc: "Every US state scored 0-100 using SAR filing gaps, transaction volume, and GDP-weighted benchmarks.",
    bg: "bg-blue-50",
  },
  {
    icon: "!",
    title: "Blind spot detection",
    desc: "Identifies where filing rates fall below expected thresholds, the gaps regulators target first.",
    bg: "bg-red-50",
  },
  {
    icon: "$",
    title: "Revenue at risk",
    desc: "Calculates potential fines and reputational exposure per state based on non-compliance patterns.",
    bg: "bg-emerald-50",
  },
  {
    icon: "AI",
    title: "AI compliance copilot",
    desc: "Ask plain-English questions about any state, trend, or regulation. Powered by GPT-4o with structured outputs.",
    bg: "bg-purple-50",
  },
  {
    icon: "RB",
    title: "Role-based views",
    desc: "Executive, Compliance Analyst, and Operations views, each surfacing the right data for the right audience.",
    bg: "bg-amber-50",
  },
  {
    icon: "PDF",
    title: "Export and report",
    desc: "One-click HTML executive reports and CSV exports, ready to share with leadership or regulators.",
    bg: "bg-teal-50",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload your data",
    desc: "CSV or Excel with state, filing count, transaction volume, and date range.",
  },
  {
    num: "02",
    title: "Instant analysis",
    desc: "Our engine scores your gaps against FinCEN public benchmarks automatically.",
  },
  {
    num: "03",
    title: "See your dashboard",
    desc: "Your data loads directly into the full compliance dashboard, the same workflow as the live demo.",
  },
];

const trust = [
  { icon: "SEC", label: "No data stored" },
  { icon: "BSA", label: "FinCEN public methodology" },
  { icon: "AI", label: "AI-powered analysis" },
  { icon: "SAR", label: "BSA/SAR compliant framing" },
];

const kpis = [
  {
    label: "States critical risk",
    value: "14",
    delta: "+3 this quarter",
    deltaColor: "text-red-600",
  },
  {
    label: "Revenue at risk",
    value: "$2.4B",
    delta: "+18% YoY",
    deltaColor: "text-red-600",
  },
  {
    label: "SAR filing gap",
    value: "38%",
    delta: "Avg across all states",
    deltaColor: "text-slate-400",
  },
  {
    label: "Interventions active",
    value: "7",
    delta: "2 resolved",
    deltaColor: "text-emerald-600",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#185FA5] text-sm font-bold text-white">
            FG
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">FinCEN Guard</p>
            <p className="text-[11px] text-slate-400">
              Compliance Intelligence Platform
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-slate-500 hover:text-slate-900">
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            How it works
          </a>
          <a href="/methodology" className="text-sm text-slate-500 hover:text-slate-900">
            Methodology
          </a>
          <a href="/about" className="text-sm text-slate-500 hover:text-slate-900">
            About
          </a>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#134c84]"
        >
          View live demo
        </button>
      </nav>

      <section className="flex flex-col items-center px-6 py-16 text-center md:py-24">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Built on FinCEN BSA/SAR public data - Updated May 2026
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Spot compliance blind spots
          <br />
          before regulators do
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
          FinCEN Guard analyzes SAR filing gaps, scores state-level fraud risk,
          and surfaces intervention opportunities so your compliance team acts
          on evidence, not instinct.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#134c84]"
          >
            View live demo
          </button>
          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
          >
            Upload your data
          </a>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-6 border-y border-slate-100 bg-slate-50 px-6 py-4">
        {trust.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <span className="font-semibold text-slate-400">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>

      <section id="features" className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#185FA5]">
            Platform capabilities
          </p>
          <h2 className="mb-10 text-2xl font-semibold text-slate-900">
            Everything your compliance team needs
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold text-[#185FA5] ${feature.bg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#185FA5]">
            For companies
          </p>
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">
            Analyze your own filing data
          </h2>
          <p className="mb-10 max-w-xl text-sm leading-7 text-slate-500">
            Upload your institution&apos;s SAR filing history and see how your
            compliance posture compares against FinCEN benchmarks in under 60
            seconds.
          </p>
          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <p className="mb-3 text-xs font-semibold text-slate-400">
                  Step {step.num}
                </p>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-8 py-10 text-center transition hover:border-[#185FA5] hover:bg-blue-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-[#185FA5]">
              UP
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Drop your filing data here
            </p>
            <p className="text-xs text-slate-400">or click to browse files</p>
            <div className="flex gap-2">
              {["CSV", "XLSX", "JSON"].map((format) => (
                <span
                  key={format}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-500"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#185FA5]">
              Live demo
            </p>
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">
              See the full dashboard, no signup needed
            </h2>
            <p className="mb-10 max-w-md text-sm leading-7 text-slate-500">
              The live demo uses real FinCEN public data. Click any state,
              switch roles, or ask the AI copilot a question.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-green-300" />
              </div>
              <span className="flex-1 text-center text-xs text-slate-400">
                fraud-compliance-dashboard.vercel.app/dashboard
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-400">{kpi.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {kpi.value}
                  </p>
                  <p className={`mt-1 text-[11px] ${kpi.deltaColor}`}>
                    {kpi.delta}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-4 pb-4">
              {[
                {
                  state: "TX",
                  name: "Texas",
                  score: 91,
                  color: "#A32D2D",
                  label: "Critical",
                },
                {
                  state: "FL",
                  name: "Florida",
                  score: 85,
                  color: "#C04828",
                  label: "Critical",
                },
                {
                  state: "CA",
                  name: "California",
                  score: 79,
                  color: "#BA7517",
                  label: "High",
                },
                {
                  state: "NY",
                  name: "New York",
                  score: 71,
                  color: "#BA7517",
                  label: "High",
                },
              ].map((row) => (
                <div
                  key={row.state}
                  className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0"
                >
                  <span className="w-8 text-sm font-semibold text-slate-900">
                    {row.state}
                  </span>
                  <span className="w-24 text-sm text-slate-400">{row.name}</span>
                  <div className="flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${row.score}%`, background: row.color }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold">
                    {row.score}
                  </span>
                  <span
                    className="w-16 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold"
                    style={{
                      background: row.score >= 80 ? "#FCEBEB" : "#FAEEDA",
                      color: row.score >= 80 ? "#A32D2D" : "#BA7517",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-lg bg-[#185FA5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#134c84]"
            >
              Launch live demo
            </button>
            <a
              href="/methodology"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Read methodology
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#185FA5] text-[10px] font-bold text-white">
              FG
            </div>
            <span>FinCEN Guard - Compliance Intelligence Platform</span>
          </div>
          <div className="flex gap-5">
            <a href="/about" className="hover:text-slate-600">
              About
            </a>
            <a href="/methodology" className="hover:text-slate-600">
              Methodology
            </a>
            <a
              href="https://github.com/christineatsiaya/fraud-compliance-dashboard"
              className="hover:text-slate-600"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          <span>Built with React - FastAPI - Supabase - GPT-4o</span>
        </div>
      </footer>
    </div>
  );
}
