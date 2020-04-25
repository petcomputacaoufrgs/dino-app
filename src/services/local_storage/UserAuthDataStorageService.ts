import { LocalStorageService } from './LocalStorageService'
import LS_Constants from '../../constants/LocalStorageKeysConstants'

class UserAuthDataStorageService extends LocalStorageService {

    getEmail = () : string | null => (
        this.get(LS_Constants.EMAIL)
    )

    setEmail = (email: string) => {
        this.set(LS_Constants.EMAIL, email)
    }

    removeEmail = () => {
        this.remove(LS_Constants.EMAIL)
    }

    getName = (): string => (
        this.convertStringOrNullToString(this.get(LS_Constants.NAME))
    )

    setName = (name: string) => {
        this.set(LS_Constants.NAME, name)
    } 

    removeName = () => {
        this.remove(LS_Constants.NAME)
    }

    getPictureUrl = (): string => (
        this.convertStringOrNullToString(this.get(LS_Constants.PICTURE_URL))
    )
    
    setPictureUrl = (pictureUrl: string) => {
        this.set(LS_Constants.PICTURE_URL, pictureUrl)
    }

    removePictureUrl = () => {
        this.remove(LS_Constants.PICTURE_URL)
    }

}

export default new UserAuthDataStorageService()