import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const socket: Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ✅ Função para conectar e registrar usuário
export const connectSocket = (userId: number) => {
  if (!socket.connected) socket.connect();

  socket.emit("registrar_usuario", userId);
  console.log("🔗 Socket conectado e usuário registrado:", userId);
};
