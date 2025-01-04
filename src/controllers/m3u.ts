import type { IContext } from '@/initializer'
import { controller, NotFound, TEXT } from '@/initializer'
import { Playlist } from '@/libs/Playlist'
import { CHANNEL_MAPPING } from '@/constants/playlist'
import { info, warn } from '@/services/logger'

export default controller(async (ctx) => {
  const { req } = ctx

  const urls = getM3UUrls(ctx)
  if (!urls.length) {
    warn(`no m3u urls defined in vars`)
    return NotFound()
  }

  info(`m3u urls ${JSON.stringify(urls, null, 2)}`)

  const playlist = new Playlist({
    playlistMapping: CHANNEL_MAPPING,
  })

  await playlist.loadUrls(...urls)

  const m3u = playlist.toM3U()
  return TEXT(m3u)
})

function getM3UUrls({ env }: IContext) {
  if (typeof env.M3U_URLS === 'string') {
    return JSON.parse(env.M3U_URLS)
  }

  if (Array.isArray(env.M3U_URLS)) {
    return env.M3U_URLS
  }

  return []
}
