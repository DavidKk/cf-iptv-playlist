import { controller, TEXT, NotFound } from '@/initializer'
import data from '@/mockdata/m3u'

export default controller(({ env }) => {
  if (env.ENVIRONMENT !== 'development') {
    return NotFound()
  }

  return TEXT(data)
})
