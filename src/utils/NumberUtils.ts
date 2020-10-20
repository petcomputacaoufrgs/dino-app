class NumberUtils {
  isEven = (number: number) => number % 2 === 0

  isOdd = (number: number) => !this.isEven(number)

  safeParseNumber = (str: string) => {
    const number = parseInt(str)

    if (isNaN(number)) {
      return 0
    }

    return number
  }
}

export default new NumberUtils()
