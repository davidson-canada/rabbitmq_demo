import express from "express";
import { getSomeService, setSomeService } from "./someService/someService.controllers";

const PORT = process.env.PORT || 8080;
const server = express();

server.get("/someService", getSomeService);
server.post("/someService", setSomeService);

server.listen(PORT, () => console.log(`Server listening on ${PORT} and process pid ${process.pid}`));
