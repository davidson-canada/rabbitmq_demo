import { Request, Response } from "express";
import { constants } from "http2";
import { getChannel } from "../amqp/amqp.api";
import { publish } from "../amqp/amqp.services";
import { readSomeServiceFromDatabase } from "./someService.repositories";
import { aFunctionThatBlocksTheEventLoopFor5Seconds } from "./someService.workers.services";

export async function getSomeServiceFail(_req: Request, res: Response): Promise<void> {
  const someService = await aFunctionThatBlocksTheEventLoopFor5Seconds({});
  res.status(constants.HTTP_STATUS_OK).json(someService);
}

export async function getSomeService(_req: Request, res: Response): Promise<void> {
  const someService = await readSomeServiceFromDatabase();
  res.status(constants.HTTP_STATUS_OK).json(someService);
}

export async function setSomeService(_req: Request, res: Response): Promise<void> {
  const channel = await getChannel("default", "default");
  await publish(channel, "someExchange", "someExchange.someQueue.someTopic", {
    type: "someType",
    body: {
      date: new Date(),
    },
  }).catch((e) => {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ errors: [e.message] });
  });

  res.status(constants.HTTP_STATUS_OK).end();
}
