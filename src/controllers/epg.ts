import { XMLBuilder } from 'fast-xml-parser'
import { controller, NotFound, XML } from '@/initializer'
import { CHANNEL_LIST } from '@/constants/playlist'
import { info } from '@/services/logger'
import { readEPGFromStream } from '@/services/epg'
import { fuzzyMatch } from '@/utils/fuzzyMatch'

const XML_OPEN_CODE = '<?xml version="1.0" encoding="UTF-8"?><tv>'
const XML_CLOSE_CODE = '</tv>'

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

  const promise = (async () => {
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
    return { channels, programmes }
  })()

  // Create a ReadableStream
  const responseStream = new ReadableStream({
    start: (controller) => {
      const buffer = new TextEncoder().encode(XML_OPEN_CODE)
      controller.enqueue(buffer)
    },
    pull: async (controller) => {
      const { channels, programmes } = await promise
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        attributeNamePrefix: '$_',
      })

      const xml = builder.build({ channel: channels, programme: programmes })
      const buffer = new TextEncoder().encode(xml + XML_CLOSE_CODE)
      controller.enqueue(buffer)
      controller.close()
    },
  })

  return XML(responseStream)
})
