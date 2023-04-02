import { networkInterfaces } from "os";

export const getIPAddress = () => {
    const interfaces = networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName]!;
        for (const alias of iface) {
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}