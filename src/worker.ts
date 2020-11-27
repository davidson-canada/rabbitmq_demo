import { getChannel } from "./amqp/amqp.api";
import { consumeFromQueue } from "./amqp/amqp.services";
import { aFunctionThatBlocksTheEventLoopFor5Seconds } from "./someService/someService.workers.services";

console.log(`Started process on process pid ${process.pid}`);

(async function () {
  const channel = await getChannel("default", "default");

  consumeFromQueue(channel, "someQueue", async (msg) => {
    const body = JSON.parse(msg.content.toString());
    await aFunctionThatBlocksTheEventLoopFor5Seconds(body);
  }).catch((e) => {
    console.error(`Error while consuming message from queue "someQueue": ${JSON.stringify(e)}`);
  });
})();
