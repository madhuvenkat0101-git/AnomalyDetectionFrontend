import { io } from 'socket.io-client';

// Single shared connection to the Node service. Components subscribe to
// 'tick' / 'alert' directly so high-frequency ticks update charts imperatively
// without triggering React re-renders.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const socket = io(API_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
});

export { API_URL };
export default socket;