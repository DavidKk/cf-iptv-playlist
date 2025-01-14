import { HIT_CACHE_HEADERS } from '@/constants/header'
import { controller, NotFound, XML } from '@/initializer'
import { fetchAndProcessEPG } from '@/services/epg/fetch'
import { fail } from '@/services/logger'

export default controller(async ({ env }) => {
  const epgUrl = env.EPG_URL
  if (!/https?:\/\//.test(epgUrl)) {
    return NotFound()
  }

  try {
    const { stream, isCache } = await fetchAndProcessEPG(epgUrl)
    return XML(stream, {
      headers: {
        ...(isCache ? HIT_CACHE_HEADERS : {}),
      },
    })
  } catch (error) {
    const reason = error instanceof Error ? error?.message : Object.prototype.toString.call(error)
    fail('fetchAndProcessEPG fail: ' + reason)

    return NotFound()
  }
})
