"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueue = void 0;
exports.registerProcessor = registerProcessor;
exports.startWorkers = startWorkers;
exports.stopWorkers = stopWorkers;
exports.enqueuePdf = enqueuePdf;
exports.enqueueEmail = enqueueEmail;
exports.enqueueSync = enqueueSync;
exports.enqueueReport = enqueueReport;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const connection = new ioredis_1.Redis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null, lazyConnect: true });
// ─── Queue ───────────────────────────────────────────────
exports.jobQueue = new bullmq_1.Queue("toolverse-jobs", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { count: 200 },
        removeOnFail: { count: 100 },
    },
});
// ─── Processor registry ──────────────────────────────────
const processors = new Map();
function registerProcessor(type, handler) {
    processors.set(type, handler);
}
// ─── Worker lifecycle ────────────────────────────────────
let workers = [];
function startWorkers(concurrency = 3) {
    stopWorkers();
    const worker = new bullmq_1.Worker("toolverse-jobs", async (job) => {
        const handler = processors.get(job.name);
        if (!handler) {
            throw new Error(`No processor registered for: ${job.name}`);
        }
        return handler(job);
    }, { connection, concurrency });
    worker.on("completed", (job) => {
        console.log(`[Queue] ✅ ${job.id} (${job.name}) completed`);
    });
    worker.on("failed", (job, err) => {
        console.error(`[Queue] ❌ ${job?.id} (${job?.name}) failed:`, err.message);
    });
    workers = [worker];
}
function stopWorkers() {
    for (const w of workers)
        w.close();
    workers = [];
}
// ─── Enqueue helpers ─────────────────────────────────────
async function enqueuePdf(toolId, format = "pdf") {
    return exports.jobQueue.add("generate-pdf", { toolId, format }, {
        jobId: `pdf:${toolId}:${Date.now()}`,
        priority: 1,
    });
}
async function enqueueEmail(to, subject, template, data) {
    return exports.jobQueue.add("send-email", { to, subject, template, data }, {
        jobId: `email:${to}:${Date.now()}`,
        priority: 5,
    });
}
async function enqueueSync(source, entity) {
    return exports.jobQueue.add("sync-data", { source, entity }, {
        jobId: `sync:${source}:${entity}:${Date.now()}`,
        priority: 3,
    });
}
async function enqueueReport(type, dateRange) {
    return exports.jobQueue.add("build-report", { type, dateRange }, {
        jobId: `report:${type}:${dateRange[0]}:${Date.now()}`,
        priority: 2,
    });
}
//# sourceMappingURL=index.js.map