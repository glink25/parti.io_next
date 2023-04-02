import { computed, customRef, DefineComponent, defineComponent, h, nextTick, reactive, ref, Teleport, watch } from "vue"
import type { Content } from "../content";
import { Binding, createProvider } from "../overlay"
import { useFadeDelay } from "../utils/delay";
import ConfirmProviderVue from "./ConfirmProvider.vue";
import type InjectorTypeHelper from "./InjectorTypeHelper.vue";


export type Selections<V = any> = (readonly string[]) | (readonly { label: string, value: V, entering?: () => Promise<any> }[])


export type ConfirmOption<V extends any = any, CustomSelections extends Selections<V> = string[]> = {
    customClass?: string;
    customContentClass?: string;
    selections?: CustomSelections;
    showClose?: boolean;
    modalClose?: boolean;
} & ({
    injector?: InstanceType<typeof InjectorTypeHelper>
} | Content)

export type ConfirmProps = ConfirmOption<any, any> & { onSelect: (selection: any) => void, withInjector?: (ref: any) => void, clearInjector?: () => void }

export type ConfirmVueProps = {
    customClass?: string;
    customContentClass?: string;
    selections?: any[];
    showClose?: boolean
    modalClose?: boolean
    onSelect: (selection: any) => void
}


export const UNSELECT_CLOSE = Symbol('UNSELECT_CLOSE')


export const useConfirmProvider = () => {
    const { bindings, push, remove } = createProvider<ConfirmOption>()

    const closeConfirm = (id: number, selection: any) => {
        const index = bindings.value.findIndex(c => c.key === id)
        if (index == -1) return
        nextTick(() => {
            remove(id)
        })
    }
    const showConfirm = <V extends any = any, CustomSelections extends Selections<V> = string[]>(option: ConfirmOption<V, CustomSelections>) => {
        return new Promise<CustomSelections[number] extends object ? CustomSelections[number]['value'] : CustomSelections[number]>((res, rej) => {
            const mergedOption: ConfirmProps = {
                ...{ selections: ['Cancel', 'Ok'] }, ...option, onSelect: (select) => {
                    if (select === UNSELECT_CLOSE) {
                        rej('confirm closed without selection')
                    }
                    else if (select !== undefined) {
                        res(select)
                    }
                    closeConfirm(cId, select)
                    return
                },
                withInjector: (option as any).injector ? (ref) => {
                    (option as any).injector.teleportTo?.(ref, cId)
                } : undefined,
            }
            const cId = push(mergedOption as any)
        })
    }

    const provider = defineComponent({
        setup: (p, { slots }) => {
            return () => h(ConfirmProviderVue, { bindings: bindings.value as any }, slots)
        }
    }) as typeof ConfirmProviderVue

    const injector = defineComponent({
        setup: (props, { slots, expose }) => {
            const _to = ref()
            const key = ref()

            const vis = computed(() => bindings.value.find(b => b.key === key.value))

            const teleportTo = (r: any, k: any) => {
                _to.value = r
                key.value = k
            }
            const to = useFadeDelay(() => _to.value)
            expose({ teleportTo })
            return () => to.value ? h(Teleport, { to: to.value },
                {
                    default: () => slots?.default?.({ close: (type?: string) => (vis.value!.bind as any).onSelect(type ?? UNSELECT_CLOSE) })
                }) : undefined
        }
    }) as typeof InjectorTypeHelper

    return { provider, showConfirm, injector }
}