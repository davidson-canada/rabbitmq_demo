import { isNotNil, isRecord } from "../helpers";

export type SomeService = {
  id: string;
  date: Date;
};

export function isSomeService(x: unknown | null | undefined): x is SomeService {
  return isRecord(x) && "date" in x;
}

export function rowToSomeService(x: unknown): SomeService | null {
  if (!isRecord(x)) {
    return null;
  }
  return {
    date: x.creation_date as any, // criminal casting, do not do this at work!
    id: x.id as any, // criminal casting, do not do this at work!
  };
}

export function rowsToSomeService(x: unknown[]): SomeService[] {
  return x.map(rowToSomeService).filter(isNotNil);
}
