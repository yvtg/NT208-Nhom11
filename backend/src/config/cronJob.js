import cron from 'node-cron'
import database from "../config/database.js";

// Cập nhật status project nếu hết hạn
async function updateExpiredProjects() {
    try {
        const result = await database.query(`
            UPDATE projects
            SET status = 'closed'
            WHERE expireddate < NOW()
                AND status != 'closed'
        `);
        console.log(`[Cron] Đã cập nhật ${result.rowCount} dự án hết hạn.`);
    } catch (err) {
        console.error('[Cron] Lỗi khi cập nhật projects:', err);
    }
}

// Lên lịch chạy mỗi 5 phút
cron.schedule('*/5 * * * *', () => {
    console.log('[Cron] Kiểm tra project hết hạn...');
    updateExpiredProjects();
});

export { updateExpiredProjects };
