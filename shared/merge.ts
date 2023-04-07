export const merge = <T extends object>(target: any, source: T, preserveNull = false): T => {
    const totalKeys = [...new Set([...Object.keys(target), ...Object.keys(source)])]
    const entries = totalKeys.map((key) => {
        const oldValue = target[key]
        const newValue = source[key]
        if (newValue === undefined) return [key, oldValue]
        if (newValue === null) return [key, preserveNull ? null : undefined]
        if (Array.isArray(newValue) || typeof newValue !== 'object' || newValue === null) {
            return [key, newValue]
        }
        if (oldValue === undefined || oldValue === null) return [key, newValue]
        return [key, merge(oldValue, newValue)]
    })
    return Object.fromEntries(entries)
}

export const mergePreserveNull = <T extends object>(target: any, source: T): T => merge(target, source, true)

export const pick = <R extends object>(target: R, keys: (keyof R)[]) => {
    return Object.fromEntries(keys.map((key) => [key, target[key]])) as { [k in typeof keys[number]]: R[k] }
}