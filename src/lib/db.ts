import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Asegurarse de que la carpeta de datos existe
const dbPath = path.join(process.cwd(), 'data/local.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS careers (
    id TEXT PRIMARY KEY,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    password TEXT,
    is_new_user BOOLEAN DEFAULT 1,
    manual_selection_completed BOOLEAN DEFAULT 0,
    career_id TEXT,
    FOREIGN KEY (career_id) REFERENCES careers(id)
  );
 
  CREATE TABLE IF NOT EXISTS course_status (
    user_id TEXT,
    course_code TEXT,
    status TEXT, -- 'approved' | 'current'
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_code),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
 
  CREATE TABLE IF NOT EXISTS years (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    career_id TEXT,
    year_number INTEGER,
    name TEXT,
    color TEXT,
    FOREIGN KEY (career_id) REFERENCES careers(id)
  );
 
  CREATE TABLE IF NOT EXISTS periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year_id INTEGER,
    p INTEGER,
    label TEXT,
    ca INTEGER,
    FOREIGN KEY (year_id) REFERENCES years(id)
  );
 
  CREATE TABLE IF NOT EXISTS courses (
    code TEXT PRIMARY KEY,
    name TEXT,
    ca INTEGER,
    status TEXT,
    equiv BOOLEAN DEFAULT 0
  );
 
  CREATE TABLE IF NOT EXISTS course_period (
    course_code TEXT,
    year_id INTEGER,
    period INTEGER,
    PRIMARY KEY (course_code, year_id, period),
    FOREIGN KEY (course_code) REFERENCES courses(code),
    FOREIGN KEY (year_id) REFERENCES years(id)
  );
 
  CREATE TABLE IF NOT EXISTS prerequisites (
    course_code TEXT,
    prerequisite_code TEXT,
    PRIMARY KEY (course_code, prerequisite_code),
    FOREIGN KEY (course_code) REFERENCES courses(code),
    FOREIGN KEY (prerequisite_code) REFERENCES courses(code)
  );
`);

export default db;
