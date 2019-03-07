import * as Mutations from './fixtures/graphql'
import { close, query, start } from './helpers/server'

describe('JsonValidationPlugin', () => {
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
