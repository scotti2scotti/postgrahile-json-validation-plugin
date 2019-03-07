import { ErrorObject } from 'ajv'
import { Plugin, SchemaBuilder } from 'postgraphile'
import { JsonValidation } from './validation'

const toMessage = (errors: ErrorObject[]) =>
  errors.map(({ dataPath, message }) => `${dataPath.slice(1)} ${message}`).join(', ')

export const JsonValidationPlugin = (validation: JsonValidation): Plugin => (
  builder: SchemaBuilder
) => {
  builder.hook('GraphQLObjectType:fields:field', (field, _, context) => {
    const { tableName, columnName, validate } = validation
    const {
      scope: {
        fieldName,
        isPgCreateMutationField,
        isPgUpdateMutationField,
        pgFieldIntrospection: table,
      },
    } = context
    if (
      !(isPgCreateMutationField || isPgUpdateMutationField) ||
      table.kind !== 'class' ||
      table.name !== tableName
    ) {
      return field
    }
    const mutationFieldName = isPgUpdateMutationField ? `${tableName}Patch` : tableName
    const defaultResolver = (obj: any) => obj[fieldName]
    const { resolve: oldResolve = defaultResolver, ...rest } = field

    return {
      ...rest,
      async resolve(mutation, args, context, info) {
        const json = args.input[mutationFieldName][columnName]
        if (typeof json != 'object') {
          throw new Error(`object required, got ${typeof json}`)
        }
        const ok = validate(json)
        if (ok) {
          return oldResolve(mutation, args, context, info)
        } else {
          throw new Error(toMessage(validate.errors || []))
        }
      },
    }
  })
}
