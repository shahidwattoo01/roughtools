import { Queue, type Job } from "bullmq";
export type JobType = "generate-pdf" | "send-email" | "sync-data" | "build-report";
export interface JobPayloads {
    "generate-pdf": {
        toolId: string;
        format: "pdf" | "html";
    };
    "send-email": {
        to: string;
        subject: string;
        template: string;
        data: Record<string, unknown>;
    };
    "sync-data": {
        source: string;
        entity: string;
    };
    "build-report": {
        type: "analytics" | "usage" | "revenue";
        dateRange: [string, string];
    };
}
export declare const jobQueue: Queue<any, unknown, string, any, unknown, string>;
export declare function registerProcessor<T extends JobType>(type: T, handler: (job: Job<JobPayloads[T]>) => Promise<unknown>): void;
export declare function startWorkers(concurrency?: number): void;
export declare function stopWorkers(): void;
export declare function enqueuePdf(toolId: string, format?: "pdf" | "html"): Promise<Job<any, unknown, string>>;
export declare function enqueueEmail(to: string, subject: string, template: string, data: Record<string, unknown>): Promise<Job<any, unknown, string>>;
export declare function enqueueSync(source: string, entity: string): Promise<Job<any, unknown, string>>;
export declare function enqueueReport(type: "analytics" | "usage" | "revenue", dateRange: [string, string]): Promise<Job<any, unknown, string>>;
//# sourceMappingURL=index.d.ts.map