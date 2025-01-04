import type { RouterType } from 'itty-router'

export interface RouteHandler {
  /**
   * 函数类型，用于配置路由器实例。
   * @param router - `itty-router` 实例。
   */
  (router: RouterType): void
}

export function composeRouters(...handlers: RouteHandler[]): RouteHandler {
  /**
   * 组合多个路由处理程序为一个处理程序。
   * @param handlers - 需要组合的路由处理程序。
   * @returns 组合后的路由处理程序。
   */
  return (instance: RouterType) => {
    for (const func of handlers) {
      func(instance)
    }
  }
}
