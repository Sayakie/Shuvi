/**
 * @template {T}
 */

/**
 * Validates an instance was initialised,
 * returns itself if valid but throws not.
 *
 * @param {T} instance
 * @throws {Error}
 * @return {T}
 */
export const check = <T>(instance: T): T => {
  if (typeof instance === 'undefined') {
    throw new Error('Shuvi has not been initialized.')
  }

  return instance
}
