import z from 'zod'
import axios from 'axios'

const Response = z.object({
  data: z.object({
    repository: z.object({
      refs: z.object({
        edges: z.array(
          z.object({
            node: z.object({
              name: z.string(),
              target: z.object({
                history: z.object({
                  edges: z.array(
                    z.object({
                      node: z.object({
                        committedDate: z.string(),
                      }),
                    })
                  ),
                }),
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

export async function fetchDates(
  repo: string,
  org: string,
  token: string
): Promise<GraphqlResponse> {
  const query = `{
    repository(name: "${repo}", owner: "${org}") {
      refs(
        refPrefix: "refs/heads/"
        orderBy: {direction: DESC, field: TAG_COMMIT_DATE}
        first: 100
      ) {
        edges {
          node {
            name
            ... on Ref {
              name
              target {
                ... on Commit {
                  history {
                    edges {
                      node {
                       committedDate
                      }
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

  return Response.parse(res.data)
}
