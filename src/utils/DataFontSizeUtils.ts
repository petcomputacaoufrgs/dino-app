class DataFontSizeUtils {
	setBodyDataFontSize = (value: string) => {
		const body = document.getElementById('body')

		if (body) {
			body.setAttribute('data-font-size', value)
		}
	}
}

export default new DataFontSizeUtils()
