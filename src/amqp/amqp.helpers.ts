import { Channel } from "amqplib";
import { bindings } from "./amqp.models";

export type FlattenedBindings = { exchange: string; queue: string; topic: string }[];
export function getBindings(): FlattenedBindings {
  return Object.entries(bindings).flatMap(
    ([exchange, exchangeObject]: [string, readonly Record<string, readonly string[]>[]]) => {
      return exchangeObject.flatMap((queues) => {
        return Object.entries(queues).flatMap(([queue, topics]: [string, readonly string[]]) => {
          return topics.map((topic) => ({ exchange, queue, topic }));
        });
      });
    }
  );
}

export function convertToDLX(value: String) {
  return `x-dead-letter-${value}`;
}

export async function bindChannel(ch: Channel): Promise<void> {
  const flatBindings = getBindings();
  await Promise.all(
    flatBindings.map(({ exchange }) => {
      ch.assertExchange(convertToDLX(exchange), "topic", { durable: true });
      ch.assertExchange(exchange, "topic", { durable: true });
    })
  );
  await Promise.all(
    flatBindings.map(({ exchange, queue }) => {
      ch.assertQueue(convertToDLX(queue), { durable: true });
      ch.assertQueue(queue, {
        durable: true,
        deadLetterExchange: convertToDLX(exchange),
        deadLetterRoutingKey: convertToDLX(queue),
      });
    })
  );
  await Promise.all(
    flatBindings.map(({ exchange, queue, topic }) => {
      ch.bindQueue(convertToDLX(queue), convertToDLX(exchange), convertToDLX(queue));
      ch.bindQueue(queue, exchange, topic);
    })
  );
}
