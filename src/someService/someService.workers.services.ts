import { isRecord } from "../helpers";
import { isSomeService, SomeService } from "./someService.models";
import { writeSomeServiceToDatabase } from "./someService.repositories";

export async function aFunctionThatBlocksTheEventLoopFor5Seconds(x: unknown): Promise<SomeService | null> {
  const dateIn5Seconds = new Date(new Date().getTime() + 5000);
  let dateCounter = new Date();

  // This here is what blocks the event loop. Once the program gets in the while loop, kiss your thread goodbye for 5 seconds!
  while (dateCounter.getTime() < dateIn5Seconds.getTime()) {
    dateCounter = new Date();
  }

  if (isRecord(x) && "body" in x && isSomeService(x.body)) {
    return writeSomeServiceToDatabase(x.body);
  }
  return null;
}
