/**
 * Singleton Socket.io client.
 * Import `getSocket()` anywhere on the client side.
 */
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    })
  }
  return socket
}
