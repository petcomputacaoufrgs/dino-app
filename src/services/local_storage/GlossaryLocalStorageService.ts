import { LocalStorageService } from './LocalStorageService'
import LS_Constants from "../../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../../model/GlossaryItemModel'

class GlossaryLocalStorageService extends LocalStorageService {

    getGlossaryVersion = () : number => {
        const version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getGlossaryItems = () : Array<GlossaryItemModel> => {
        const items = this.get(LS_Constants.GLOSSARY_ITEMS)

        return items ? JSON.parse(items) : new Array<GlossaryItemModel>()
    }

    removeGlossaryItems = () => {
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