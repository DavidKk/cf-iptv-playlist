import { controller, NotFound, XML } from '@/initializer'
import { CHANNEL_LIST } from '@/constants/playlist'
import { info } from '@/services/logger'
import { pipeEPGStream } from '@/services/epg'
import { fuzzyMatch } from '@/utils/fuzzyMatch'
import { getChannelName } from '@/type'

export default controller(async ({ env }) => {
  const epgUrl = env.EPG_URL
  if (!/https?:\/\//.test(epgUrl)) {
    return NotFound()
  }

  info(`epg urls ${epgUrl}`)

  const epgResponse = await fetch(epgUrl)
  const stream = epgResponse.body
  if (!stream) {
    return NotFound()
  }

  const responseStream = pipeEPGStream(stream, {
    filterChannels(channel) {
      const name = getChannelName(channel)
      const index = CHANNEL_LIST.findIndex((item) => {
        return fuzzyMatch(item.name, name)
      })

      if (index === -1) {
        return false
      }

      const targrt = CHANNEL_LIST[index]
      channel.icon = { $_src: targrt.logo }
      channel._originId = channel.$_id
      channel.$_id = `${targrt.id}`.padStart(4, '0')

      return true
    },
    tranformOriginChannelId(channel) {
      return channel._originId || channel.$_id
    },
  })

  return XML(responseStream)
})
