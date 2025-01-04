import type { IRequest } from 'itty-router'

export interface IContext {
  /** 请求对象。 */
  req: IRequest
  /** 环境对象。 */
  env: Env
  /** 执行上下文。 */
  ctx: ExecutionContext
}

export type Handler = (context: IContext, ...args: any[]) => any
export type HandlerReturn<T> = T extends Handler ? ReturnType<T> : never
export type HandlerParameters<T> = T extends Handler ? (Parameters<T> extends [context: IContext, ...rest: infer A] ? A : never) : never
export type TrimHandler<T> = (...args: HandlerParameters<T>) => HandlerReturn<T>

/**
 * 检查给定的函数是否为处理程序。
 * @param fn - 要检查的函数。
 * @returns 如果函数是处理程序，则返回 true；否则返回 false。
 */
export function isHandler(fn: any): fn is Handler {
  return typeof fn === 'function' && fn.length > 0
}
