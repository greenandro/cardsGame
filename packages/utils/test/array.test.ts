import {
  arrayWith,
  pickMostCommonProp,
  sortAlphabetically,
  sortAlphaNumerically,
} from "../src/arrays"

test("arrayWith", () => {
  expect(arrayWith(0)).toStrictEqual([])
  expect(arrayWith(3)).toStrictEqual([0, 1, 2])
})

test("sortAlphabetically", () => {
  expect(["East", "Cry", "Tree"].sort(sortAlphabetically)).toStrictEqual([
    "Cry",
    "East",
    "Tree",
  ])
  expect(["Two", "One", "Two"].sort(sortAlphabetically)).toStrictEqual([
    "One",
    "Two",
    "Two",
  ])
})

test("sortAlphaNumerically", () => {
  expect(
    ["2", "zz", "b", "22", "aa", "b", "1", "10", "2"].sort(sortAlphaNumerically)
  ).toStrictEqual(["1", "2", "2", "10", "22", "aa", "b", "b", "zz"])
})

test("pickMostCommonProp", () => {
  type Item = { type: string; value: number }
  const items: Item[] = [
    { type: "foo", value: 0 },
    { type: "bar", value: 0 },
    { type: "foo", value: 0 },
    { type: "baz", value: 1 },
    { type: "foo", value: 2 },
    { type: "qux", value: 2 },
    { type: "qux", value: 10 },
  ]

  expect(pickMostCommonProp(items, "type")).toStrictEqual(["foo", 3])
  expect(pickMostCommonProp(items, "value")).toStrictEqual([0, 3])

  expect(pickMostCommonProp(items, "nothing")).toStrictEqual([undefined, 0])

  expect(
    pickMostCommonProp(items, "type", (item) => item.value > 0)
  ).toStrictEqual(["qux", 2])

  expect(
    pickMostCommonProp(items, "type", (item) => item.value === 0)
  ).toStrictEqual(["foo", 2])

  expect(
    pickMostCommonProp(items, "type", (item) => item.value > 100)
  ).toStrictEqual([undefined, 0])
})
