import { XMLBuilder } from 'fast-xml-parser'
import { controller, NotFound, XML } from '@/initializer'
import { CHANNEL_LIST } from '@/constants/playlist'
import { info } from '@/services/logger'
import { readEPGFromStream } from '@/services/epg'
import { fuzzyMatch } from '@/utils/fuzzyMatch'

export default controller(async ({ env }) => {
  const epgUrl = env.EPG_URL
  if (!/https?:\/\//.test(epgUrl)) {
    return NotFound()
  }

  info(`epg urls ${epgUrl}`)

  const response = await fetch(epgUrl)
  if (!response.ok) {
    return NotFound()
  }

  const stream = response.body
  if (!stream) {
    return NotFound()
  }

  const { channels, programmes } = await readEPGFromStream(stream, {
    filterChannels(channel) {
      const index = CHANNEL_LIST.findIndex((item) => {
        const name = channel['display-name']
        return fuzzyMatch(item.name, name)
      })

      if (index === -1) {
        return false
      }

      const targrt = CHANNEL_LIST[index]
      channel['display-name'] = targrt.name
      channel.icon = { $_src: targrt.logo }
      channel._originId = channel.$_id
      channel.$_id = `${targrt.id}`.padStart(4, '0')

      return true
    },
    tranformChannelId(channel) {
      return channel._originId || channel.$_id
    },
  })

  info(`fetch ${channels.length} channels and ${programmes.length} programmes`)

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: '$_',
  })

  const xml = builder.build({ channel: channels, programme: programmes })
  return XML(`<?xml version="1.0" encoding="UTF-8"?><tv>${xml}</tv>`)
})
