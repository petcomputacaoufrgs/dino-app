
class StringUtils {

    normalize = (str: string): string => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    }

    /**
     * @param s1 String um
     * @param s2 String dois
     * @returns True para s1 normalizada igual a s2 normalizada
     */
    areEqual = (s1: string, s2: string): boolean => (
        this.normalizer(s1) === this.normalizer(s2)
    )

    /**
     * @param s1 String um
     * @param s2 String dois
     * @returns True para s1 normalizada diferente de s2 normalizada
     */
    areNotEqual = (s1: string, s2: string): boolean => (
        !this.areEqual(s1, s2)
    )

    /**
     * @param s1 String maior
     * @param s2 String possivelmente incluida na maior
     * @returns True para s2 contida em s1
     */
    contains = (s1: string, s2: string): boolean => {
        return this.normalize(s1).includes(this.normalize(s2))
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