import type { EPGTVChannel, EPGTVProgramme } from '@/type'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

// Constants for XML structure
const XML_OPEN_TAG = '<?xml version="1.0" encoding="UTF-8"?><tv>'
const XML_CLOSE_TAG = '</tv>'
const CHANNEL_OPEN_TAG = '<channel'
const CHANNEL_CLOSE_TAG = '</channel>'
const PROGRAMME_OPEN_TAG = '<programme'
const PROGRAMME_CLOSE_TAG = '</programme>'

// Initialize XML parser and builder with options
const Parser = new XMLParser({
  /** Preserve XML attributes during parsing */
  ignoreAttributes: false,
  /** Prefix to distinguish attributes */
  attributeNamePrefix: '$_',
})

const Builder = new XMLBuilder({
  /** Preserve XML attributes during XML building */
  ignoreAttributes: false,
  /** Format output XML for readability */
  format: true,
  /** Prefix to distinguish attributes */
  attributeNamePrefix: '$_',
})

/** Options for configuring the EPG stream processing */
export interface PipeEPGStreamOptions extends ExtractTagsOptions {
  /** Function to filter channels */
  filterChannels?: (channel: EPGTVChannel) => boolean
  /** Function to transform channel IDs */
  tranformOriginChannelId?: (channel: EPGTVChannel) => string
  /** Callback for when the stream closes */
  onClose?: () => void
}

// Processes an EPG XML stream, filtering and transforming channels/programmes
export function pipeEPGStream(stream: ReadableStream, options?: PipeEPGStreamOptions) {
  const { filterChannels, tranformOriginChannelId, onClose } = options || {}

  /** Buffer to store incoming XML chunks */
  let xmlBuffer = ''

  /** Map to track unique channel IDs */
  const channelIds = new Map<string, string>()

  /** Function to process XML stream chunks */
  const pull = transformEPGStream(
    stream,
    (chunk, push: (content: string) => void) => {
      // Accumulate chunks and remove line breaks
      xmlBuffer += chunk.replaceAll('\n', '')

      // Extract <channel> elements and process them
      const channels = extractChannels(xmlBuffer, {
        handleMatch(remainder) {
          // Remove processed channel blocks
          xmlBuffer = xmlBuffer.replaceAll(remainder, '')
        },
      })

      if (channels) {
        const filteredChannels: EPGTVChannel[] = []
        for (const channel of channels) {
          if (filterChannels && !filterChannels(channel)) {
            // Skip filtered channels
            continue
          }

          const channelId = channel.$_id
          const originId = tranformOriginChannelId ? tranformOriginChannelId(channel) : channelId
          if (channelIds.has(originId)) {
            // Avoid duplicate IDs
            continue
          }

          filteredChannels.push(channel)
          // Map original to transformed ID
          originId && channelIds.set(originId, channelId)
        }

        // Build XML for filtered channels
        push(Builder.build({ channel: filteredChannels }))
      }

      // Extract and process <programme> elements
      const programmes = extractProgrammes(xmlBuffer, {
        handleMatch(remainder) {
          // Remove processed programme blocks
          xmlBuffer = xmlBuffer.replaceAll(remainder, '')
        },
      })

      if (programmes) {
        const originIds = Array.from(channelIds.entries())

        const filteredProgrammes: EPGTVProgramme[] = []
        for (const programme of programmes) {
          const originId = programme.$_channel
          if (!originId) continue

          const target = originIds.find(([id]) => id === originId)
          if (!target) continue

          const [, channelId] = target
          // Replace channel ID with transformed ID
          programme.$_channel = channelId
          filteredProgrammes.push(programme)
        }

        // Build XML for filtered programmes
        push(Builder.build({ programme: filteredProgrammes }))
      }

      // Trim processed data from the buffer
      const lastChannelCloseIndex = xmlBuffer.lastIndexOf(CHANNEL_CLOSE_TAG)
      if (lastChannelCloseIndex !== -1) {
        xmlBuffer = xmlBuffer.slice(lastChannelCloseIndex + CHANNEL_CLOSE_TAG.length).trim()
      }

      const lastProgrammeCloseIndex = xmlBuffer.lastIndexOf(PROGRAMME_CLOSE_TAG)
      if (lastProgrammeCloseIndex !== -1) {
        xmlBuffer = xmlBuffer.slice(lastProgrammeCloseIndex + PROGRAMME_CLOSE_TAG.length).trim()
      }
    },
    { onClose }
  )

  return new ReadableStream({ pull })
}

// Options for stream transformation
interface TransformEPGStreamOptions {
  /** Callback for when the stream is closed */
  onClose?: () => void
}

// Transforms an EPG XML stream, calling `handle` for each chunk
function transformEPGStream(stream: ReadableStream, handle: (part: string, push: (content: string) => void) => void, options?: TransformEPGStreamOptions) {
  const { onClose } = options || {}

  const reader = stream.getReader()
  return async (controller: ReadableStreamDefaultController<Uint8Array>) => {
    const startBuffer = new TextEncoder().encode(XML_OPEN_TAG)
    controller.enqueue(startBuffer) // Enqueue opening XML tag

    while (true) {
      const { done, value } = await reader.read()
      if (done) break // End loop if stream is finished

      const chunk = new TextDecoder().decode(value)
      handle(chunk, (content) => {
        if (typeof content !== 'string') return

        const buffer = new TextEncoder().encode(content)
        controller.enqueue(buffer) // Enqueue processed XML
      })
    }

    const endBuffer = new TextEncoder().encode(XML_CLOSE_TAG)
    controller.enqueue(endBuffer) // Enqueue closing XML tag
    controller.close()

    if (onClose) onClose() // Trigger onClose callback
  }
}

// Extracts <programme> tags from XML content
function extractProgrammes(content: string, options?: ExtractTagsOptions) {
  const lastProgrammeCloseIndex = content.lastIndexOf(PROGRAMME_CLOSE_TAG)
  if (lastProgrammeCloseIndex === -1) {
    // No complete programme data
    return
  }

  const firstProgrammeOpenIndex = content.indexOf(PROGRAMME_OPEN_TAG)
  if (firstProgrammeOpenIndex === -1) {
    // No programme start tag
    return
  }

  const completeProgrammeBlock = content.slice(firstProgrammeOpenIndex, lastProgrammeCloseIndex + PROGRAMME_CLOSE_TAG.length)
  if (!completeProgrammeBlock) {
    return
  }

  const programmeXML = extractTags(completeProgrammeBlock, PROGRAMME_OPEN_TAG, PROGRAMME_CLOSE_TAG, options)
  if (!programmeXML) {
    return
  }

  const parsedProgrammeData: { programme: EPGTVProgramme | EPGTVProgramme[] } = Parser.parse(programmeXML)
  let programmes = parsedProgrammeData?.programme || []
  if (!Array.isArray(programmes)) {
    programmes = [programmes]
  }

  return programmes
}

// Extracts <channel> tags from XML content
function extractChannels(content: string, options?: ExtractTagsOptions) {
  const lastChannelCloseIndex = content.lastIndexOf(CHANNEL_CLOSE_TAG)
  if (lastChannelCloseIndex === -1) {
    // No complete channel data
    return
  }

  const firstChannelOpenIndex = content.indexOf(CHANNEL_OPEN_TAG)
  if (firstChannelOpenIndex === -1) {
    // No channel start tag
    return
  }

  const completeChannelBlock = content.slice(firstChannelOpenIndex, lastChannelCloseIndex + CHANNEL_CLOSE_TAG.length)
  if (!completeChannelBlock) {
    return
  }

  const channelXML = extractTags(completeChannelBlock, CHANNEL_OPEN_TAG, CHANNEL_CLOSE_TAG, options)
  if (!channelXML) {
    return
  }

  const parsedChannelData: { channel: EPGTVChannel | EPGTVChannel[] } = Parser.parse(channelXML)
  let channels = parsedChannelData?.channel || []
  if (!Array.isArray(channels)) {
    channels = [channels]
  }

  return channels
}

/** Options for extracting tags */
interface ExtractTagsOptions {
  /** Callback for each matched tag */
  handleMatch?: (match: string) => void
  /** Callback for leftover content */
  handleRemainder?: (remainder: string) => void
}

/** Extracts XML tags and their content from a string */
function extractTags(content: string, openTag: string, closeTag: string, options?: ExtractTagsOptions) {
  const { handleMatch, handleRemainder } = options || {}
  const tagSections = content.split(openTag)

  let extractedXML = ''

  for (const section of tagSections) {
    const [tagContent, leftoverContent] = section.split(closeTag)
    if (!tagContent.trim()) continue // Skip empty sections

    const fullTag = `${openTag}${tagContent}${closeTag}`
    extractedXML += fullTag

    if (handleMatch) handleMatch(fullTag)
    if (handleRemainder && leftoverContent) handleRemainder(leftoverContent)
  }

  return extractedXML
}
