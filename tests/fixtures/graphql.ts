export const CreateSingleInvalid = `
mutation {
  createDocument(input: {document: {id: 1, meta: {foo: 1, bar: 1}}}) {
    document {
      id
      meta
    }
  }
}
`

export const CreateMultipleInvalid = `
mutation {
  createDocument(input: {document: {id: 1, meta: {foo: "1", bar: 1}}}) {
    document {
      id
      meta
    }
  }
}
`

export const CreateValid = `
mutation {
  createDocument(input: {document: {meta: {foo: 1, bar: "1"}}}) {
    document {
      id
      meta
    }
  }
}
`

export const UpdateInvalid = `
mutation {
  updateDocumentById(
    input: {
      id: 1
      documentPatch: { meta: { foo: "1", bar: 2 } }
    }
  ) {
    document {
      id
      meta
    }
  }
}
`

export const UpdateValid = `
mutation {
  updateDocumentById(
    input: {
      id: 1
      documentPatch: { meta: { foo: 1, bar: "2" } }
    }
  ) {
    document {
      id
      meta
    }
  }
}
`
