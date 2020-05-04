
class StringUtils {

    normalizer = (str: string): string => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    }

    /**
     * @param s1 String maior
     * @param s2 String possivelmente incluida na maior
     * @returns True para s2 contida em s1
     */
    contains = (s1: string, s2: string): boolean => {
        return this.normalizer(s1).includes(this.normalizer(s2))
    }

    /**
     * 
     * @param n Número a ser convertido
     * @param length Número de zeros a esquerda
     */
    toStringWithZeros = (n: number, length: number): string => {

        const stringNumber = n.toString()

        return stringNumber.padStart(length, '0')
    }

}

export default new StringUtils()