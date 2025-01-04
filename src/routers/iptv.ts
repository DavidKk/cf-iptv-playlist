import type { RouterType } from 'itty-router'
import m3u from '@/controllers/m3u'
import epg from '@/controllers/epg'

export default function iptv(router: RouterType) {
  router.get('/iptv.m3u', m3u)
  router.get('/epg.xml', epg)
}
