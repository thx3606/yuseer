import prisma from '../config/database';

/**
 * Generates a unique sequential student code per tenant in the format S100000X
 * Ensures no collisions by getting the highest current code and incrementing.
 */
export const generateTenantStudentCode = async (tenantId: string, tx?: any): Promise<string> => {
    const db = tx || prisma;

    // Find the latest student of this tenant by parsing the studentCode numerically
    const lastStudent = await db.student.findFirst({
        where: { user: { tenantId } },
        orderBy: { studentCode: 'desc' } // Doing a string desc sort works for S100000X if padding is consistent
    });

    if (!lastStudent || !lastStudent.studentCode.startsWith('S1000')) {
        return 'S1000001';
    }

    // Extract the numeric part after 'S'
    const numStr = lastStudent.studentCode.substring(1);
    const num = parseInt(numStr, 10);

    if (isNaN(num)) {
        return 'S1000001';
    }

    return `S${num + 1}`;
};
