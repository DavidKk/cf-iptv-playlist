import type { IContext } from '@/initializer'
import { parseM3U, writeM3U, type M3uChannel, type M3uHeaders } from '@iptv/playlist'
import { info, warn } from '@/services/logger'

export function getM3UUrls({ env }: IContext): string[] {
  if (typeof env.M3U_URLS === 'string') {
    return JSON.parse(env.M3U_URLS)
  }

  if (Array.isArray(env.M3U_URLS)) {
    return env.M3U_URLS
  }

  return []
}

export async function loadM3UFiles(...urls: string[]) {
  const promises = urls.map((url) => loadM3UFile(url))
  const response = await Promise.allSettled(promises)
  const channels = Array.from(
    (function* () {
      for (const result of response) {
        if (result.status === 'rejected') {
          warn(`failed to load playlist from "${result.reason}"`)
          continue
        }

        yield* result.value
      }
    })()
  )

  return channels
}

export async function loadM3UFile(url: string) {
  info(`loading playlist from "${url}"`)

  if (!/https?:\/\//.test(url)) {
    throw new Error(`invalid url "${url}"`)
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`failed to load playlist`)
  }

  const content = await response.text()
  info(`loaded playlist from "${url}"`)

  const { channels } = parseM3U(content)
  info(`found ${channels.length} channels`)

  return channels
}

export function stringifyM3U(m3uChannels: M3uChannel[], headers: M3uHeaders = {}): string {
  const channels = m3uChannels.map((channel, index) => {
    if (!channel.tvgId) {
      channel.tvgId = `${index}`.padStart(4, '0')
    }

    return channel
  })

  return writeM3U({ headers, channels })
}
