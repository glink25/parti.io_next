import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        order: number
        // 每个路由都必须声明
        transition: string
    }
}