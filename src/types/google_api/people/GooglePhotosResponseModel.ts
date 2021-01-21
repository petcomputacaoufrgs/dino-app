interface GooglePhotoSourceModel {
	id: string
	type: string
}

interface GooglePhotoMetadataModel {
	primary: boolean
	source: GooglePhotoSourceModel
}

interface GooglePhotoModel {
	metadata: GooglePhotoMetadataModel
	url: string
}

export default interface GooglePhotoResponseModel {
	photos: GooglePhotoModel[]
}
