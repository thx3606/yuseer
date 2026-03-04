import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ({
        emit: "event";
        level: "query";
    } | {
        emit: "event";
        level: "error";
    } | {
        emit: "event";
        level: "info";
    } | {
        emit: "event";
        level: "warn";
    })[];
    errorFormat: "pretty";
}, "error" | "info" | "query" | "warn", import("@prisma/client/runtime/library").DefaultArgs>;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
export declare const healthCheck: () => Promise<boolean>;
export default prisma;
//# sourceMappingURL=database.d.ts.map