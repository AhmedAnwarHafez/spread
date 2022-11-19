import moment from 'moment'
import std from 'just-standard-deviation'

import { GraphqlResponse } from './api'

export function extractDates(data: GraphqlResponse) {
  return data.data.repository.refs.nodes.flatMap((branch) => ({
    branch: branch.name,
    totalCount: branch.target.history.totalCount,
    committedDates: branch.target.history.nodes.map(
      (edge) => edge.committedDate
    ),
  }))
}

export function calcStd(xs: number[]): number {
  if (xs.length === 0 || xs.length === 1) {
    return 0
  }
  return std(xs)
}

export function calcCommitDateDiff(dates: string[]) {
  if (dates.length === 1) {
    return [0]
  }
  return dates.slice(1).map((_, i) =>
    moment(dates[i])
      .diff(moment(dates[i + 1]), 'hour')
      .valueOf()
  )
}
