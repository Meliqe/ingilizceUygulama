import * as SQLite from 'expo-sqlite';

// Veritabanını aç
export const openDatabase = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('englishDB.db');
        console.log("Database opened:", db);
        return db;
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// Veritabanını başlatma ve tablo oluşturma
export async function initializeDatabase(db) {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY NOT NULL,
                english_word TEXT NOT NULL,
                meaning TEXT NOT NULL,
                level TEXT,
                usage_sentence TEXT,
                usage_sentence_meaning TEXT
            );
            CREATE TABLE IF NOT EXISTS idioms (
                id INTEGER PRIMARY KEY NOT NULL,
                idiom TEXT NOT NULL,
                meaning TEXT NOT NULL,
                usage_sentence TEXT,
                usage_sentence_meaning TEXT
            );
        `);
        console.log('Database and tables created successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

// Kelime ekleme
export async function insertWord(db, word, meaning, level, usage, usageMeaning) {
    const insertStatement = await db.prepareAsync(
        'INSERT INTO words (english_word, meaning, level, usage_sentence, usage_sentence_meaning) VALUES ($word, $meaning, $level, $usage, $usageMeaning)'
    );
    try {
        const result = await insertStatement.executeAsync({
            $word: word,
            $meaning: meaning,
            $level: level,
            $usage: usage,
            $usageMeaning: usageMeaning
        });
        console.log('Inserted word with ID:', result.lastInsertRowId);
    } finally {
        await insertStatement.finalizeAsync();
    }
}

// Kelimeleri getirme
export async function getWords(db) {
    const selectStatement = await db.prepareAsync('SELECT * FROM words');
    try {
        const result = await selectStatement.executeAsync();
        const allRows = await result.getAllAsync();
        console.log('Fetched rows:', allRows); // Veriyi kontrol et
        return allRows;
    } finally {
        await selectStatement.finalizeAsync();
    }
}

export async function updateWord(db, id, wordText, meaning, level, usage, usageMeaning) {
    const updateStatement = await db.prepareAsync(
        `UPDATE words 
         SET english_word = $wordText,
             meaning = $meaning,
             level = $level,
             usage_sentence = $usage,
             usage_sentence_meaning = $usageMeaning
         WHERE id = $id`
    );
    try {
        const result = await updateStatement.executeAsync({
            $id: id,
            $wordText: wordText,
            $meaning: meaning,
            $level: level,
            $usage: usage,
            $usageMeaning: usageMeaning
        });
        console.log('Updated rows:', result.changes);
    } catch (error) {
        console.error('Error updating word:', error);
    } finally {
        await updateStatement.finalizeAsync();
    }
}


// Kelime silme
export async function deleteWord(db, id) {
    const deleteStatement = await db.prepareAsync(
        'DELETE FROM words WHERE id = $id'
    );
    try {
        const result = await deleteStatement.executeAsync({
            $id: id
        });
        console.log('Deleted rows:', result.changes);
    } finally {
        await deleteStatement.finalizeAsync();
    }
}

// Deyim ekleme
export async function insertIdioms(db, idiom, meaning, usage, usageMeaning) {
    const insertStatement = await db.prepareAsync(
        'INSERT INTO idioms (idiom, meaning, usage_sentence, usage_sentence_meaning) VALUES ($idiom, $meaning, $usage, $usageMeaning)'
    );
    try {
        const result = await insertStatement.executeAsync({
            $idiom: idiom,
            $meaning: meaning,
            $usage: usage,
            $usageMeaning: usageMeaning
        });
        console.log('Inserted idiom with ID:', result.lastInsertRowId);
    } finally {
        await insertStatement.finalizeAsync();
    }
}

// Deyimleri getirme
export async function getIdioms(db) {
    const selectStatement = await db.prepareAsync('SELECT * FROM idioms');
    try {
        const result = await selectStatement.executeAsync();
        const allRows = await result.getAllAsync();
        console.log('Fetched rows:', allRows); // Veriyi kontrol et
        return allRows;
    } finally {
        await selectStatement.finalizeAsync();
    }
}

// Deyim güncelleme
export async function updateIdiom(db, id, idiomText, meaning, usage, usageMeaning) {
    const updateStatement = await db.prepareAsync(
        `UPDATE idioms 
         SET idiom = $idiomText,
             meaning = $meaning,
             usage_sentence = $usage,
             usage_sentence_meaning = $usageMeaning
         WHERE id = $id`
    );
    try {
        const result = await updateStatement.executeAsync({
            $id: id,
            $idiomText: idiomText,
            $meaning: meaning,
            $usage: usage,
            $usageMeaning: usageMeaning
        });
        console.log('Updated rows:', result.changes);
    } finally {
        await updateStatement.finalizeAsync();
    }
}


// Deyim silme
export async function deleteIdiom(db, id) {
    const deleteStatement = await db.prepareAsync(
        'DELETE FROM idioms WHERE id = $id'
    );
    try {
        const result = await deleteStatement.executeAsync({
            $id: id
        });
        console.log('Deleted rows:', result.changes);
    } finally {
        await deleteStatement.finalizeAsync();
    }
}

export async function getRandomWord(db) {
    const selectStatement = await db.prepareAsync('SELECT * FROM words ORDER BY RANDOM() LIMIT 1');
    try {
        const result = await selectStatement.executeAsync();
        const [randomWord] = await result.getAllAsync();
        console.log('Fetched random word:', randomWord);
        return randomWord;
    } finally {
        await selectStatement.finalizeAsync();
    }
}


export async function getRandomIdiom(db) {
    const selectStatement = await db.prepareAsync('SELECT * FROM idioms ORDER BY RANDOM() LIMIT 1');
    try {
        const result = await selectStatement.executeAsync();
        const [randomIdiom] = await result.getAllAsync();
        console.log('Fetched random idiom:', randomIdiom);
        return randomIdiom;
    } finally {
        await selectStatement.finalizeAsync();
    }
}


// Hem kelimenin hem de anlamın mevcut olup olmadığını kontrol et (büyük/küçük harf duyarsız)
export async function checkWordExists(db, word, meaning) {
    try {
        const query = `
            SELECT COUNT(*) as count 
            FROM words 
            WHERE LOWER(english_word) = LOWER(?) AND LOWER(meaning) = LOWER(?);
        `;
        const [result] = await db.getAllAsync(query, [word, meaning]);
        return result.count > 0;
    } catch (error) {
        console.error('Error checking word existence:', error);
        return false;
    }
}

export async function checkIdiomExists(db, idiom, meaning) {
    try {
        const query = `
            SELECT COUNT(*) as count 
            FROM idioms 
            WHERE LOWER(idiom) = LOWER(?) AND LOWER(meaning) = LOWER(?);
        `;
        const [result] = await db.getAllAsync(query, [idiom, meaning]);
        return result.count > 0;
    } catch (error) {
        console.error('Error checking idiom existence:', error);
        return false;
    }
}
















