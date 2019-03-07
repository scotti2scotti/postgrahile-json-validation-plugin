import * as Mutations from './fixtures/graphql'
import { close, query, start } from './helpers/server'

describe('With dynamicJson', () => {
  beforeAll(async done => {
    await start()
    done()
  })
  afterAll(done => {
    close()
    done()
  })

  Object.entries(Mutations).forEach(([name, code]) => {
    test(name, async () => {
      expect.assertions(1)
      const result = await query(code)
      expect(result).toMatchSnapshot()
    })
  })
})

describe('Without dynamicJson', () => {
  beforeAll(async done => {
    await start(false)
    done()
  })
  afterAll(done => {
    close()
    done()
  })

  Object.entries(Mutations).forEach(([name, code]) => {
    test(name, async () => {
      expect.assertions(2)
      const result = await query(code)
      expect(result.errors).toBeDefined()
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})
