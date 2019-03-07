import Ajv, { ValidateFunction } from 'ajv'

export interface JsonValidation {
  validate: ValidateFunction
  tableName: string
  columnName: string
}

export class Validation {
  private readonly ajv = new Ajv({
    allErrors: true,
  })
  public readonly addSchema = (
    tableName: string,
    columnName: string,
    schema: any
  ): JsonValidation => {
    const { ajv } = this
    const key = `${tableName}:${columnName}`
    ajv.addSchema(schema, key)
    return {
      validate: ajv.getSchema(key),
      tableName,
      columnName,
    }
  }
}
