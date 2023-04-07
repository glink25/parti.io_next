import { createServer } from 'http';
import { resolve } from 'path';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import { DEV_SOCKET_PORT, PORT } from 'shared/server';
import { Server } from 'socket.io';
import { getIPAddress } from './host';
import { startParti } from './parti';

const isDevelop = process.env.NODE_ENV === 'develop';
const hostIp = getIPAddress();

const app = new Koa();

const httpServer = createServer(app.callback());
const LOCAL_URL = `http://localhost:${PORT}`
const HOST_URL = `http://${hostIp}:${PORT}`
const io = new Server(httpServer, {
  cors: {
    origin: [LOCAL_URL, HOST_URL],
    credentials: true,
  },
});

if (!isDevelop) {
  const staticServe = KoaStatic(resolve(__dirname, './'));
  app.use(staticServe);
  console.log('app running at:');
  console.log(`${LOCAL_URL}/client/index.html`);
  console.log(`${HOST_URL}/client/index.html`);
}

httpServer.listen(isDevelop ? DEV_SOCKET_PORT : PORT, '0.0.0.0');
startParti(io, HOST_URL)

process.on('SIGINT', () => {
  console.log('stoped')
  httpServer.close(() => {
    process.exit(0);
  });
});

