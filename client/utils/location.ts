type Params<Keys extends (readonly string[] | string[])> = Partial<Record<Keys[number], string>>

export const createURLHandler = <Keys extends readonly string[]>(locationParamKeys: Keys,) => {
    const createURL = (params: Params<Keys>, origin = location.origin) => {
        const url = new URL(origin)
        Object.entries(params).forEach(([k, v]) => {
            url.searchParams.set(k, v as string)
        })
        return url.href
    }

    const checkURL = (href = location.href, handler: (param: Params<Keys>) => void) => {
        const url = new URL(href)
        const params = url.searchParams
        const partialParams = Object.fromEntries(locationParamKeys.map(k => [k, params.get(k) ?? undefined])) as Params<Keys>
        if (Object.keys(partialParams).length === 0) return false
        handler(partialParams)
        return true
    }
    return {
        checkURL,
        createURL
    }
}

export const clearLocationParams = () => {
    const href = new URL(location.href)
    href.searchParams.forEach((_, key) => {
        href.searchParams.delete(key)
    })
    window.history.pushState({}, '0', href.href)
}