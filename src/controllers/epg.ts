import { controller, NotFound, TEXT } from '@/initializer'

export default controller(async ({ env }) => {
  if (!/https?:\/\//.test(env.EPG_URL)) {
    return NotFound()
  }

  const response = await fetch(env.EPG_URL)
  const content = await response.text()
  return TEXT(content)
})
