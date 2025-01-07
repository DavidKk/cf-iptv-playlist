import { M3U_HEADERS, XML_HEADERS } from "@/constants/header"

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

export const XML = (content: string, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...XML_HEADERS,
      ...init?.headers,
    },
  })
}

export const M3U = (content: string, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...M3U_HEADERS,
      ...init?.headers,
    },
  })
}
