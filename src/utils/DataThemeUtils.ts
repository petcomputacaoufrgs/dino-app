class DataThemeUtils {
  setBodyDataTheme = (value: string) => {
    const body = document.getElementById('body')

    if (body) {
      body.setAttribute('data-theme', value)
    }
  }
}

export default new DataThemeUtils()
