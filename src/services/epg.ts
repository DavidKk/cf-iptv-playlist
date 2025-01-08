import type { EPGTVChannel, EPGTVProgramme } from '@/type'
import { XMLParser } from 'fast-xml-parser'

const CHANNEL_OPEN_TAG = '<channel'
const CHANNEL_CLOSE_TAG = '</channel>'
const PROGRAMME_OPEN_TAG = '<programme'
const PROGRAMME_CLOSE_TAG = '</programme>'

export interface ReadEPGFromStreamOptions {
  /** Filter channels to include in the result */
  filterChannels?: (channel: EPGTVChannel) => boolean
  /** Transform channel ID to a different format */
  tranformChannelId?: (channel: EPGTVChannel) => string
}

/**
 * Parses an EPG XML stream and extracts channels and their programmes.
 * @param stream - The readable stream containing EPG XML data.
 * @param options - Options to customize parsing behavior.
 */
export async function readEPGFromStream(stream: ReadableStream<Uint8Array>, options?: ReadEPGFromStreamOptions) {
  const { filterChannels, tranformChannelId } = options || {}
  const reader = stream.getReader()

  const channels: EPGTVChannel[] = []
  const programmes: EPGTVProgramme[] = []

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '$_',
  })

  /** Buffer to hold the unprocessed fragment */
  let xmlBuffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    const chunk = new TextDecoder().decode(value)
    xmlBuffer += chunk

    // Find the last complete </channel> tag
    const lastChannelCloseIndex = xmlBuffer.lastIndexOf(CHANNEL_CLOSE_TAG)
    if (lastChannelCloseIndex === -1) {
      // No complete channel data yet
      continue
    }

    // Find the first <channel> tag in the buffer
    const firstChannelOpenIndex = xmlBuffer.indexOf(CHANNEL_OPEN_TAG)
    if (firstChannelOpenIndex === -1) {
      // No channel start tag found
      continue
    }

    // Extract the complete <channel>...</channel> block
    const completeChannelBlock = xmlBuffer.slice(firstChannelOpenIndex, lastChannelCloseIndex + CHANNEL_CLOSE_TAG.length)

    // Extract <channel> elements from the block
    const channelXML = extractTags(completeChannelBlock, CHANNEL_OPEN_TAG, CHANNEL_CLOSE_TAG, {
      handleMatch(remainder) {
        // Remove processed channel block from the xmlBuffer
        xmlBuffer = xmlBuffer.replaceAll(remainder, '')
      },
    })

    const parsedChannelData: { channel: EPGTVChannel | EPGTVChannel[] } = parser.parse(channelXML)
    let channelGroup = parsedChannelData?.channel || []
    if (!Array.isArray(channelGroup)) {
      channelGroup = [channelGroup]
    }

    if (typeof filterChannels === 'function') {
      const filtered = channelGroup.filter((channel) => filterChannels(channel))
      channels.push(...filtered)
    } else {
      channels.push(...channelGroup)
    }
  }

  // Process programmes for the extracted channels
  let remainingProgrammes = xmlBuffer
  const channelIds = typeof tranformChannelId === 'function' ? channels.map(tranformChannelId) : channels.map((channel) => channel.$_id)
  for (const channelId of channelIds) {
    let programmeContent = ''
    while (true) {
      const channelToken = `channel="${channelId}"`
      const openProgrammeIndex = remainingProgrammes.indexOf(channelToken)
      if (openProgrammeIndex === -1) {
        break
      }

      const beforeTokenContent = remainingProgrammes.slice(0, openProgrammeIndex)
      const openIndex = beforeTokenContent.lastIndexOf(PROGRAMME_OPEN_TAG)
      if (openIndex === -1) {
        break
      }

      const afterTokenContent = remainingProgrammes.slice(openProgrammeIndex)
      const closeProgrammeIndex = afterTokenContent.indexOf(PROGRAMME_CLOSE_TAG)
      if (closeProgrammeIndex === -1) {
        break
      }

      const programmeBlock = remainingProgrammes.slice(openIndex, openProgrammeIndex + closeProgrammeIndex + PROGRAMME_CLOSE_TAG.length)
      programmeContent += programmeBlock

      remainingProgrammes = remainingProgrammes.replace(programmeBlock, '')
    }

    const parsedProgrammeData: { programme: EPGTVProgramme | EPGTVProgramme[] } = parser.parse(programmeContent)
    let programmeGroup = parsedProgrammeData?.programme || []
    if (!programmeGroup) {
      continue
    }

    if (!Array.isArray(programmeGroup)) {
      programmeGroup = [programmeGroup]
    }

    programmes.push(...programmeGroup)
  }

  return { channels, programmes }
}

interface ExtractTagsOptions {
  handleMatch?: (match: string) => void
  handleRemainder?: (remainder: string) => void
}

/**
 * Extracts XML tags and their content from a string.
 * @param content - The input string to process.
 * @param openTag - The opening tag (e.g., '<channel').
 * @param closeTag - The closing tag (e.g., '</channel>').
 * @param options - Callbacks to handle matches and leftover content.
 * @returns Extracted tags with their content.
 */
function extractTags(content: string, openTag: string, closeTag: string, options?: ExtractTagsOptions) {
  const { handleMatch, handleRemainder } = options || {}
  const tagSections = content.split(openTag)

  let extractedXML = ''

  for (const section of tagSections) {
    const [tagContent, leftoverContent] = section.split(closeTag)
    if (!tagContent.trim()) {
      continue
    }

    const fullTag = `${openTag}${tagContent}${closeTag}`
    extractedXML += fullTag

    if (typeof handleMatch === 'function') {
      handleMatch(fullTag)
    }

    if (handleRemainder && leftoverContent) {
      // Pass leftover content to the callback
      handleRemainder(leftoverContent)
    }
  }

  return extractedXML
}
