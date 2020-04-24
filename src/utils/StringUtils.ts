
class StringUtils {

    normalizeString = (oldString : string) : string => (
        oldString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    )

    /**
     * @param s1 String maior
     * @param s2 String possivelmente incluida na maior
     * @returns True para s2 contida em s1
     */
    contains = (s1: string, s2: string) : boolean => (
        this.normalizeString(s1)
            .includes(this.normalizeString(s2))
    )

    convertNumberToStringWithZeros(n: number, length: number) {
        let result = n.toString()

        while (result.length < length) {
            result = '0'.concat(result)
        }

        return result
    }
}

export default new StringUtils()