import { createIconImg } from "client/utils/icon"
import { ref } from "vue"

export const useAvatar = (name: string) => {
    const url = ref('')
    createIconImg(name).then((imageUrl) => {
        url.value = imageUrl
    })
    return url
}