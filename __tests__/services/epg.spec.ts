import { readEPGFromStream } from '@/services/epg'

const EPG_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<tv generator-info-name="Threadfin" source-info-name="Threadfin - 1.2.23">
  <programme channel="1030" start="20250107040000 +0800" stop="20250107044000 +0800">
    <title lang="zh">纪录中国故事</title>
    <icon height="" src="https://live.fanmingming.com/tv/广西卫视.png" width=""></icon>
    <credits></credits>
    <video></video>
    <date></date>
  </programme>
  <channel id="1030">
    <display-name>广西卫视</display-name>
    <icon src="https://live.fanmingming.com/tv/广西卫视.png"></icon>
    <live>false</live>
    <active>true</active>
  </channel>
  <programme channel="1030" start="20250107003000 +0800" stop="20250107013000 +0800">
      <title lang="zh">传奇剧场39集：密查(10)</title>
      <icon height="" src="https://live.fanmingming.com/tv/广西卫视.png" width=""></icon>
      <credits></credits>
      <video></video>
      <date></date>
  </programme>
  <programme channel="1030" start="20250107013000 +0800" stop="20250107020000 +0800">
    <title lang="zh">重播:遇见好书</title>
    <icon height="" src="https://live.fanmingming.com/tv/广西卫视.png" width=""></icon>
    <credits></credits>
    <video></video>
    <date></date>
  </programme>
  <channel id="1000">
    <display-name>[BAK]翡翠台</display-name>
    <icon src="https://s2.loli.net/2024/12/22/gWrIwCqpHTAtuXZ.png"></icon>
    <live>false</live>
    <active>true</active>
  </channel>
  <programme channel="1000" start="20250107000000 +0800" stop="20250107010000 +0800">
    <title lang="zh">宣傳易[粵]</title>
    <icon height="" src="https://s2.loli.net/2024/12/22/gWrIwCqpHTAtuXZ.png" width=""></icon>
    <credits></credits>
    <video></video>
    <date></date>
  </programme>
  <programme channel="1000" start="20250107010000 +0800" stop="20250107013000 +0800">
    <title lang="zh">東張西望[粵]</title>
    <icon height="" src="https://s2.loli.net/2024/12/22/gWrIwCqpHTAtuXZ.png" width=""></icon>
    <credits></credits>
    <video></video>
    <date></date>
  </programme>
</tv>
`

describe('readEPGFromStream', () => {
  describe('normal test', () => {
    it('should parse EPG stream correctly', async () => {
      const stream = stringToChunkedReadableStream(EPG_CONTENT)
      const { channels, programmes } = await readEPGFromStream(stream)
      expect(channels.length).toBe(2)
      expect(channels[0].$_id).toBe('1030')
      expect(channels[1].$_id).toBe('1000')

      expect(programmes.length).toBe(5)
      expect(programmes.filter((p) => p.$_channel === '1000').length).toBe(2)
      expect(programmes.filter((p) => p.$_channel === '1030').length).toBe(3)
    })

    it('should parse EPG stream with multiple channels and programmes correctly', async () => {
      const xml = '<tv><channel id="1030"></channel></tv>'
      const stream = stringToChunkedReadableStream(xml)
      const { channels } = await readEPGFromStream(stream)
      expect(channels.length).toBe(1)
      expect(channels[0].$_id).toBe('1030')
    })

    it('should filter out inactive channels', async () => {
      const xml = '<tv><channel id="1030"><active>false</active></channel></tv>'
      const stream = stringToChunkedReadableStream(xml)
      const { channels } = await readEPGFromStream(stream, {
        filterChannels: (channel) => channel.active === 'true',
      })

      expect(channels.length).toBe(0)
    })
  })

  describe('boundary test', () => {
    it('should handle empty EPG stream', async () => {
      const stream = stringToChunkedReadableStream('')
      const { channels } = await readEPGFromStream(stream)
      expect(channels.length).toBe(0)
    })

    it('should handle invalid EPG stream', async () => {
      const stream = stringToChunkedReadableStream('invalid xml')
      const { channels } = await readEPGFromStream(stream)
      expect(channels.length).toBe(0)
    })

    it('should handle EPG stream with missing elements', async () => {
      const stream = stringToChunkedReadableStream('<tv></tv>')
      const { channels } = await readEPGFromStream(stream)
      expect(channels.length).toBe(0)
    })

    it('should handle EPG stream with missing channel elements', async () => {
      const stream = stringToChunkedReadableStream('<tv><programme></programme></tv>')
      const { channels } = await readEPGFromStream(stream)
      expect(channels.length).toBe(0)
    })
  })
})

function stringToChunkedReadableStream(content: string, chunkSize = content.length) {
  let position = 0

  return new ReadableStream({
    start(controller) {
      function pushChunk() {
        if (position < content.length) {
          const chunk = content.slice(position, position + chunkSize)
          controller.enqueue(new TextEncoder().encode(chunk))
          position += chunkSize
          setTimeout(pushChunk, 100)
        } else {
          controller.close()
        }
      }

      pushChunk()
    },
  })
}
