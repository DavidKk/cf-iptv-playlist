import type { M3uChannel } from '@iptv/playlist'
import type { ChannelMapping, PlaylistMapping } from '@/type'

/** 模糊匹配 channel 名称 */
export function fuzzyMatch(pattern: string, name: string) {
  const p = pattern.toLowerCase()
  const n = name.toLowerCase()

  if (pattern === name || p === n) {
    return 1
  }

  if (!(name.length > 0 && pattern.length > 0)) {
    return 0
  }

  if (name.includes(pattern) || p.includes(n)) {
    return 2
  }

  const normalize = (text: string) => {
    const content = text.toLowerCase().replace(/[\s_-]+/g, '(?:\s*?)')
    return new RegExp(`^${content}`, 'im')
  }

  const normalizedPattern = normalize(pattern)
  if (normalizedPattern.test(name)) {
    return 3
  }

  return 0
}

/** 将 M3U 映射成 EPG */
export function mappingM3UToEPG(mapping: PlaylistMapping, m3uChannels: M3uChannel[]) {
  const mappingChannel = function* (group: string, mappingChannels: ChannelMapping[]) {
    for (const channel of m3uChannels) {
      let maxRight = 0
      let maxChannel = null
      for (const mappingItem of mappingChannels) {
        const right = fuzzyMatch(mappingItem.name, channel.name!)
        if (right <= maxRight) {
          continue
        }

        maxChannel = mappingItem
        maxRight = right
      }

      if (!(maxRight > 0 && maxChannel)) {
        continue
      }

      const tvChannel = {
        ...channel,
        groupTitle: group,
        tvgLogo: maxChannel.logo || channel.tvgLogo,
        tvgLanguage: maxChannel.language || channel.tvgLanguage,
      } satisfies M3uChannel

      yield { ...tvChannel }
    }
  }

  const mappingEPG = function* () {
    for (const { group, channels: mappingChannels } of mapping) {
      const channels = Array.from(mappingChannel(group, mappingChannels))
      if (channels.length === 0) {
        continue
      }

      for (const channel of channels) {
        yield { ...channel, groupTitle: group }
      }
    }
  }

  return Array.from(mappingEPG())
}
