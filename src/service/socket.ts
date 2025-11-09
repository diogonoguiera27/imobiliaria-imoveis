import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const socket: Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
});
