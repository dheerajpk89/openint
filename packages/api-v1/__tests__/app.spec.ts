import {applyLinks, logLink} from '@opensdks/fetch-links'
import {createTRPCClient, httpLink} from '@trpc/client'
import createClient, {wrapAsPathBasedClient} from 'openapi-fetch'
import {initDbPGLite} from '@openint/db/db.pglite'
import {loopbackLink} from '@openint/loopback-link'
import type {paths} from '../__generated__/openapi.types'
import {createApp} from '../app'
import {createFetchHandlerOpenAPI, createFetchHandlerTRPC} from '../handlers'
import type {AppRouter} from '../routers'

const db = initDbPGLite()
const app = createApp({db})

// Important to ensure we always close the database otherwise jest flakiness can cause test failures...
afterAll(async () => {
  await db.$end()
})

describe('elysia', () => {
  test('GET /health', async () => {
    const res = await app.handle(new Request('http://localhost/health'))
    expect(await res.json()).toBeTruthy()
  })

  test('GET /health with loopback link', async () => {
    const handler = (req: Request) =>
      applyLinks(req, [loopbackLink(), app.handle])
    const res = await handler(new Request('http://localhost/health'))
    expect(await res.json()).toBeTruthy()
  })

  test('POST /health', async () => {
    const res = await app.handle(
      new Request('http://localhost/health', {
        method: 'POST',
        body: JSON.stringify({foo: 'bar'}),
        headers: {'Content-Type': 'application/json'},
      }),
    )

    expect(await res.json()).toMatchObject({body: {foo: 'bar'}})
  })
})

describe('openapi route', () => {
  test('GET /health', async () => {
    const res = await app.handle(new Request('http://localhost/v1/health'))
    expect(await res.json()).toMatchObject({ok: true})
  })

  test('POST /health', async () => {
    const res = await app.handle(
      new Request('http://localhost/v1/health', {
        method: 'POST',
        body: JSON.stringify({foo: 'bar'}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    expect(res.ok).toBe(true)
    expect(await res.json()).toMatchObject({input: {foo: 'bar'}})
  })

  test('healthcheck bypass elysia', async () => {
    const handler = createFetchHandlerOpenAPI({endpoint: '/v1', db})
    const res = await handler(new Request('http://localhost/v1/health'))
    expect(await res.json()).toMatchObject({ok: true})
  })

  test('POST healthcheck bypass elysia', async () => {
    const handler = createFetchHandlerOpenAPI({endpoint: '/v1', db})
    const res = await handler(
      new Request('http://localhost/v1/health', {
        method: 'POST',
        body: JSON.stringify({foo: 'bar'}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    expect(await res.json()).toMatchObject({input: {foo: 'bar'}})
  })

  // AP Note: These endpoints exist but will be removed from the published
  // openapi.json to avoid confusion in the documentation
  test('with OpenAPI client', async () => {
    const openapiClient = createClient<paths>({
      baseUrl: 'http://localhost/v1',
      fetch: app.handle,
    })

    const res = await openapiClient.GET('/health')
    expect(res.data).toBeTruthy()

    const pathBasedClient = wrapAsPathBasedClient(openapiClient)
    const res2 = await pathBasedClient['/health'].GET()
    expect(res2.data).toBeTruthy()
  })

  test('with OpenAPI client with links', async () => {
    const openapiClient = createClient<paths>({
      baseUrl: 'http://localhost/v1',
      fetch: (req) => applyLinks(req, [logLink(), app.handle]),
    })
    const res = await openapiClient.GET('/health')
    expect(res.data).toBeTruthy()
  })
})

describe('trpc route', () => {
  test('query health', async () => {
    const res = await app.handle(new Request('http://localhost/v1/trpc/health'))
    expect(await res.json()).toMatchObject({result: {data: {ok: true}}})
  })

  test('mutation health', async () => {
    const res = await app.handle(
      new Request('http://localhost/v1/trpc/healthEcho', {
        method: 'POST',
        body: JSON.stringify({foo: 'bar'}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    expect(await res.json()).toMatchObject({
      result: {data: {input: {foo: 'bar'}}},
    })
  })

  test('query health bypass elysia', async () => {
    const handler = createFetchHandlerTRPC({endpoint: '/v1/trpc', db})
    const res = await handler(new Request('http://localhost/v1/trpc/health'))
    expect(await res.json()).toMatchObject({result: {data: {ok: true}}})
  })

  test('with TRPCClient', async () => {
    const client = createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: 'http://localhost/v1/trpc',
          fetch: (input, init) => app.handle(new Request(input, init)),
        }),
      ],
    })
    const res = await client.health.query()
    expect(res).toEqual({ok: true})
  })
})
