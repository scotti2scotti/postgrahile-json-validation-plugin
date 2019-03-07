import { Pool, PoolConfig } from 'pg'
import { postgraphile } from 'postgraphile'
import { JsonValidationPlugin, Validation } from '../../src/index'

const metaSchema = {
  $id: 'http://example.s2s.com/foobar',
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
}

const dbSchema = 'plugin'

const sql = `
DROP SCHEMA IF EXISTS t CASCADE;
CREATE SCHEMA ${dbSchema};
CREATE TABLE ${dbSchema}.document (
  id SERIAL PRIMARY KEY,
  meta JSONB NOT NULL
);
`

const poolOptions: PoolConfig = {
  host: 'db',
  port: 5432,
  user: 'plugin',
  database: 'plugin',
}

class Config {
  private pool: Pool

  public readonly postgraphile = async () => {
    await this.setUpPool()
    const validation = new Validation()
    const validate = validation.addSchema('document', 'meta', metaSchema)
    const plugin = JsonValidationPlugin(validate)
    return postgraphile(this.pool, dbSchema, {
      appendPlugins: [plugin],
      dynamicJson: true,
      graphiql: true,
      disableQueryLog: true,
    })
  }

  private readonly setUpPool = async () => {
    if (this.pool) {
      return
    }
    this.pool = new Pool(poolOptions)
    await this.pool.query(sql)
    return this.pool
  }
}

export const config = new Config()
