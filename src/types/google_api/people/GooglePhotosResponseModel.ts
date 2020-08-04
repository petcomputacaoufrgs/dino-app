export interface GooglePhotoSourceModel {
  id: string
  type: string
}

export interface GooglePhotoMetadataModel {
  primary: boolean
  source: GooglePhotoSourceModel
}

export interface GooglePhotoModel {
  metadata: GooglePhotoMetadataModel
  url: string
}

export default interface GooglePhotoResponseModel {
  photos: GooglePhotoModel[]
}
