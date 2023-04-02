import { v1 } from "uuid";
export const createToken = () => {
    return v1()
}