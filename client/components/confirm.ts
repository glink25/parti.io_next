import { useConfirmProvider } from "client/lib";

export const { provider: ConfirmProvider, showConfirm, injector: ConfirmSlotInjector } = useConfirmProvider()