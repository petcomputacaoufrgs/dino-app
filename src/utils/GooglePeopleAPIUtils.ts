const SIZE_ATTR = '=s'

class GooglePeopleAPIUtils {
	changeImageSize(url: string, size: number) {
		const sizeValueIndex = url.indexOf(SIZE_ATTR) + SIZE_ATTR.length

		const newSizeAttr = `${size}-c`

		const newURL = `${url.substring(0, sizeValueIndex)}${newSizeAttr}`

		return newURL
	}
}

export default new GooglePeopleAPIUtils()
