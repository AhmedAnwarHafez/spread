import z from 'zod'
import fs from 'node:fs/promises'
import axios from 'axios'
import { extractDates } from './utlis'

const Response = z.object({
  data: z.object({
    repository: z.object({
      refs: z.object({
        nodes: z.array(
          z.object({
            name: z.string(),
            target: z.object({
              history: z.object({
                totalCount: z.number(),
                nodes: z.array(
                  z.object({
                    committedDate: z.string(),
                  })
                ),
              }),
            }),
          })
        ),
      }),
    }),
  }),
})

// extract the inferred type
export type GraphqlResponse = z.infer<typeof Response>

export async function fetchBranches(
  repo: string,
  org: string,
  forkedDate: string,
  bootcampEndDate: string,
  token: string
) {
  const query = `{
    repository(name: "${repo}", owner: "${org}") {
     refs(
      refPrefix: "refs/heads/"
      orderBy: {direction: DESC, field: TAG_COMMIT_DATE}
      first: 100
    ) {
      nodes {
        name
        target {
          ... on Commit {
            history(first: 50, since: "${forkedDate}", until: "${bootcampEndDate}") {
              totalCount
              nodes {
                ... on Commit {
                  message
                  committedDate
                 author {
                  name
                }
                }
              }
            }
          }
        }
      }
    }
  }
  }`

  const res = await axios({
    method: 'POST',
    url: 'https://api.github.com/graphql',
    data: {
      query,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'token ' + token,
    },
  })

  await fs.writeFile('data.json', JSON.stringify(res.data, null, 2), 'utf-8')
  const file = await fs.readFile('data.json', 'utf-8')
  const data = Response.parse(JSON.parse(file))
  return extractDates(data)
}
