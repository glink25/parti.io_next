export const merge = <T extends object>(target: any, source: T): T => {
    const entries = Object.entries(target).map(([k, oldValue]) => {
        if (source[k] === undefined) return [k, oldValue]
        if (source[k] === null) return [k, undefined]
        if (Array.isArray(oldValue) || typeof oldValue !== 'object' || oldValue === null) {
            return [k, source[k]]
        }
        return [k, merge(oldValue, source[k])]
    })
    return Object.fromEntries(entries)
}

export const mergePreserveNull = <T extends object>(target: any, source: T): T => {
    const entries = Object.entries(target).map(([k, oldValue]) => {
        if (source[k] === undefined) return [k, oldValue]
        if (source[k] === null) return [k, null]
        if (Array.isArray(oldValue) || typeof oldValue !== 'object' || oldValue === null) {
            return [k, source[k]]
        }
        return [k, merge(oldValue, source[k])]
    })
    return Object.fromEntries(entries)
}