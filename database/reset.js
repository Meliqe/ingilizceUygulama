import { openDatabase, initializeDatabase } from './database';

// Veritabanını sıfırlama ve yeniden başlatma işlevi
export async function resetDatabase() {
    try {
        const db = await openDatabase();
        await db.execAsync('DROP TABLE IF EXISTS words; DROP TABLE IF EXISTS idioms;');
        await initializeDatabase(db);
        console.log('Database has been reset and reinitialized successfully.');
    } catch (error) {
        console.error('Failed to reset the database:', error);
    }
}
