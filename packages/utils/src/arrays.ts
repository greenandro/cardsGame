/**
 * Runs every provided function on `array` using .map(), ignores every function which turns out to be `undefined` instead.
 * @throws if one of arg1+ turn out to be something other than Function or undefined.
 */
export const mapCompose = (
  array: any[],
  ...functions: ((...args) => any)[]
): any[] => {
  return functions.reduce((prevArr, fn, idx) => {
    if (typeof fn === "function") {
      return prevArr.map(fn)
    } else if (typeof fn === "undefined" || fn === false) {
      return prevArr
    } else {
      throw new Error(
        `utils/mapCompose, I expected a function at arg${
          idx + 1
        }, got "${typeof fn}" instead...`
      )
    }
  }, array || [])
}

export const sortAlphabetically = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0

export const sortAlphaNumerically = (a: string, b: string): number => {
  const numA = parseInt(a) || false
  const numB = parseInt(b) || false

  if (numA !== false && numB !== false) {
    return numA - numB
  }
  return a < b ? -1 : a > b ? 1 : 0
}

export const shuffle = (array): any[] => {
  const res = [...array]
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = res[i]
    res[i] = res[j]
    res[j] = temp
  }
  return res
}

export const arrayWith = (count: number): any[] => [...Array(count).keys()]
