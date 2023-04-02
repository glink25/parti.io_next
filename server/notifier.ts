import { DeepPartial } from "shared/type"


export class Notifier<Change extends object | void = void> {
    private listeners: ((c?: DeepPartial<Change>) => void)[] = []
    protected notify(change?: DeepPartial<Change>) {
        this.listeners.forEach((listener) => {
            listener(change)
        })
    }
    public onChange(listener: (change: DeepPartial<Change>) => void) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(fn => fn !== listener)
        }
    }

    public forceNotify() {
        this.notify()
    }

    public clearAllListeners() {
        this.listeners = []
    }
}