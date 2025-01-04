import apiRouter from '@/routers'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    return apiRouter.handle(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
