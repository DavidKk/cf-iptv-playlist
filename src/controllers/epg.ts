import type { IContext } from '@/initializer'
import { controller, XML } from '@/initializer'
import { CHANNEL_MAPPING } from '@/constants/playlist'
import { Epg } from '@/libs/Epg'

export default controller(async (ctx) => {
  const { req } = ctx
  const urls = getEPGUrls(ctx)
  const epg = new Epg({
    infoName: 'iptv-playlist-epg',
    infoUrl: req.url,
    playlistMapping: CHANNEL_MAPPING,
  })

  await epg.loadUrls(...urls)

  const xml = epg.toEPG()
  return XML(xml)
})

function getEPGUrls({ env }: IContext) {
  if (typeof env.EPG_URLS === 'string') {
    return JSON.stringify(env.EPG_URLS)
  }

  if (Array.isArray(env.EPG_URLS)) {
    return env.EPG_URLS
  }

  return []
}
