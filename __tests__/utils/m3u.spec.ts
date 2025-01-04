import { fuzzyMatch } from '@/utils/m3u'

describe('fuzzyMatch', () => {
  it('should return 1 when pattern equals name', () => {
    expect(fuzzyMatch('ChannelName', 'ChannelName')).toBe(1)
  })

  it('should return 2 when name includes pattern', () => {
    expect(fuzzyMatch('Channel', 'ChannelName')).toBe(2)
  })

  it('should return 3 for normalized fuzzy match', () => {
    // Case-insensitive fuzzy match with special characters
    expect(fuzzyMatch('channel', 'Channel-Name')).toBe(3)
    expect(fuzzyMatch('channel', 'Channel_Name')).toBe(3)
    expect(fuzzyMatch('channel', 'Channel_Name name')).toBe(3)
  })

  it('should return 0 when no match', () => {
    expect(fuzzyMatch('Other', 'ChannelName')).toBe(0)
    expect(fuzzyMatch('test', 'ChannelName')).toBe(0)
  })

  it('should handle edge cases', () => {
    // Empty strings
    expect(fuzzyMatch('', '')).toBe(1)
    expect(fuzzyMatch('', 'ChannelName')).toBe(0)
    expect(fuzzyMatch('Channel', '')).toBe(0)

    // Case-insensitivity
    expect(fuzzyMatch('channel', 'CHANNEL')).toBe(1)
    expect(fuzzyMatch('CHANNEL', 'ChannelName')).toBe(3)
  })
})
