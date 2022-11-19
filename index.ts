import { fetchBranches } from './api'
import { calcStd, calcCommitDateDiff } from './utlis'
import dotenv from 'dotenv'

dotenv.config()

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string
    }
  }
}

async function main() {
  const token = process.env.TOKEN
  const data = await fetchBranches(
    'worldwide-routing',
    'kahikatea-2022',
    '2022-04-05T23:52:50Z',
    '2022-05-11T23:52:50Z',
    token
  )

  const result = data.map((branch) => {
    const durations = calcCommitDateDiff(branch.committedDates)
    if (durations.length <= 1) {
      return {
        branch: branch.branch,
        totalCount: branch.branch.length,
        commitDurations: [],
        std: 0,
        mean: 0,
      }
    }
    return {
      branch: branch.branch,
      totalCount: branch.totalCount,
      commitDurations: durations,
      std: calcStd(durations),
      mean: durations.reduce((avg, val) => avg + val, 0) / durations.length,
    }
  })
  console.log(JSON.stringify(result, null, 2))
}

main()
