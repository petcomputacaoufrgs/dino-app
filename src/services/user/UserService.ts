import UserLocalStorage from './local_storage/UserLocalStorage'
import AuthService from '../auth/AuthService'
import AppSettingsService from '../app_settings/AppSettingsService'
import NoteService from '../note/NoteService'
import UserModel from '../../types/user/UserModel'
import DinoAgentService from '../agent/dino/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AgentStatus from '../../types/services/agent/AgentStatus'
import GooglePeopleAPIUtils from '../../utils/GooglePeopleAPIUtils'
import ImageToBase64Utils from '../../utils/ImageToBase64Utils'
import UserContextUpdater from './UserContextUpdater'
import GoogleAgentService from '../agent/google/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePhotoResponseModel from '../../types/google_api/people/GooglePhotosResponseModel'
import GlossaryService from '../glossary/GlossaryService'
import UserUpdatePictureModel from '../../types/user/UserUpdatePictureModel'

const DELAY_TO_SAVE_IMAGE = 120000

class UserService {
  private setVersion = (version: number) => {
    UserLocalStorage.setVersion(version)
  }

  getVersion = () => {
    return UserLocalStorage.getVersion()
  }

  getPictureUrl = (): string => {
    return UserLocalStorage.getPictureURL()
  }

  private setPictureUrl = (url: string) => {
    UserLocalStorage.setPictureURL(url)
  }

  private setSavedPicture = (base64Photo: string) => {
    UserLocalStorage.setSavedPicture(base64Photo)
  }

  getPicture = () => {
    let picture = UserLocalStorage.getSavedPicture()

    if (!picture) {
      picture = UserLocalStorage.getPictureURL()
    }

    return picture
  }

  getName = () => {
    return UserLocalStorage.getName()
  }

  private setName = (name: string) => {
    UserLocalStorage.setName(name)
  }

  getEmail = () => UserLocalStorage.getEmail()

  private setEmail = (email: string) => {
    UserLocalStorage.setEmail(email)
  }

  getServerVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.USER_VERSION)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()
        const version: number = response.body

        return version
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    return undefined
  }

  getServer = async (): Promise<UserModel | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.USER_GET)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()

        const user: UserModel = response.body

        return user
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    return undefined
  }

  update = async (newVersion: number) => {
    const savedVersion = this.getVersion()

    if (newVersion !== savedVersion) {
      const user = await this.getServer()

      if (user) {
        this.saveUserDataFromModel(user)
      }
    }

    this.updateUserPhoto()
  }

  saveUserDataFromModel = (user: UserModel) => {
    if (user.pictureURL) {
      const pictureURL = GooglePeopleAPIUtils.changeImageSize(
        user.pictureURL,
        125
      )
      this.donwloadPicture(pictureURL)
      this.setPictureUrl(pictureURL)
    }

    this.setEmail(user.email)
    this.setName(user.name)

    this.setVersion(user.version)

    UserContextUpdater.update()
  }

  private updateUserPhoto = async () => {
    const photoModel = await this.getUserGoogleAPIPhoto()

    if (photoModel) {
      const primaryPhoto = this.getPrimaryPhotoFromGooglePhotos(photoModel)

      if (primaryPhoto && primaryPhoto.url) {
        const pictureURL = GooglePeopleAPIUtils.changeImageSize(
          primaryPhoto.url,
          125
        )

        if (this.getPictureUrl() !== pictureURL) {
          this.setPictureUrl(pictureURL)
          this.donwloadPicture(pictureURL)
          this.saveNewPhotoOnServer(pictureURL)
        }
      }
    }
  }

  saveNewPhotoOnServer = async (pictureURL: string) => {
    const request = await DinoAgentService.put(DinoAPIURLConstants.USER_PUT_PHOTO)

    if (request.status === AgentStatus.OK) {
      try {
        const model: UserUpdatePictureModel = {
          pictureURL: pictureURL,
        }
        const response = await request.get().send(model)

        const newVersion: number = response.body

        this.setVersion(newVersion)
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }
  }

  private getPrimaryPhotoFromGooglePhotos = (
    model: GooglePhotoResponseModel
  ) => {
    return model.photos.find((photo) => photo.metadata.primary)
  }

  private getUserGoogleAPIPhoto = async (): Promise<GooglePhotoResponseModel | null> => {
    const request = await GoogleAgentService.get(
      GooglePeopleAPIURLConstants.GET_USER_PHOTOS
    )

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()

        return response.body
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    return null
  }

  private donwloadPicture = (pictureURL: string) => {
    ImageToBase64Utils.getBase64FromImageSource(
      pictureURL,
      'jpeg',
      this.saveDowloadedImage
    )
  }

  private saveDowloadedImage = (base64Image: string, success: boolean) => {
    if (success) {
      this.setSavedPicture(base64Image)
      UserContextUpdater.update()
    } else {
      const pictureURL = this.getPicture()
      setTimeout(() => this.donwloadPicture(pictureURL), DELAY_TO_SAVE_IMAGE)
    }
  }

  removeUserData() {
    UserLocalStorage.removeUserData()
    AuthService.removeUserData()
    AppSettingsService.removeUserData()
    NoteService.removeUserData()
    GlossaryService.removeUserData()
  }
}

export default new UserService()
