class ArrayUtils {

    removeRepeatedValues<T> (list: T[]): T[] {
        const uniqueList = new Set(list)

        return Array.from(uniqueList)
    }
    
}

export default new ArrayUtils()