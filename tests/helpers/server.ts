import express from 'express'
import { Server } from 'http'
import fetch, { RequestInit } from 'node-fetch'
import { config } from './config'

const port = 4455
let server: Server | null = null

const running = () => !!server

export const start = async (dynamicJson: boolean = true) => {
  if (running()) {
    return
  }
  try {
    const app = express()
    app.use(await config.postgraphile(dynamicJson))
    server = app.listen(port)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

export const close = () => {
  if (!!server) {
    server.close()
    server = null
  }
}

const body = (gql: string) =>
  JSON.stringify({
    query: gql,
    variables: null,
  })

export const query = async (gql: string) => {
  const url = `http://runner:${port}/graphql`
  const options: RequestInit = {
    body: body(gql),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }
  const res = await fetch(url, options)
  return res.json()
}
