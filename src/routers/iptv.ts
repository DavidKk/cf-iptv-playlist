import type { RouterType } from 'itty-router'
import m3u from '@/controllers/m3u'

export default function iptv(router: RouterType) {
  router.get('/iptv.m3u', m3u)
}
