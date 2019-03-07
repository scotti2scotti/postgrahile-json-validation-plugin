# PostGraphile Json Validation Plugin

[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/package/postgraphile-json-validation-plugin)
![MIT license](https://img.shields.io/npm/l/postgraphile-json-validation-plugin.svg)

## Minimal Json Validation plugin for [PostGraphile](https://github.com/graphile/postgraphile)

Use [JSON Schema](https://json-schema.org) to validate CRUD operations on JSON/JSONB columns.

### Usage

```shell
npm install postgraphile-json-validation-plugin
```

Having this table definition:

```sql
CREATE TABLE public.document (
  id SERIAL PRIMARY KEY,
  meta JSONB NOT NULL
);
```

and this schema:

```javascript
{
  $id: 'http://example.s2s.com/foobar',
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  }
}
```

then you could use the plugin as follows:

```typescript
import { Pool } from 'pg'
import { postgraphile, HttpRequestHandler } from 'postgraphile'
import { JsonValidationPlugin, Validation } from 'postgraphile-json-validation-plugin'

const middleware = (pool: Pool): HttpRequestHandler => {
  const validation = new Validation()
  const validate = validation.addSchema('document', 'meta', metaSchema)
  const plugin = JsonValidationPlugin(validate)
  return postgraphile(pool, 'public', {
    appendPlugins: [plugin],
    dynamicJson: true,
  })
}
```

Then This create mutation:

```javascript
mutation {
  createDocument(input: {document: {id: 1, meta: {foo: "1", bar: 1}}}) {
    document {
      id
      meta
    }
  }
}
```

will fail with

```json
{
  "errors": [
    {
      "message": "foo should be integer, bar should be string",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createDocument"]
    }
  ],
  "data": {
    "createDocument": null
  }
}
```

But this one

```javascript
mutation {
  createDocument(input: {document: {id: 1, meta: {foo: 1, bar: "1"}}}) {
    document {
      id
      meta
    }
  }
}
```

will succeed with

```json
{
  "data": {
    "createDocument": {
      "document": {
        "id": 1,
        "meta": {
          "bar": "1",
          "foo": 1
        }
      }
    }
  }
}
```

## Requirements

https://github.com/graphile/postgraphile#requirements

## Thanks

[Benjie Gillam](https://github.com/benjie) for his awesome job.
