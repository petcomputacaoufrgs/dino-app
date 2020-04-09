import GlossaryItemModel from './GlossaryItemModel'

class GlossaryModel {

    version: number
    itemList: Array<object>

    constructor(version : number, itemList: Array<object>) {
        this.version = version
        this.itemList = itemList
    }

    public getItemList() : Array<object> {
        return this.itemList;
    }

    public setItemList(itemList : Array<object>) : void {
        
        this.itemList = itemList;
    }

    public getVersion() : number {
        return this.version;
    }

    public setVersion(version : number) : void {
        this.version = version;
    }
}

export default GlossaryModel