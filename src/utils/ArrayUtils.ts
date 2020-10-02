type filter<T> = (value: T) => boolean

class ArrayUtils {
  removeRepeatedValues = <T>(list: T[]): T[] => {
    const uniqueList = new Set(list)

    return Array.from(uniqueList)
  }

  remove = <T>(list: T[], element: T): T[] => {
    return list.filter((e) => e !== element)
  }

  apply = <T>(lists: T[]): T[] => {
    return ([] as T[]).concat.apply([], lists)
  }

  merge = <T>(lists: T[][]): T[] => {
    const newList: T[] = []
    return newList.concat(...lists)
  }

  equal = <T>(list1: T[], list2: T[]): boolean => (
    list1.length === list2.length && list1.every((value, index) => {
      return list2[index] === value
    })
  )

  notEqual = <T>(list1: T[], list2: T[]): boolean => (
    !this.equal(list1, list2)
  )

  equalIgnoreOrder = <T>(list1: T[], list2: T[]): boolean => (
    list1.length === list2.length && list1.every(value => list2.includes(value))
  )

  notEqualIgnoreOrder = <T>(list1: T[], list2: T[]): boolean => (
    !this.equalIgnoreOrder(list1, list2)
  )

  partition = <T>(list: T[], isValid: filter<T>): [T[], T[]] => {
    const pass: any[] = []
    const fail: any[] = []
    list.forEach((value) => {
      if (isValid(value)) {
        pass.push(value)
      } else {
        fail.push(value)
      }
    })

    return [pass, fail]
  }
}

export default new ArrayUtils()
