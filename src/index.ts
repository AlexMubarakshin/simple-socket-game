import { Server } from "./Server";

const server = new Server(process.env.PORT || "3000");
server.start();