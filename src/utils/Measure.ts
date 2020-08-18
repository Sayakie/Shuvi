class Measure {
  private static beginTime: number
  private static endTime: number
  private static period: number
  private static readonly startMeasurement = (): number => (Measure.beginTime = Date.now())
  private static readonly endMeasurement = (): number => (Measure.endTime = Date.now())
  private static readonly calculateTime = (): number =>
    (Measure.period = Measure.beginTime - Measure.endTime)

  public static readonly test = async <T>(
    label: string,
    fn: () => T | Promise<T>
  ): Promise<[T, number]> => {
    Measure.startMeasurement()
    const result = await fn()
    Measure.endMeasurement()
    Measure.calculateTime()

    if (Measure.period > 250) {
      console.warn(`The task ${label} takes ${Measure.period}ms`)
    }

    return [result, Measure.period]
  }
}

export { Measure }
