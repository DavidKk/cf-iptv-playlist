import { USER_AGENT } from '@/constants/playlist'
import type { PlaylistMapping } from '@/type'
// import { fuzzyMatch } from '@/utils/m3u'
import type { Node } from 'node-html-parser'
// import { parse } from 'node-html-parser'

export interface ChannelDisplayNode extends Node {
  rawTagName: 'display-name'
  attributes: {
    lang: string
  }
}

export interface ChannelNode extends Node {
  rawTagName: 'channel'
  id: string
  childNodes: ChannelDisplayNode[]
}

export interface TitleNode extends Node {
  rawTagName: 'title'
  attributes: {
    lang: string
  }
}

export interface ProgrammeNode extends Node {
  rawTagName: 'programme'
  childNodes: TitleNode[]
  attributes: {
    channel: string
    start: string
    stop: string
  }
}

export interface TVNode extends Node {
  tagName: 'tv'
  childNodes: (ChannelNode | ProgrammeNode)[]
}

export interface EPGChannelProgrammes {
  title: string
  lang: string
  start: string
  stop: string
}

export interface EPGChannel {
  id: string
  name: string
  lang: string
  programmes: EPGChannelProgrammes[]
}

export interface EpgOptions {
  infoName?: string
  infoUrl?: string
  playlistMapping?: PlaylistMapping
}

export interface EpgInfo {
  name: string
  url: string
}

export class Epg {
  protected info: EpgInfo
  protected channels: EPGChannel[]
  protected playlistMapping?: PlaylistMapping

  constructor(options?: EpgOptions) {
    const { infoName = 'unknown', infoUrl = 'unknown', playlistMapping } = options || {}

    this.info = { name: infoName, url: infoUrl }
    this.channels = []
    this.playlistMapping = playlistMapping
  }

  public async loadUrls(...urls: string[]) {
    const promises = urls.map((url) => this.load(url))
    await Promise.all(promises)
  }

  public async load(url: string) {
    const headers = { userAgent: USER_AGENT } satisfies HeadersInit
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`failed to load epg`)
    }

    const content = await response.text()
    const channels: EPGChannel[] = []
    // const root = parse(content)
    // const [, tv] = root.childNodes as [any, TVNode]

    // const playlist = this.playlistMapping?.flatMap((item) => {
    //   return item.channels.map((channel) => channel.name)
    // })

    // for (const node of tv.childNodes) {
    //   if (node.rawTagName === 'channel') {
    //     const { id, childNodes } = node
    //     if (!playlist?.some((name) => id == name)) {
    //       continue
    //     }

    //     const titleEl = childNodes.find((node) => node.rawTagName === 'display-name')
    //     if (!titleEl) {
    //       continue
    //     }

    //     const { attributes, innerText: name } = titleEl
    //     const { lang } = attributes
    //     channels.push({ id, name, lang, programmes: [] })
    //     continue
    //   }

    //   if (node.rawTagName === 'programme') {
    //     const { attributes, childNodes } = node
    //     const { channel: name, start, stop } = attributes
    //     const channel = channels.find((channel) => channel.name === name)
    //     if (!channel) {
    //       continue
    //     }

    //     const titleEl = childNodes.find((node) => node.rawTagName === 'title')
    //     if (!titleEl) {
    //       continue
    //     }

    //     const { attributes: titleAttrs, innerText: title } = titleEl
    //     const { lang } = titleAttrs
    //     channel.programmes.push({ title, lang, start, stop })
    //     continue
    //   }
    // }

    this.concat(...channels)
  }

  public toEPG() {
    return ''
    // const root = parse(`<?xml version="1.0" encoding="UTF-8"?>`)
    // const nodes = Array.from(
    //   (function* (channels) {
    //     for (const { id, name, lang, programmes } of channels) {
    //       yield `<channel id="${id}"><display-name lang="${lang}">${name}</display-name></channel>`

    //       for (const { title, lang, start, stop } of programmes) {
    //         yield `<programme channel="${id}" start="${start}" stop="${stop}"><title lang="${lang}">${title}</title></programme>`
    //       }
    //     }
    //   })(this.channels)
    // )

    // const { name, url } = this.info
    // root.append(`<tv info-name="${name}" info-url="${url}">${nodes.join('')}</tv>`)
    // return root.outerHTML
  }

  protected concat(...channels: EPGChannel[]) {
    this.channels.push(...channels)
  }
}
