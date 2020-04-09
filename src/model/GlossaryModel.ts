import ItemModel from './GlossaryItemModel'

class GlossaryModel {

    version: number
    itemList: Array<ItemModel>

    constructor(version : number, itemList: Array<ItemModel>) {
        this.version = version
        this.itemList = itemList
    }

    public getItemList() : Array<ItemModel> {
        return this.itemList;
    }

    public setItemList(itemList : Array<ItemModel>) : void {
        
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