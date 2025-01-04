import type { RouterType } from 'itty-router'
import epg from '@/controllers/epg.mock'
import m3u from '@/controllers/m3u.mock'

export default function iptv(router: RouterType) {
  router.get('/iptv.mock.m3u', m3u)
  router.get('/epg.mock.xml', epg)

  router.get('/test', async () => {
    const response = await fetch('view-source:https://epg.112114.xyz/pp.xml')
    const content = await response.text()
    return new Response(content, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    })
  })
}
