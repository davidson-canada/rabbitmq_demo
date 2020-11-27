import SQL from "sql-template-strings";
import { query } from "../postgres/postgres.api";
import { rowsToSomeService, rowToSomeService, SomeService } from "./someService.models";

export async function writeSomeServiceToDatabase(x: Pick<SomeService, "date">): Promise<SomeService | null> {
  const { rowCount, rows } = await query(
    SQL`INSERT INTO some_services (creation_date) VALUES (${x.date}) RETURNING *;`
  );
  if (rowCount === 0) {
    return null;
  }
  return rowToSomeService(rows[0]);
}

export async function readSomeServiceFromDatabase(): Promise<SomeService[]> {
  const { rows } = await query(SQL`SELECT * FROM some_services;`);
  return rowsToSomeService(rows);
}
