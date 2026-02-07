import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import Link from "next/link";

// Premium showcase components with realistic styling
const DocSearchCard = () => (
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 group cursor-pointer hover:border-cyan-500/50 transition-all">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-cyan-400 uppercase tracking-wide">Documentation</span>
        <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          95% match
        </span>
      </div>
      <h3 className="font-semibold text-white">Authentication Guide</h3>
      <p className="text-sm text-slate-400 mt-1 line-clamp-2">Learn how to implement OAuth2 with JWT tokens and refresh mechanisms...</p>
      <div className="flex gap-2 mt-3">
        <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">React</span>
        <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">Auth</span>
      </div>
    </div>
  </div>
);

const FlightBookingCard = () => (
  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/20">
          ✈️
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-medium text-white">JFK</span>
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="font-medium text-white">NRT</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Dec 15 • Direct • 14h 30m</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-white">$849</p>
        <p className="text-xs text-emerald-400">Best price</p>
      </div>
    </div>
  </div>
);

const DashboardMetric = () => (
  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Monthly Revenue</p>
        <p className="text-2xl font-bold text-white mt-1">$48,294</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            23.5%
          </span>
          <span className="text-xs text-slate-500">vs last month</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
        <span className="text-cyan-400 text-lg">📈</span>
      </div>
    </div>
  </div>
);

const OrderTracker = () => (
  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4">
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">Order #38291</p>
    <div className="relative flex items-center justify-between">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-2/3 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 -translate-y-1/2" />
      {[
        { done: true, label: "Ordered" },
        { done: true, label: "Shipped" },
        { done: true, current: true, label: "In Transit" },
        { done: false, label: "Delivered" },
      ].map((step, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center">
          <div className={`w-5 h-5 rounded-full border-2 ${
            step.current ? "bg-cyan-500 border-cyan-400 ring-4 ring-cyan-500/20" :
            step.done ? "bg-emerald-500 border-emerald-400" : "bg-slate-700 border-slate-600"
          }`} />
          <span className={`text-xs mt-2 ${step.current ? "text-cyan-400 font-medium" : step.done ? "text-slate-300" : "text-slate-500"}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const PromptCard = ({ prompt, icon }: { prompt: string; icon: string }) => (
  <Link
    href={`/chat?prompt=${encodeURIComponent(prompt)}`}
    className="flex items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
  >
    <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{prompt}</span>
  </Link>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,211,238,0.1),transparent)]" />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Powered by <span className="text-cyan-400 font-medium">Tambo AI</span></span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            <span className="text-white">GenUI</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Playground</span>
          </h1>

          <p className="text-xl text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Discover what generative UI components work best for your chatbot. 
            Describe your use case, get live React demos instantly.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <ApiKeyCheck>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/30"
              >
                Start Creating
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </ApiKeyCheck>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Describe", desc: "Tell us about your chatbot's purpose", icon: "💭" },
              { num: "2", title: "Generate", desc: "AI creates live React components", icon: "⚡" },
              { num: "3", title: "Implement", desc: "Copy the code to your project", icon: "🚀" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Example UI Patterns</h2>
          <p className="text-slate-400 text-center mb-12">AI-generated components for different chatbot domains</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Documentation Bot</span>
              <DocSearchCard />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Travel Assistant</span>
              <FlightBookingCard />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Analytics Dashboard</span>
              <DashboardMetric />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">E-commerce Bot</span>
              <OrderTracker />
            </div>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Try these prompts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <PromptCard prompt="What generative UI for a documentation chatbot?" icon="📚" />
              <PromptCard prompt="Design UI for a food delivery bot" icon="🍕" />
              <PromptCard prompt="Create components for a fitness tracking assistant" icon="💪" />
              <PromptCard prompt="Show me UI patterns for customer support" icon="💬" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-slate-500 text-sm">Built with Tambo AI for the hackathon</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
