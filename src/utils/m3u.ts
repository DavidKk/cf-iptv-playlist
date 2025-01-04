import type { M3uChannel } from '@iptv/playlist'
import type { ChannelMapping, PlaylistMapping } from '@/type'

/** 模糊匹配 channel 名称 */
export function fuzzyMatch(pattern: string, name: string) {
  if (pattern === name) {
    return 1
  }

  if (name.includes(pattern)) {
    return 2
  }

  const normalize = (text: string) => text.toLowerCase().replace(/[\s_-]+/g, '')
  const normalizedPattern = normalize(pattern)
  const regex = new RegExp(normalizedPattern.split('').join('[\\s_-]*'), 'i')
  if (regex.test(name.replace(/[\s_-]/g, ''))) {
    return 3
  }

  return 0
}

/** 将 M3U 映射成 EPG */
export function mappingM3UToEPG(mapping: PlaylistMapping, m3uChannels: M3uChannel[]) {
  const mappingChannel = function* (group: string, mappingChannels: ChannelMapping[]) {
    for (const channel of m3uChannels) {
      let right = 0
      const target = mappingChannels.find(({ name }) => {
        right = fuzzyMatch(name, channel.name!)
        return !!right
      })

      if (!(target && right)) {
        continue
      }

      const tvChannel = {
        ...channel,
        groupTitle: group,
        tvgLogo: target.logo || channel.tvgLogo,
        tvgLanguage: target.language || channel.tvgLanguage,
      } satisfies M3uChannel

      yield { ...tvChannel, right }
    }
  }

  const mappingEPG = function* () {
    for (const { group, channels: mappingChannels } of mapping) {
      const channels = Array.from(mappingChannel(group, mappingChannels))
      if (channels.length === 0) {
        continue
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ right, ...channel }] = channels.sort((a, b) => a.right - b.right)
      yield { ...channel, groupTitle: group }
    }
  }

  return Array.from(mappingEPG())
}
