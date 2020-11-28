import { Channel, ConsumeMessage } from "amqplib";
import { Queue, Topic, Exchange, CustomMessage } from "./amqp.models";

type ProcessMessage = (msg: ConsumeMessage) => Promise<void>;
export async function consumeFromQueue(channel: Channel, queue: Queue, fn: ProcessMessage): Promise<void> {
  await channel.consume(
    queue,
    (msg) => {
      if (msg) {
        fn(msg)
          .then(() => channel.ack(msg))
          .catch((errors) => {
            const errorMsg = Array.isArray(errors)
              ? errors.join(",")
              : errors instanceof Error
              ? errors.stack
              : JSON.stringify(errors);

            const { fields, properties } = msg;

            console.error(
              `${errorMsg} for fields '${JSON.stringify(fields)}' and properties ${JSON.stringify(
                properties
              )} received on the '${queue}' queue`
            );
            channel.reject(msg, false);
            // You could build a mechanism that allows you to requeue messages in the same queue if you choose,
            // by switching the false for true. Otherwise, it gets dead-lettered. Read more on dead-lettering to learn more.
          });
      }
    },
    { noAck: false }
  );
}

export async function publish(
  channel: Channel,
  exchange: Exchange,
  topic: Topic,
  message: CustomMessage
): Promise<void> {
  const stringifiedMessage = JSON.stringify(message);
  const bufferedMessage = Buffer.from(stringifiedMessage);
  const correlationId = "someTracingId"; // some tracing id that comes from the request/controller publishing a message to the broker
  channel.publish(exchange, topic, bufferedMessage, {
    messageId: "someMessageId", // a randomly generated identifier for this specific message
    correlationId: typeof correlationId === "string" ? correlationId : undefined,
    timestamp: new Date().getTime(),
    contentType: "application/json",
  });
}
