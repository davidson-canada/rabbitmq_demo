import { Channel, connect, Connection } from "amqplib";
import { bindChannel } from "./amqp.helpers";

type AmqpConnection = "default";
const connections: Partial<Record<AmqpConnection, Connection>> = {};
export async function getConnection(c: AmqpConnection): Promise<Connection> {
  const maybeConnection = connections[c];
  if (!maybeConnection) {
    console.log(`Connection ${c} wasn't cached, creating connection now...`);
    const amqpUrl = "amqp://guest:guest@localhost:5672/"; // normally, inject this via environment variable
    const newConnection = await connect(amqpUrl).catch((e) => {
      console.error(e.message);
      throw e;
    });
    process.on("exit", async () => {
      await newConnection.close();
    });
    connections[c] = newConnection;
    return newConnection;
  }

  console.log(`Connection ${c} was cached, using connection now.`);
  return maybeConnection;
}

type AmqpChannel = "default";
const channels: Partial<Record<AmqpChannel, Channel>> = {}; // Challenge starts here! You'll have to modify this type to accomodate connection-channel caching.
export async function getChannel(ch: AmqpChannel, c: AmqpConnection): Promise<Channel> {
  let maybeChannel = channels[ch];
  if (!maybeChannel) {
    console.log(`Channel ${ch} wasn't cached, creating channel now...`);
    const connection = await getConnection(c);
    const newChannel = await connection.createChannel();
    await bindChannel(newChannel);
    process.on("exit", async () => {
      await newChannel.close();
    });
    channels[ch] = newChannel;
    return newChannel;
  }

  console.log(`Channel ${ch} was cached, using channel now.`);
  return maybeChannel;
}

/**
 * Challenge
 * - Create a connection mechanism that allows its disposal after use. Remember that if a connection is closed
 *   while it's doing an operation, that operation will stop executing.
 */
