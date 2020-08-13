class NumberUtils {
  isEven = (number: number) => number % 2 === 0

  isOdd = (number: number) => !this.isEven(number)
}

export default new NumberUtils()
