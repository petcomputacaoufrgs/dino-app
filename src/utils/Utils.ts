class Utils {
    isEmpty(value: any | undefined): boolean {
        return value === null || value === undefined
    }

    isNotEmpty(value: any | undefined): boolean {
        return !this.isEmpty(value)
    }
}

export default new Utils()