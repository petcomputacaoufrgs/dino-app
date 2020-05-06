import LocalStorage from './LocalStorage'
import LS_Constants from "../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../model/dino_api/glossary/GlossaryItemModel'

class GlossaryLocalStorage extends LocalStorage {

    getVersion = () : number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getItems = () : Array<GlossaryItemModel> => {
        let items = this.get(LS_Constants.GLOSSARY_ITEMS)

        return items ? JSON.parse(items) : new Array<GlossaryItemModel>()
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

export default new GlossaryLocalStorage()