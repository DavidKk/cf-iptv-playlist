import { M3U_HEADERS, XML_HEADERS, TEXT_HEADERS } from '@/constants/header'

export const NotFound = (init?: ResponseInit) => {
  return new Response('Not Found', {
    ...init,
    status: 404,
    headers: {
      ...M3U_HEADERS,
      ...init?.headers,
    },
  })
}

export const XML = (content: string | ReadableStream, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...XML_HEADERS,
      ...init?.headers,
    },
  })
}

export const M3U = (content: string | ReadableStream, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...M3U_HEADERS,
      ...init?.headers,
    },
  })
}

export const Text = (content: string | ReadableStream, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...TEXT_HEADERS,
      ...init?.headers,
    },
  })
}
