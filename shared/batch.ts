import { DeepPartial } from "shared/type"
import { merge, mergePreserveNull } from "./merge"

export const batch = <T extends object>(runner: (data: DeepPartial<T>) => void) => {
    let _data: DeepPartial<T> | undefined
    const collect = (data: DeepPartial<T>) => {
        // runner(data)
        if (_data === undefined) {
            process.nextTick(() => {
                if (_data !== undefined) {
                    console.log('final data', _data)
                    runner(_data)
                    _data = undefined
                }
            })
        }
        _data = (_data === undefined) ? data : mergePreserveNull(_data, data)

    }
    return collect
}