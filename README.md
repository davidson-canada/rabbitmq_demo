# Message-driven architecture with RabbitMQ

I brought this together for a tech talk. The goal is to cover some of the advantages a message-driven architecture can provide, especially for businesses who needs software that's highly available and scalable. The implementation demo is done using RabbitMQ for the message broker and Typescript for the programming language. I am using Node 14 as the runtime.

### Advantages

- Make your main service highly available by moving process-intensive tasks to another processing unit
- Ensure programmed tasks are completed
- Don't lose business-critical data, or failed programmed tasks

### Limitations

- It's hard to pinpoint a specific message in your queues
- Connection management has to be handled carefully, or risk crashing your RabbitMQ server, potentially losing data
- Exchange/Queue/Topic management is brittle

_Note: The limitations might seem to make RabbitMQ an unfavorable solution, but in fact they are easy to overcome. Don't let them stop you from using RabbitMQ._

# How to set up

Make sure you have [Node 14](https://nodejs.org/en/) and [PostgreSQL 12](https://www.postgresql.org/download/) at least, [Typescript](https://www.typescriptlang.org/download) and [RabbitMQ](https://www.rabbitmq.com/download.html) installed.

- `yarn`
- `yarn build:all`
- create a database, named whatever you want,and get its connection string
- create an `.env` file and put the postgresql connection string in the value of the `DATABASE_URL` key.
- `yarn migrate:up` (if this doesn't work, try executing `yarn global add db-migrate` in your console before)
- open two consoles
- `yarn start:api` on one
- `yarn start:worker` on the other
- start hitting the API with `GET` and `POST` requests at `/someService`

# Documentation and other helpful links

- [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
- [amqplib NPM](https://www.npmjs.com/package/amqplib)
- [amqplib doc](http://www.squaremobius.net/amqp.node/)
- [Typescript doc](https://www.typescriptlang.org/docs)
- [PostgreSQL doc](https://www.postgresql.org/docs/)
- [Node 14 doc](https://nodejs.org/dist/latest-v14.x/docs/api/)
- [db-migrate doc](https://db-migrate.readthedocs.io)

# More on scripted commands

- `build:all`, `build:api`, `build:worker` are essentially all "compilers". The first will run the two others successively. The second builds the HTTP API part of the program and dumps the generated `.js` files in the `/dist` folder, while the last one builds the worker program and dumps the generated `.js` files in the `/dist-worker` folder.
- `start:api` and `start:worker` will start their respective processes. They need to be ran separately, because they can't share the same thread/processing unit.
- `reset:worker` if you've played around with RabbitMQ channels, exchanges, queues and topics and it's all screwed up when you try to start it anew, run this and have fun!
- `migrate:up` and `migrate:down` will run the SQL migration scripts fround in the `/migrations` folder.

# A Word of Caution!

This project is **NOT** production-ready and should **NOT** be used in production without some changes to the code. Some things were made the way they're now presented as to keep the tech talk interesting, removing focus from the code to the flow instead.

If you use it in production and end up causing problems, you'll have been warned and thus it will be your entire responsability.

# Challenge

In the `amqp.api.ts` and `amqp.services.ts` files, there are comments inviting you to challenge yourself and make the RabbitMQ API implementation better.

# Last words

If you have any questions, suggestions or ideas concerning this implementation, I'll be pleased to discuss with you.
