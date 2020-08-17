class Measure {
  private static beginTime: number
  private static endTime: number
  private static period: number
  private static readonly startMeasurement = (): number => (Measure.beginTime = Date.now())
  private static readonly endMeasurement = (): number => (Measure.endTime = Date.now())
  private static readonly calculateTime = (): number =>
    (Measure.period = Measure.beginTime - Measure.endTime)

  public static readonly test = async (
    label: string,
    fn: () => void | Promise<void>
  ): Promise<void> => {
    Measure.startMeasurement()
    await fn()
    Measure.endMeasurement()
    Measure.calculateTime()

    if (Measure.period > 250) {
      console.warn(`The task ${label} takes ${Measure.period}ms`)
    }
  }
}

export { Measure }
