import type { IContext } from '@/initializer'
import { controller, TEXT } from '@/initializer'
import { Playlist } from '@/libs/Playlist'
import { CHANNEL_MAPPING } from '@/constants/playlist'

export default controller(async (ctx) => {
  const { req } = ctx
  const url = new URL(req.url)
  const baseUrl = url.protocol + '//' + url.hostname

  const m3uUrls = getM3UUrls(ctx)
  const playlist = new Playlist({
    urlTvg: `${baseUrl}/epg.xml`,
    xTvgUrl: `${baseUrl}/epg.xml`,
    playlistMapping: CHANNEL_MAPPING,
  })

  await playlist.loadUrls(...m3uUrls)

  const m3u = playlist.toM3U()
  return TEXT(m3u)
})

function getM3UUrls({ env }: IContext) {
  if (typeof env.M3U_URLS === 'string') {
    return JSON.stringify(env.M3U_URLS)
  }

  if (Array.isArray(env.M3U_URLS)) {
    return env.M3U_URLS
  }

  return []
}
