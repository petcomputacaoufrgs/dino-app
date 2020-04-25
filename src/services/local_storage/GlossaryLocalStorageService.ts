import { LocalStorageService } from './LocalStorageService'
import LS_Constants from "../../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../../model/GlossaryItemModel'

class GlossaryLocalStorageService extends LocalStorageService {

    getGlossaryVersion = () : number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getGlossaryItems = () : Array<GlossaryItemModel> => {
        let items = this.get(LS_Constants.GLOSSARY_ITEMS)

        let result = new Array<GlossaryItemModel>()

        if (items) {
            result = JSON.parse(items)
        }
        
        return result
    }

    removeGlossaruItems = () => {
        this.remove(LS_Constants.GLOSSARY_ITEMS)
    }

    setGlossaryVersion = (version: number) => {
        this.set(LS_Constants.GLOSSARY_VERSION, JSON.stringify(version))
    }

    setGlossaryItems = (items: GlossaryItemModel[]) => {
        this.set(LS_Constants.GLOSSARY_ITEMS, JSON.stringify(items))
    }

    removeGlossaryVersion = () => {
        this.remove(LS_Constants.GLOSSARY_VERSION)
    }

}

export default new GlossaryLocalStorageService()