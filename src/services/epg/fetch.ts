import { fail, info } from '@/services/logger'
import { fuzzyMatch } from '@/utils/fuzzyMatch'
import { CHANNEL_LIST } from '@/constants/playlist'
import { getChannelName } from '@/type'
import { pipeEPGStream } from './process'
import { StreamCacheManager } from './StreamCacheManager'

const StreamCache = new StreamCacheManager()

export interface FetchAndProcessEPGOptions {
  signal?: AbortSignal
}

export async function fetchAndProcessEPG(epgUrl: string, options?: FetchAndProcessEPGOptions) {
  if (StreamCache.has(epgUrl)) {
    info(`epg cache hit ${epgUrl}`)

    const stream = StreamCache.load(epgUrl)!
    return { stream, isCache: true }
  }

  const cachedChunks: Uint8Array[] = []
  const { readable, writable } = new TransformStream<Uint8Array>()

  const cachingStream = new ReadableStream({
    start(controller) {
      const reader = readable.getReader()
      async function read() {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }

            cachedChunks.push(value!)
            controller.enqueue(value)
          }

          controller.close()
        } catch (err) {
          controller.error(err)
        }
      }

      read()
    },
  })

  StreamCache.save(epgUrl, { cachedChunks, isComplete: false })

  info(`epg urls ${epgUrl}`)

  const { signal } = options || {}
  const epgResponse = await fetch(epgUrl, { signal })
  const epgStream = epgResponse.body
  if (!epgStream) {
    throw new Error('No stream available')
  }

  const responseStream = pipeEPGStream(epgStream, {
    signal,
    filterChannels(channel) {
      const name = getChannelName(channel)
      const index = CHANNEL_LIST.findIndex((item) => fuzzyMatch(item.name, name))

      if (index === -1) {
        return false
      }

      const target = CHANNEL_LIST[index]
      channel.icon = { $_src: target.logo }
      channel._originId = channel.$_id
      channel.$_id = `${target.id}`.padStart(4, '0')

      return true
    },
    tranformOriginChannelId(channel) {
      return channel._originId || channel.$_id
    },
  })

  responseStream.pipeTo(writable).then(
    () => {
      StreamCache.complete(epgUrl)
    },
    (error) => {
      const reason = error instanceof Error ? error?.message : Object.prototype.toString.call(error)
      fail(`Error processing stream ${reason}`)

      StreamCache.remove(epgUrl)
    }
  )

  return { stream: cachingStream, isCache: false }
}
