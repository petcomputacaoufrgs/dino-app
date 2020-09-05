type filterCallback<T> = (value: T) => boolean

class ArrayUtils {
  removeRepeatedValues = <T>(list: T[]): T[] => {
    
    if(list.length > 1) {

      const uniqueList = new Set(list)

      return Array.from(uniqueList)
    }
    return list
  }

  remove = <T>(list: T[], element: T): T[] => {
    return list.filter((e) => e !== element)
  }

  merge = <T>(lists: T[]): T[] => {
    return ([] as T[]).concat.apply([], lists)
  }

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
