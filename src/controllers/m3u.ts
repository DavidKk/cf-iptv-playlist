import type { M3uChannel } from '@iptv/playlist'
import { controller, NotFound, M3U } from '@/initializer'
import { CHANNEL_LIST, CHANNEL_GROUP } from '@/constants/playlist'
import { info, warn } from '@/services/logger'
import { getM3UUrls, loadM3UFiles, stringifyM3U } from '@/services/m3u'
import { fuzzyMatch } from '@/utils/fuzzyMatch'

export default controller(async (ctx) => {
  const { req } = ctx

  const urls = getM3UUrls(ctx)
  if (!urls.length) {
    warn(`no m3u urls defined in vars`)
    return NotFound()
  }

  info(`m3u urls ${JSON.stringify(urls, null, 2)}`)

  const channels = await loadM3UFiles(...urls)

  const filteredChannels = Array.from(
    (function* () {
      for (const channel of channels) {
        const channelName = channel.name || channel.tvgName
        if (!channelName) {
          continue
        }

        for (const { id, name: tvgName, logo: tvgLogo } of CHANNEL_LIST) {
          const familiar = fuzzyMatch(tvgName, channelName)
          if (!familiar) {
            continue
          }

          const groups = Object.keys(CHANNEL_GROUP).filter((groupTitle) => {
            const names = CHANNEL_GROUP[groupTitle]
            return names.includes(tvgName)
          })

          const tvgId = `${id}`.padStart(4, '0')
          for (const groupTitle of groups) {
            const tvChannel = { ...channel, groupTitle, tvgId, tvgName } satisfies M3uChannel
            yield { ...tvChannel, tvgLogo, familiar }
          }
        }
      }
    })()
  )

  const uniqedChannels = Array.from(
    (function () {
      const map = new Map<string, { tvgId: string; familiar: number }>()

      for (const channel of filteredChannels) {
        const key = `${channel.tvgId}-${channel.groupTitle}`
        const target = map.get(key)
        if (!target || target.familiar > channel.familiar) {
          map.set(key, channel)
        }
      }

      return map.values()
    })()
  )

  const url = new URL(req.url)
  const baseUrl = url.protocol + '//' + url.hostname
  const response = stringifyM3U(uniqedChannels, {
    urlTvg: `${baseUrl}/epg.xml`,
    xTvgUrl: `${baseUrl}/epg.xml`,
  })

  return M3U(response)
})
