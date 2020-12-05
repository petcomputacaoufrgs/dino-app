import UserLocalStorage from '../../storage/local_storage/user/UserLocalStorage'
import AuthService from '../auth/AuthService'
import AppSettingsService from '../app_settings/AppSettingsService'
import NoteService from '../note/NoteService'
import UserModel from '../../types/user/UserModel'
import DinoAgentService from '../../agent/DinoAgentService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import GooglePeopleAPIUtils from '../../utils/GooglePeopleAPIUtils'
import ImageToBase64Utils from '../../utils/ImageToBase64Utils'
import UserContextUpdater from '../../context/updater/UserContextUpdater'
import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePhotoResponseModel from '../../types/google_api/people/GooglePhotosResponseModel'
import GlossaryService from '../glossary/GlossaryService'
import UserUpdatePictureModel from '../../types/user/UserUpdatePictureModel'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import ContactService from '../contact/ContactService'
import CalendarService from '../calendar/CalendarService'
import FaqService from '../faq/FaqService'
import NoteColumnService from '../note/NoteColumnService'

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

  getSavePictureWithError = (): boolean => {
    const savedValue = UserLocalStorage.getSavePictureWithError()

    if (savedValue) {
      return savedValue
    }

    return false
  }

  private setPictureUrl = (url: string) => {
    UserLocalStorage.setPictureURL(url)
  }

  private setSavedPicture = (base64Photo: string) => {
    UserLocalStorage.setSavedPicture(base64Photo)
  }

  private setSavePictureWithError = (isWithError: boolean) => {
    UserLocalStorage.setSavePictureWithError(isWithError)
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
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.USER_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const version: number = response.body
        return version
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  getServer = async (): Promise<UserModel | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.USER_GET
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const user: UserModel = response.body
        return user
      } catch (e) {
        LogAppErrorService.logError(e)
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

        const savePictureWithError = this.getSavePictureWithError()

        if (savePictureWithError || this.getPictureUrl() !== pictureURL) {
          if (savePictureWithError) {
            this.setSavePictureWithError(false)
          }

          this.setPictureUrl(pictureURL)
          this.donwloadPicture(pictureURL)
          this.saveNewPhotoOnServer(pictureURL)
        }
      }
    }
  }

  saveNewPhotoOnServer = async (pictureURL: string) => {
    const request = await DinoAgentService.put(
      APIRequestMappingConstants.USER_PUT_PHOTO
    )

    if (request.canGo) {
      try {
        const model: UserUpdatePictureModel = {
          pictureURL: pictureURL,
        }
        const response = await request.authenticate().setBody(model).go()
        const newVersion: number = response.body
        this.setVersion(newVersion)
      } catch (e) {
        LogAppErrorService.logError(e)
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

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return null
  }

  private donwloadPicture = (pictureURL: string) => {
    try {
      ImageToBase64Utils.getBase64FromImageSource(
        pictureURL,
        'jpeg',
        this.saveDowloadedImage
      )
    } catch (e) {
      this.setSavePictureWithError(true)
      LogAppErrorService.logError(e)
    }
  }

  private saveDowloadedImage = (base64Image: string, success: boolean) => {
    if (success) {
      this.setSavedPicture(base64Image)
      UserContextUpdater.update()
    }
  }

  removeUserData() {
    UserLocalStorage.removeUserData()
    AuthService.removeUserData()
    AppSettingsService.removeUserData()
    NoteService.removeUserData()
    NoteColumnService.removeUserData()
    GlossaryService.removeData()
    LogAppErrorService.removeUserData()
    ContactService.removeUserData()
    FaqService.removeUserData()
    CalendarService.removeUserData()
  }
}

export default new UserService()
