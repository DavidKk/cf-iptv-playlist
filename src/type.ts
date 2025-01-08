export interface Channels {
  id: number
  name: string
  logo: string
}

export interface EPGTV {
  channel: EPGTVChannel[]
  programme: EPGTVProgramme[]
}

export interface EPGTVChannel {
  $_id: string
  'display-name': string
  icon?: EPGTVIcon
  live?: string
  active?: string
  _originId?: string
}

export interface EPGTVProgramme {
  $_channel: string
  $_start: string
  $_stop: string
  title: EPGTVTitle
  icon?: EPGTVIcon
  credits?: string
  video?: string
  date?: string
}

export interface EPGTVTitle {
  $_lang?: string
  '#text': string
}

export interface EPGTVIcon {
  $_src: string
  $_height?: string
  $_width?: string
}
