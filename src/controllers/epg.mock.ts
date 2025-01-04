import { controller, XML, NotFound } from '@/initializer'
import data from '@/mockdata/epg'

export default controller(({ env }) => {
  if (env.ENVIRONMENT !== 'development') {
    return NotFound()
  }

  return XML(data)
})
