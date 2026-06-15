import { Queue, Worker, type Job, type Processor, type ConnectionOptions } from "bullmq";
import { Redis } from "ioredis";

// Cast to ConnectionOptions to absorb minor ioredis patch-version type drift
const connection = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  { maxRetriesPerRequest: null, lazyConnect: true }, // Required by BullMQ; lazyConnect prevents eager connect at module load
) as unknown as ConnectionOptions;

// ─── Type-safe job definitions ───────────────────────────

export type JobType =
  | "generate-pdf"
  | "send-email"
  | "sync-data"
  | "build-report"
  | "iq-pdf-generate"
  | "iq-analytics-update"
  | "iq-norming-recalculate"
  | "iq-session-expiry";

export interface JobPayloads {
  "generate-pdf": { toolId: string; format: "pdf" | "html" };
  "iq-pdf-generate": { sessionId: string; userId?: string };
  "iq-analytics-update": { since: string };
  "iq-norming-recalculate": { triggerReason: string };
  "iq-session-expiry": Record<string, never>;
  "send-email": {
    to: string;
    subject: string;
    template: string;
    data: Record<string, unknown>;
  };
  "sync-data": { source: string; entity: string };
  "build-report": {
    type: "analytics" | "usage" | "revenue";
    dateRange: [string, string];
  };
}

// ─── Queue ───────────────────────────────────────────────

export const jobQueue = new Queue("toolverse-jobs", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 100 },
  },
});

// ─── Processor registry ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processors = new Map<JobType, Processor<any>>();

export function registerProcessor<T extends JobType>(
  type: T,
  handler: (job: Job<JobPayloads[T]>) => Promise<unknown>,
) {
  processors.set(type, handler as Processor);
}

// ─── Worker lifecycle ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let workers: Worker<any, any, any>[] = [];

export function startWorkers(concurrency: number = 3) {
  stopWorkers();

  const worker = new Worker(
    "toolverse-jobs",
    async (job: Job) => {
      const handler = processors.get(job.name as JobType);
      if (!handler) {
        throw new Error(`No processor registered for: ${job.name}`);
      }
      return handler(job as Job<JobPayloads[JobType]>);
    },
    { connection, concurrency },
  );

  worker.on("completed", (job) => {
    console.log(`[Queue] ✅ ${job.id} (${job.name}) completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Queue] ❌ ${job?.id} (${job?.name}) failed:`, err.message);
  });

  workers = [worker];
}

export function stopWorkers() {
  for (const w of workers) w.close();
  workers = [];
}

// ─── Enqueue helpers ─────────────────────────────────────

export async function enqueuePdf(
  toolId: string,
  format: "pdf" | "html" = "pdf",
) {
  return jobQueue.add(
    "generate-pdf",
    { toolId, format },
    {
      jobId: `pdf:${toolId}:${Date.now()}`,
      priority: 1,
    },
  );
}

export async function enqueueEmail(
  to: string,
  subject: string,
  template: string,
  data: Record<string, unknown>,
) {
  return jobQueue.add(
    "send-email",
    { to, subject, template, data },
    {
      jobId: `email:${to}:${Date.now()}`,
      priority: 5,
    },
  );
}

export async function enqueueSync(source: string, entity: string) {
  return jobQueue.add(
    "sync-data",
    { source, entity },
    {
      jobId: `sync:${source}:${entity}:${Date.now()}`,
      priority: 3,
    },
  );
}

export async function enqueueReport(
  type: "analytics" | "usage" | "revenue",
  dateRange: [string, string],
) {
  return jobQueue.add(
    "build-report",
    { type, dateRange },
    {
      jobId: `report:${type}:${dateRange[0]}:${Date.now()}`,
      priority: 2,
    },
  );
}

export async function enqueueIqPdf(sessionId: string, userId?: string) {
  return jobQueue.add(
    "iq-pdf-generate",
    { sessionId, userId },
    {
      jobId: `iq-pdf:${sessionId}`,
      priority: 2,
      attempts: 3,
      backoff: { type: "exponential", delay: 30_000 },
    },
  );
}

export async function enqueueIqAnalyticsUpdate(since: string) {
  return jobQueue.add(
    "iq-analytics-update",
    { since },
    { jobId: `iq-analytics:${since}`, priority: 5 },
  );
}

export async function enqueueIqNormingRecalculate(triggerReason: string) {
  return jobQueue.add(
    "iq-norming-recalculate",
    { triggerReason },
    { jobId: `iq-norming:${Date.now()}`, priority: 8 },
  );
}

export async function enqueueIqSessionExpiry() {
  return jobQueue.add(
    "iq-session-expiry",
    {},
    { jobId: `iq-expiry:${Date.now()}`, priority: 10 },
  );
}
