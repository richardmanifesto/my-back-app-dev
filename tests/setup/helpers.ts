/**
 * Wait function.
 *
 * @param {number} time
 *   The number of milliseconds to wait for.
 */
export function wait(time: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}