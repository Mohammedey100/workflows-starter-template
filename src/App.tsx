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

  // لما الـ workflow يكمّل
  useEffect(() => {
    if (workflowState.workflowStatus === "completed") {
      const timer = setTimeout(() => {
        setInstanceId(null);
        // اختيارية:
        // setShowWorkflowDemo(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [workflowState.workflowStatus]);

  // لما يبدأ الـ workflow فعليًا، نوقف حالة الـ starting
  useEffect(() => {
    if (
      workflowState.workflowStatus === "running" &&
      workflowState.currentStep
    ) {
      setIsStarting(false);
    }
  }, [workflowState.workflowStatus, workflowState.currentStep]);

  // فتح الـ demo أوتوماتيك لما يبقى فيه instance
  useEffect(() => {
    if (instanceId && workflowState.workflowStatus !== "completed") {
      setShowWorkflowDemo(true);
    }
  }, [instanceId, workflowState.workflowStatus]);

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
      // ما نفتحش الـ demo هنا عشان ما يحصلش race
      // setShowWorkflowDemo(true);
    } catch {
      alert("فشل في بدء الـ workflow. من فضلك حاول مرة أخرى.");
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
                محمد رجب
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                مطور ويب ومتاجر إلكترونية
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a
              href="#projects"
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              المشاريع
            </a>
            <a
              href="#contact"
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              تواصل معي
            </a>
            {/* زر متجر الديمو في الهيدر (اختياري) */}
            <a
              href="https://market.essentialsco1.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              متجر ديمو →
            </a>
            <a
              href="https://developers.cloudflare.com/workflows"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              وثائق Workflows →
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
              أبني متاجر إلكترونية وتطبيقات ويب لحظية مخصصة.
            </h2>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl">
              مطور ويب مركز على PHP و MySQL و WebRTC و Cloudflare Workers،
              ببني منصات تجارة إلكترونية مخصصة، لوحات تحكم، وتجارب لحظية
              (Real‑Time).
            </p>
          </div>

          {/* Projects grid */}
          <section id="projects" className="grid gap-6 md:grid-cols-2">
            {/* Project: Workflows Starter / Essentials Store */}
            <article className="bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                متجر إلكتروني / Workflows Starter
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                Workflow دورة الطلب (التحقق → حجز المخزون → انتظار الدفع →
                إنهاء الطلب) مبني على Cloudflare Workers و Workflows و Durable
                Objects، مع تحديثات لحظية للحالة.
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                التقنية: TypeScript, Cloudflare Workers, Workflows, Durable
                Objects, WebSockets
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <a
                  href="https://github.com/Mohammedey100/workflows-starter-template"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition"
                >
                  الكود على GitHub
                </a>

                <a
                  href="https://market.essentialsco1.sho"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/70 border border-emerald-200/60 dark:border-emerald-800 transition"
                >
                  متجر ديمو مباشر
                </a>

                <button
                  onClick={() => setShowWorkflowDemo(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  فتح عرض الـ Workflow
                </button>
              </div>

              {/* فيديو الديمو للمتجر (يوتيوب) */}
              <div className="rounded-lg overflow-hidden border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/aWMRZKdPmgU"
                    title="سكريبت متجر الكترونى لبيع العبايات ب ال بي اتش بي واتش تى ام ال"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </article>

            {/* Project: Flutter App */}
            <article className="bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                تطبيق Flutter للمتجر
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                تطبيق موبايل متكامل لعرض المنتجات، إضافة للسلة، وتتبع الطلبات،
                مع ربط بواجهة برمجية (API) لمتجر PHP/MySQL.
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                التقنية: Flutter, Dart, REST API, HTTP
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/Mohammedey100"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition"
                >
                  الكود على GitHub
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
            تواصل معي
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
            متاح للعمل الحر والتعاون في مشاريع جديدة.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
            <li>
              <span className="font-medium">البريد:</span>{" "}
              <a
                href="mailto:mohammedey100@email.com"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                mohammedey100@email.com
              </a>
            </li>
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
          </ul>
        </section>

        {/* Workflow demo section */}
        {showWorkflowDemo && (
          <section className="border-t border-neutral-200/60 dark:border-neutral-800 pt-6 pb-10">
            <div className="px-6 mb-4 flex items-center justify-between max-w-5xl mx-auto">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                عرض الـ Workflow
              </h2>
              <button
                onClick={() => setShowWorkflowDemo(false)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                إغلاق
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
