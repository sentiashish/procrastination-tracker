import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Clock3, Sparkles } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Plan vs Reality Tracking",
    description:
      "Measure the real gap between planned and actual execution time so your schedule becomes data-driven.",
  },
  {
    icon: BrainCircuit,
    title: "Distraction Intelligence",
    description:
      "Log distractions and identify hidden time leaks across social, entertainment, and context switching.",
  },
  {
    icon: Clock3,
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-dashboardDarkAlt"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <header className="relative z-10 flex flex-col gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-secondary">Behavior Analytics Platform</p>
          <h1 className="heading-premium mt-1 font-heading text-2xl text-white sm:text-3xl">Procrastination Killer</h1>
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
            Join 1,000+ High-Performers
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
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={15} />
                Start Your First Week
                </span>
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

            <div className="mt-4 rounded-xl border border-primary/30 bg-dashboardActive/50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Live Comparison</p>
              <p className="mt-1 text-sm font-semibold text-white">Planned vs Actual Time Leak</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Planned 09:00-11:00</span>
                    <span className="metric-mono text-secondary">2h</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-full rounded-full bg-secondary" />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Actual 09:42-10:31</span>
                    <span className="metric-mono text-amber-300">49m</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-[41%] rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
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
        <motion.div
          className="mt-6 grid gap-4 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-5"
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-3 inline-flex rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary">
                <feature.icon size={18} />
              </div>
              <h4 className="font-semibold text-white">{feature.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
