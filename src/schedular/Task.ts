export class Task {
  /**
   * Sets the interval between repetitions of the task. The task will not
   * repeat if the interval is 0. By default, the interval is 0.
   *
   * <p>If the scheduler detects that two tasks will overlap, the 2nd task
   * will not be started. The next time the task is due to run, the test
   * will be made again to determine if the previous occurrence of the
   * task is still alive (running). As long as a previous occurrence is
   * running no new occurrences of that specific task will start, although
   * the scheduler will never cease in trying to start it a 2nd time.</p>
   * @returns
   */
  public static builder(): unknown {
    ;(await import('../App')).Client.getInstance().taskManager.create('asd')

    return
  }
}
