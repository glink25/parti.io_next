import { defineComponent, h } from "vue"
import { Binding, createProvider } from "../overlay"
import type { Content } from "../content"
import NoticeProvider from "./NoticeProvider.vue";

export type NoticeType = 'success' | 'warning' | 'info' | 'error'

export type NoticeOption = { type?: NoticeType, timeout?: number } & Content

export const useNoticeProvider = () => {
    const { bindings, unshift, remove } = createProvider<NoticeOption>()

    const showNotice = (option: NoticeOption) => {
        const mergedOption: NoticeOption = { ...{ type: 'success', timeout: 2000 }, ...option }
        const key = unshift(mergedOption)
        setTimeout(() => {
            remove(key)
        }, mergedOption.timeout);
    }

    const provider = defineComponent({
        setup: (p, { slots }) => {
            return () => h(NoticeProvider, { bindings: bindings.value as any }, slots)
        }
    }) as typeof NoticeProvider

    return {
        showNotice,
        provider,
    }

}