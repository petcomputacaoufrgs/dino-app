class ArrayUtils {
  removeRepeatedValues<T>(list: T[]): T[] {
    const uniqueList = new Set(list)

    return Array.from(uniqueList)
  }

  remove<T>(list: T[], element: T): T[] {
    return list.filter((e) => e !== element)
  }
}

export default new ArrayUtils()
