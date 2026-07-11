import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('prayer_times.db');

export const initDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS prayer_times (
      date TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);
};

export const savePrayerTimes = (dateKey, data) => {
  const timestamp = Date.now();
  db.runSync(
    'INSERT OR REPLACE INTO prayer_times (date, data, timestamp) VALUES (?, ?, ?)',
    [dateKey, JSON.stringify(data), timestamp]
  );
};

export const getPrayerTimes = (dateKey) => {
  const result = db.getFirstSync(
    'SELECT data FROM prayer_times WHERE date = ?',
    [dateKey]
  );
  return result ? JSON.parse(result.data) : null;
};

export const clearOldData = () => {
  // Clear data older than 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  db.runSync('DELETE FROM prayer_times WHERE timestamp < ?', [thirtyDaysAgo]);
};
