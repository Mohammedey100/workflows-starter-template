// Export the Workflow and Durable Object classes
export { MyWorkflow } from "./workflow";
export { WorkflowStatusDO } from "./durable-object";

/**
 * Main Worker fetch handler
 *
 * Handles API routes and WebSocket upgrade requests for workflow management:
 * - GET  /          - Main HTML page (Essentials Store)
 * - POST /api/workflow/start   - Create new workflow instance
 * - GET  /api/workflow/status/:id - Get workflow status
 * - POST /api/workflow/event/:id  - Send events to workflow
 * - GET  /ws        - WebSocket connection for real-time updates
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ==== الموقع الرئيسي على / ====
    if (url.pathname === "/" && request.method === "GET") {
      const html = `
        <!doctype html>
        <html lang="ar">
          <head>
            <meta charset="utf-8" />
            <title>Essentials Store</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              * { box-sizing: border-box; }
              body {
                margin: 0;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                background: radial-gradient(circle at top, #1f2937, #020617);
                color: #f9fafb;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              .container {
                text-align: center;
                padding: 2rem;
                max-width: 480px;
              }
              h1 {
                font-size: 2.25rem;
                margin-bottom: 0.75rem;
              }
              p {
                margin-bottom: 1.5rem;
                color: #e5e7eb;
                line-height: 1.6;
              }
              .badge {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.2rem 0.75rem;
                border-radius: 999px;
                border: 1px solid #22c55e33;
                background: #022c22;
                color: #bbf7d0;
                font-size: 0.75rem;
                margin-bottom: 1rem;
              }
              .btn {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                border-radius: 999px;
                background: #22c55e;
                color: #022c22;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.95rem;
              }
              .btn:hover {
                background: #16a34a;
              }
            </style>
          </head>
          <body dir="rtl">
            <div class="container">
              <div class="badge">Essentials · Cloudflare Workers</div>
              <h1>المتجر شغال بنجاح 🎉</h1>
              <p>
                هذا هو الهوم بتاع <strong>Essentials Store</strong> على Cloudflare Workers.
                تقدر تعدّل التصميم والمحتوى من ملف <code>worker/index.ts</code>.
              </p>
              <a class="btn" href="/api/workflow/start">جرّب تشغيل الـ Workflow</a>
            </div>
          </body>
        </html>
      `;

      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    // ==== API: Start a new workflow instance ====
    if (url.pathname === "/api/workflow/start" && request.method === "POST") {
      try {
        const instance = await env.MY_WORKFLOW.create({
          params: {
            timestamp: Date.now(),
          },
        });

        return Response.json({
          instanceId: instance.id,
          message: "Workflow started successfully",
        });
      } catch {
        return Response.json(
          { error: "Failed to start workflow" },
          { status: 500 },
        );
      }
    }

    // ==== API: Get workflow status ====
    if (url.pathname.startsWith("/api/workflow/status/")) {
      const instanceId = url.pathname.split("/").pop();
      if (!instanceId) {
        return Response.json(
          { error: "Instance ID required" },
          { status: 400 },
        );
      }

      try {
        const instance = await env.MY_WORKFLOW.get(instanceId);
        const status = await instance.status();
        return Response.json(status);
      } catch {
        return Response.json(
          { error: "Failed to get workflow status" },
          { status: 500 },
        );
      }
    }

    // ==== API: Send event to workflow instance ====
    if (
      url.pathname.startsWith("/api/workflow/event/") &&
      request.method === "POST"
    ) {
      const instanceId = url.pathname.split("/").pop();
      if (!instanceId) {
        return Response.json(
          { error: "Instance ID required" },
          { status: 400 },
        );
      }

      try {
        const body = (await request.json()) as {
          approved: boolean;
          comment?: string;
        };
        const instance = await env.MY_WORKFLOW.get(instanceId);

        await instance.sendEvent({
          type: "user-approval",
          payload: body,
        });

        return Response.json({
          success: true,
          message: "Event sent successfully",
        });
      } catch {
        return Response.json(
          { error: "Failed to send event" },
          { status: 500 },
        );
      }
    }

    // ==== WebSocket: Connect to workflow status updates ====
    if (url.pathname === "/ws") {
      const instanceId = url.searchParams.get("instanceId");
      if (!instanceId) {
        return new Response("instanceId query parameter required", {
          status: 400,
        });
      }

      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      try {
        const doId = env.WORKFLOW_STATUS.idFromName(instanceId);
        const stub = env.WORKFLOW_STATUS.get(doId);
        return stub.fetch(request);
      } catch {
        return new Response("Failed to establish WebSocket connection", {
          status: 500,
        });
      }
    }

    // أي مسار غير معروف
    return Response.json({ error: "Not Found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
