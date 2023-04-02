import { CacheMap } from "shared/cacheMap"

// density of 4 for the lowest probability of collision
const SQUARE_DENSITY = 4
// 18 different colors only for easy distinction
const COLORS_NB = 18
const DEFAULT_SATURATION = 50
const DEFAULT_LIGHTNESS = 50

// 32 bit FNV-1a hash parameters
const FNV_PRIME = 16777619
const OFFSET_BASIS = 2166136261

// based on the FNV-1a hash algorithm, modified for *signed* 32 bit integers http://www.isthe.com/chongo/tech/comp/fnv/index.html
export const simpleHash = (str: string) => {
    return str.split('')
        // >>> 0 for 32 bit unsigned integer conversion https://2ality.com/2012/02/js-integers.html
        .reduce((hash, char) => ((hash ^ char.charCodeAt(0)) >>> 0) * FNV_PRIME, OFFSET_BASIS)
}


export const createIconImg = (() => {
    const cache = new CacheMap<string, string>({ maxSize: 10, cleanUp: (_, val) => { URL.revokeObjectURL(val) } })
    return async (username: string,) => {
        if (cache.has(username)) return cache.get(username)!
        const saturation = DEFAULT_SATURATION
        const lightness = DEFAULT_LIGHTNESS
        const canvas = document.createElement('canvas')
        const col = 5
        const scale = 10
        canvas.width = col * scale
        canvas.height = col * scale
        const ctx = canvas.getContext('2d')!



        const hash = simpleHash(username)
        // dividing hash by FNV_PRIME to get last XOR result for better color randomness (will be an integer except for empty string hash)
        const hue = ((hash / FNV_PRIME) % COLORS_NB) * (360 / COLORS_NB);
        const color = `hsl(${hue} ${saturation}% ${lightness}%)`

        ctx.fillStyle = color;
        [...Array(username ? (col * col) : 0)].forEach((_, i) => {
            const canDraw = hash % (16 - i % 15) < SQUARE_DENSITY
            if (!canDraw) return
            const x = i > 14 ? 7 - ~~(i / col) : ~~(i / col)
            const y = i % col
            ctx?.fillRect(x * scale, y * scale, scale, scale)
        })

        const blob = await new Promise<Blob>((res, rej) => {
            canvas.toBlob((b) => {
                if (b) {
                    res(b)
                } else {
                    rej()
                }
            }, 'image/png')

        })
        const url = URL.createObjectURL(blob)
        cache.set(username, url)
        return url


    }
})()