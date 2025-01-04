import { parseM3U, writeM3U, type M3uChannel, type M3uHeaders, type M3uPlaylist } from '@iptv/playlist'
import { info } from '@/services/logger'
import { USER_AGENT } from '@/constants/playlist'
import { mappingM3UToEPG } from '@/utils/m3u'
import type { PlaylistMapping } from '@/type'

export interface PlaylistOptions {
  xTvgUrl?: string
  urlTvg?: string
  playlistMapping?: PlaylistMapping
}

export class Playlist {
  protected headers: M3uHeaders
  protected channels: M3uChannel[]
  protected playlistMapping?: PlaylistMapping

  constructor(options?: PlaylistOptions) {
    const { xTvgUrl, urlTvg, playlistMapping } = options || {}

    this.headers = {}
    this.channels = []

    xTvgUrl && (this.headers.xTvgUrl = xTvgUrl)
    urlTvg && (this.headers.urlTvg = urlTvg)
    playlistMapping && (this.playlistMapping = playlistMapping)
  }

  public async loadUrls(...urls: string[]) {
    const promises = urls.map((url) => this.load(url))
    await Promise.all(promises)
  }

  public async load(url: string) {
    info(`loading playlist from "${url}"`)

    if (!/https?:\/\//.test(url)) {
      throw new Error(`invalid url "${url}"`)
    }

    const headers = { userAgent: USER_AGENT } satisfies HeadersInit
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`failed to load playlist`)
    }

    const content = await response.text()
    info(`loaded playlist from "${url}"`)

    const { channels } = parseM3U(content)
    info(`found ${channels.length} channels`)

    const nextChannels = this.playlistMapping ? mappingM3UToEPG(this.playlistMapping, channels) : channels
    this.concat(...nextChannels)

    info(`loaded ${nextChannels.length} channels from "${url}"`)
  }

  public toJSON(): M3uPlaylist {
    return {
      headers: this.headers,
      channels: this.channels.map((channel, index) => {
        if (!channel.tvgId) {
          channel.tvgId = `${index}`.padStart(4, '0')
        }

        return channel
      }),
    }
  }

  public toM3U() {
    return writeM3U(this.toJSON())
  }

  protected concat(...channels: M3uChannel[]) {
    const valids = channels.filter(this.check)
    this.channels.push(...valids)
  }

  protected check(channel: M3uChannel) {
    if (!channel.name) {
      return false
    }

    if (!channel.url) {
      return false
    }

    return true
  }
}
