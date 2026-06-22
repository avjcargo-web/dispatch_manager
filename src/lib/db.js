import mysql from "mysql2/promise";

const REQUIRED_DATABASE_ENV_VARS = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required database environment variable: ${name}`);
  }

  return value;
}

const globalForDb = globalThis;

export function getMissingDatabaseEnvVars() {
  return REQUIRED_DATABASE_ENV_VARS.filter((name) => !process.env[name]);
}

export function isDatabaseConfigured() {
  return getMissingDatabaseEnvVars().length === 0;
}

export function getPool() {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      host: getRequiredEnv("DB_HOST"),
      user: getRequiredEnv("DB_USER"),
      password: getRequiredEnv("DB_PASSWORD"),
      database: getRequiredEnv("DB_NAME"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return globalForDb.mysqlPool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
