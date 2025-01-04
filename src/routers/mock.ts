import type { RouterType } from 'itty-router'
import epg from '@/controllers/epg.mock'
import m3u from '@/controllers/m3u.mock'

export default function iptv(router: RouterType) {
  router.get('/iptv.mock.m3u', m3u)
  router.get('/epg.mock.xml', epg)
}
