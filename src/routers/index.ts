import { Router } from 'itty-router'
import { composeRouters } from '@/utils/composeRouters'
import iptv from './iptv'
import mock from './mock'

const initRouter = composeRouters(iptv, mock)

const router = Router()
initRouter(router)

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
