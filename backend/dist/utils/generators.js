"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTenantStudentCode = void 0;
const database_1 = __importDefault(require("../config/database"));
const generateTenantStudentCode = async (tenantId, tx) => {
    const db = tx || database_1.default;
    const lastStudent = await db.student.findFirst({
        where: { user: { tenantId } },
        orderBy: { studentCode: 'desc' }
    });
    if (!lastStudent || !lastStudent.studentCode.startsWith('S1000')) {
        return 'S1000001';
    }
    const numStr = lastStudent.studentCode.substring(1);
    const num = parseInt(numStr, 10);
    if (isNaN(num)) {
        return 'S1000001';
    }
    return `S${num + 1}`;
};
exports.generateTenantStudentCode = generateTenantStudentCode;
//# sourceMappingURL=generators.js.map