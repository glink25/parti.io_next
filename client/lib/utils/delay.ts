import { computed, ref, watch } from "vue"

export const useFadeDelay = <T>(fn: () => T | undefined, delay = 200) => {
    const x = computed(() => fn())
    const v = ref(x.value)
    let timer: any
    watch(x, () => {
        timer && clearTimeout(timer)
        if (x.value) {
            v.value = x.value as any
        } else {
            timer = setTimeout(() => {
                v.value = x.value as any
            }, delay);
        }
    })
    return v

}