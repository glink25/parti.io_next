import type { QRCodeRenderersOptions } from 'qrcode';

export const createQrCodeOnCanvas = async (text: string, canvasEl: HTMLCanvasElement, options: QRCodeRenderersOptions = {}) => {
    const QrCode = await import('qrcode');
    return new Promise<void>((res, rej) => {
        QrCode.toCanvas(canvasEl, text, options, rej)
        res()
    })
}