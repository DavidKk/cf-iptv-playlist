export interface ChannelMapping {
  name: string
  descriptions?: string
  logo?: string
  language?: string
}

export interface ChannelGrpupMapping {
  group: string
  channels: ChannelMapping[]
}

export type PlaylistMapping = ChannelGrpupMapping[]
