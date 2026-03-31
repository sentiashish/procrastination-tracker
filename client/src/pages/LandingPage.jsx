import { Link } from "react-router-dom";

const features = [
  {
    title: "Plan vs Reality Tracking",
    description:
      "Measure the real gap between planned and actual execution time so your schedule becomes data-driven.",
  },
  {
    title: "Distraction Intelligence",
    description:
      "Log distractions and identify hidden time leaks across social, entertainment, and context switching.",
  },
  {
    title: "Weekly Performance Score",
    description:
      "Get a weekly efficiency score with visual insights that help you improve consistency every day.",
  },
];

const steps = [
  "Create tasks with planned start and end times",
  "Start and end tasks as you actually work",
  "Log distractions and review weekly analytics",
];

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-dashboardDarkAlt">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <header className="relative z-10 flex flex-col gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-secondary">Behavior Analytics Platform</p>
          <h1 className="mt-1 font-heading text-2xl text-white sm:text-3xl">Procrastination Killer</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110"
          >
            Get started free
          </Link>
        </div>
      </header>

      <section className="relative z-10 px-6 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
              For students, professionals, and deep-work teams
            </p>
            <h2 className="mt-5 max-w-2xl font-heading text-3xl leading-tight text-white sm:text-5xl">
              Stop guessing productivity. Start operating like a high-performance system.
            </h2>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Most people only track tasks. This platform tracks behavior. Understand why work gets delayed,
              where time leaks happen, and what changes improve your execution score week after week.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110"
              >
                Start Your First Week
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-secondary hover:text-secondary"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold text-white">What you get in week 1</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. Daily task execution timeline</li>
              <li>2. Delay and distraction visibility</li>
              <li>3. Weekly efficiency scorecard</li>
              <li>4. Actionable improvement trend</li>
            </ul>
            <div className="mt-6 rounded-xl border border-slate-700 bg-dashboardDark p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Why teams love it</p>
              <p className="mt-2 text-sm text-slate-200">
                "It changed how I plan my day. I now see exactly where my time actually goes."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-slate-800 bg-dashboardDark/60 px-6 py-10 sm:px-8" id="how-it-works">
        <h3 className="font-heading text-2xl text-white">How it works</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-200">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-t border-slate-800 px-6 py-10 sm:px-8">
        <h3 className="font-heading text-2xl text-white">Built like a modern SaaS product</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
              <h4 className="font-semibold text-white">{feature.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
