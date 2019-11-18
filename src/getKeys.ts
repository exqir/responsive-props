/**
 * Type-safe wrapper function for Object.keys.
 * @param {object} obj Object to get keys from
 * @returns {(keyof T)[]} string[] Keys of object
 */
export function getKeys<T extends {}>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
