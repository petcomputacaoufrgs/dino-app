class FunctionUtils {
  includes = (fl: any[], f1: Function): boolean => {
    return fl.filter((f) => this.compare(f, f1)).length > 0
  }

  compare = (f1: Function, f2: Function) => {
    console.log(f1.toString())
    console.log(f2.toString)
    return f1.toString() === f2.toString()
  }
}

export default new FunctionUtils()
