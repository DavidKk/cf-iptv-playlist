import type { IRequest } from 'itty-router'
import type { Handler, TrimHandler, HandlerParameters, HandlerReturn, IContext } from './types'

export interface ControllerContext extends IContext {
  /**
   * 注册一个处理程序到上下文中。
   * @param handler - 需要注册的处理程序。
   * @returns 处理程序的修剪版本。
   */
  use<T extends Handler>(handler: T): TrimHandler<T>
}

export type ControllerHandler = (ctx: ControllerContext) => Response | Promise<Response>

export class Context {
  public readonly req: IRequest
  public readonly env: Env
  public readonly ctx: ExecutionContext

  /**
   * 创建一个新的上下文实例。
   * @param req - 请求对象。
   * @param env - 环境对象。
   * @param ctx - 执行上下文。
   */
  constructor(req: IRequest, env: Env, ctx: ExecutionContext) {
    this.req = req
    this.env = env
    this.ctx = ctx
  }

  /**
   * 获取当前上下文的所有属性。
   * @returns 包含请求、环境和执行上下文的对象。
   */
  public get context() {
    return {
      req: this.req,
      env: this.env,
      ctx: this.ctx,
    }
  }

  /**
   * 获取上下文的源对象，包括 `use` 方法和上下文属性。
   * @returns 包含 `use` 方法和上下文属性的对象。
   */
  public get source() {
    const use = this.use.bind(this)
    return { use, ...this.context }
  }

  /**
   * 注册并执行处理程序。
   * @param handler - 需要执行的处理程序。
   * @returns 处理程序的返回值。
   */
  public use<T extends Handler>(handler: T) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    return function (this: any, ...args: HandlerParameters<T>): HandlerReturn<T> {
      return handler.call(this, context, ...args)
    }
  }
}

export function controller(handler: ControllerHandler) {
  /**
   * 创建一个控制器处理程序，用于处理请求。
   * @param handler - 控制器处理程序。
   * @returns 处理请求的函数。
   */
  return (req: IRequest, env: Env, ctx: ExecutionContext) => {
    const context = new Context(req, env, ctx)
    try {
      return handler(context.source)
    } catch (err) {
      const reason = err instanceof Error ? err?.message : Object.prototype.toString.call(err)
      return new Response(reason, { status: 500 })
    }
  }
}
