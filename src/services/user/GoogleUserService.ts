import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePhotoResponseModel from '../../types/google_api/people/GooglePhotosResponseModel'
import LogAppErrorService from '../log_app_error/LogAppErrorService'

class GoogleUserService {
  getUserGoogleAPIPhoto = async (): Promise<GooglePhotoResponseModel | null> => {
    const request = await GoogleAgentService.get(
      GooglePeopleAPIURLConstants.GET_USER_PHOTOS
    )

    if (request.canGo) {
      try {
        const authRequest = await request.authenticate()
        const response = await authRequest.go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return null
  }
}

export default new GoogleUserService()
