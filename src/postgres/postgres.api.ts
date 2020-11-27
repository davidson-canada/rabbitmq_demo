import { Pool, QueryResultRow } from "pg";
import { SQLStatement } from "sql-template-strings";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/rabbitmq_demo",
  max: 5,
  ssl: false,
});

export function query(x: SQLStatement): Promise<QueryResultRow> {
  return pool.query(x);
}
