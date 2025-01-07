import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { controller, NotFound, XML } from '@/initializer'
import { CHANNEL_LIST } from '@/constants/playlist'
import { info } from '@/services/logger'
import { fuzzyMatch } from '@/utils/fuzzyMatch'
import type { EPGTV } from '@/type'

export default controller(async ({ env }) => {
  if (!/https?:\/\//.test(env.EPG_URL)) {
    return NotFound()
  }

  const response = await fetch(env.EPG_URL)
  const content = await response.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '$_',
  })

  const xmlDoc: { tv: EPGTV } = parser.parse(content)
  const { channel: channels, programme: programmes } = xmlDoc.tv

  info(`fetch ${channels.length} channels and ${programmes.length} programmes`)

  const filteredChannels = Array.from(
    (function* () {
      for (const channel of channels) {
        const channelName = channel['display-name']
        for (const { id: tvgId, name: tvgName, logo } of CHANNEL_LIST) {
          const familiar = fuzzyMatch(tvgName, channelName)
          if (!familiar) {
            continue
          }

          const $_id = `${tvgId}`.padStart(4, '0')
          const icon = { $_src: logo }
          const originId = channel.$_id
          yield { ...channel, $_id, icon, originId, 'display-name': tvgName }
        }
      }
    })()
  )

  const filteredProgrammes = Array.from(
    (function* () {
      for (const programme of programmes) {
        const channelId = programme.$_channel
        const channel = filteredChannels.find(({ originId }) => originId === channelId)
        if (!channel) {
          continue
        }

        const icon = channel.icon
        yield { ...programme, icon }
      }
    })()
  )

  const result = {
    ...xmlDoc,
    tv: {
      ...xmlDoc.tv,
      channel: filteredChannels,
      programme: filteredProgrammes,
    },
  }

  info(`the remaining ${filteredChannels} channels and ${programmes.length} programmes`)

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: '$_',
  })

  const xmlData = builder.build(result)
  return XML(xmlData)
})
