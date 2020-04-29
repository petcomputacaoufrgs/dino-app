import { LocalStorageService } from './LocalStorageService'
import LS_Constants from "../../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../../model/GlossaryItemModel'

class GlossaryLocalStorageService extends LocalStorageService {

    getVersion = () : number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getItems = () : Array<GlossaryItemModel> => {
        let items = this.get(LS_Constants.GLOSSARY_ITEMS)

        let result = new Array<GlossaryItemModel>()

        if (items) {
            result = JSON.parse(items)
        }
        
        return result
    }

    removeItems = () => {
        this.remove(LS_Constants.GLOSSARY_ITEMS)
    }

    setVersion = (version: number) => {
        this.set(LS_Constants.GLOSSARY_VERSION, JSON.stringify(version))
    }

    setItems = (items: GlossaryItemModel[]) => {
        this.set(LS_Constants.GLOSSARY_ITEMS, JSON.stringify(items))
    }

    removeVersion = () => {
        this.remove(LS_Constants.GLOSSARY_VERSION)
    }

}

export default new GlossaryLocalStorageService()