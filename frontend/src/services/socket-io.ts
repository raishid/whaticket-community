import openSocket from "socket.io-client";
import { backendUrl } from "../config";

function connectToSocket() {
  const token = localStorage.getItem("token");
  return openSocket(backendUrl, {
    transports: ["websocket", "polling", "flashsocket"],
    query: { token: token ? JSON.parse(token) : "" },
  });
}

export default connectToSocket;
