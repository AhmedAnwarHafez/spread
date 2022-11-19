import { calcCommitDateDiff } from './utlis'

describe('calcCommitDateDiff', () => {
  it('given an empty array, it should return an empty array', () => {
    const dates: string[] = []

    const actual = calcCommitDateDiff(dates)

    expect(actual).toEqual([])
  })

  it('given a single date, it should return [0]', () => {
    const dates: string[] = ['2022-06-01T00:00:00Z']

    const actual = calcCommitDateDiff(dates)

    expect(actual).toEqual([0])
  })

  it('given an array of dates, it should return an array of hours', () => {
    const dates = ['2022-06-01T00:00:00Z', '2022-06-02T00:00:00Z']

    const actual = calcCommitDateDiff(dates)

    expect(actual).toEqual([24])
  })
})
