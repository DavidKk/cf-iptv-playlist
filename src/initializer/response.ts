export const CROSS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
}

export const NotFound = (init?: ResponseInit) => {
  return new Response('Not Found', {
    ...init,
    status: 404,
    headers: {
      ...CROSS_HEADERS,
      ...init?.headers,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

export const XML = (content: string, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...CROSS_HEADERS,
      ...init?.headers,
      'Content-Type': 'text/xml; charset=utf-8;',
    },
  })
}

export const TEXT = (content: string, init?: ResponseInit) => {
  return new Response(content, {
    ...init,
    status: 200,
    headers: {
      ...CROSS_HEADERS,
      ...init?.headers,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
