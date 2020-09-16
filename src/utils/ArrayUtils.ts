type filterCallback<T> = (value: T) => boolean

class ArrayUtils {
  removeRepeatedValues = <T>(list: T[]): T[] => {
    if (list.length > 1) {
      const uniqueList = new Set(list)

      return Array.from(uniqueList)
    }
    return list
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

  /**
   * @param list Lista a ser filtrada
   * @param filterFn Função filtro
   *
   * @returns Lista com Lista de items que obedecem o filtro e lista de items que não
   */
  separate = <T>(list: T[], filterFn: filterCallback<T>): [T[], T[]] => {
    const _in: any[] = []
    const _out: any[] = []
    list.forEach((value) => {
      if (filterFn(value)) {
        _in.push(value)
      } else {
        _out.push(value)
      }
    })
    return [_in, _out]
  }
}

export default new ArrayUtils()
