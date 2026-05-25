import { useState, useEffect } from "react";
import { WorkflowDiagram } from "./components/WorkflowDiagram";
import { CodeDisplay } from "./components/CodeDisplay";
import { BackgroundDots } from "./components/BackgroundDots";
import { useWorkflowWebSocket } from "./hooks/useWorkflowWebSocket";
import { WORKFLOW_STEPS } from "./types";

function App() {
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const workflowState = useWorkflowWebSocket(instanceId);
  const [showWorkflowDemo, setShowWorkflowDemo] = useState(false);

  useEffect(() => {
    if (workflowState.workflowStatus === "completed") {
      const timer = setTimeout(() => {
        setInstanceId(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [workflowState.workflowStatus]);

  useEffect(() => {
    if (
      workflowState.workflowStatus === "running" &&
      workflowState.currentStep
    ) {
      setIsStarting(false);
    }
  }, [workflowState.workflowStatus, workflowState.currentStep]);

  const handleStartWorkflow = async () => {
    setIsStarting(true);

    try {
      const response = await fetch("/api/workflow/start", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start workflow");
      }

      const data = await response.json();
      setInstanceId(data.instanceId);
      setShowWorkflowDemo(true);
    } catch {
      alert("Failed to start workflow. Please try again.");
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950 flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 text-neutral-200/50 dark:text-neutral-700/40 overflow-hidden">
        <BackgroundDots />
      </div>

      {/* Header */}
      <header className="px-6 pt-6 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              MR
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Mohammed Ragab
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Full‑Stack Web & E‑commerce Developer
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#projects" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              Projects
            </a>
            <a href="#contact" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              Contact
            </a>
            <a
              href="https://developers.cloudflare.com/workflows"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              Workflows Docs →
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative z-10">
        {/* Hero + Projects on top */}
        <section className="px-6 pt-6 pb-10 max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
              Building custom e‑commerce & real‑time web apps.
            </h2>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl">
              I’m a web developer focused on PHP, MySQL, WebRTC, and Cloudflare Workers.
              I build tailored e‑commerce platforms, admin dashboards, and real‑time experiences.
            </p>
          </div>

          {/* Projects grid */}
          <section id="projects" className="grid gap-6 md:grid-cols-2">
            {/* Project: Workflows Starter / Essentials Store */}
            <article className="bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                Workflows Starter / Essentials Store
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                Order lifecycle workflow (validate → reserve stock → wait for payment → finalize)
                built on Cloudflare Workers, Workflows, and Durable Objects, with real‑time status updates.
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                Tech: TypeScript, Cloudflare Workers, Workflows, Durable Objects, WebSockets
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/Mohammedey100/workflows-starter-template"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition"
                >
                  GitHub Repo
                </a>
                <button
                  onClick={() => setShowWorkflowDemo(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Open Workflow Demo
                </button>
              </div>
            </article>

            {/* Project placeholder – عدل ده لمشروع تاني فعلي عندك */}
            <article className="bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                Custom PHP E‑commerce Dashboard
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                Admin panel for managing products, orders, and customers with PHP, MySQL, and Bootstrap,
                including variant management and CMS features.
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                Tech: PHP, MySQL, Bootstrap, Admin CMS
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/..."
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition"
                >
                  GitHub Repo
                </a>
              </div>
            </article>
          </section>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="px-6 pb-10 max-w-5xl mx-auto border-t border-neutral-200/60 dark:border-neutral-800 pt-8"
        >
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
            Get in touch
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
            Available for freelance work and collaborations.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
            <li>
              <span className="font-medium">GitHub:</span>{" "}
              <a
                href="https://github.com/Mohammedey100"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                @Mohammedey100
              </a>
            </li>
            {/* اضف LinkedIn / Email لو حابب */}
          </ul>
        </section>

        {/* Workflow demo section (نفس الـ UI القديم لكن في الأسفل أو حسب showWorkflowDemo) */}
        {showWorkflowDemo && (
          <section className="border-t border-neutral-200/60 dark:border-neutral-800 pt-6 pb-10">
            <div className="px-6 mb-4 flex items-center justify-between max-w-5xl mx-auto">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Workflow Demo
              </h2>
              <button
                onClick={() => setShowWorkflowDemo(false)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col lg:flex-row overflow-hidden max-w-5xl mx-auto">
              <div className="w-full lg:w-[60%] overflow-hidden px-6 pb-6">
                <CodeDisplay
                  currentStep={workflowState.currentStep}
                  workflowStatus={workflowState.workflowStatus}
                  onStartWorkflow={handleStartWorkflow}
                  isStarting={isStarting}
                />
              </div>
              <div className="flex-1 overflow-hidden px-6 lg:pl-8 lg:pr-6 pb-6">
                <WorkflowDiagram
                  steps={WORKFLOW_STEPS}
                  stepStatuses={workflowState.stepStatuses}
                  currentStep={workflowState.currentStep}
                  instanceId={instanceId}
                  workflowStatus={workflowState.workflowStatus}
                  onStartWorkflow={handleStartWorkflow}
                  isStarting={isStarting}
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
