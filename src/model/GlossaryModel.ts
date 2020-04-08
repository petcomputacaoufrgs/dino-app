import GlossaryItemModel from './GlossaryItemModel'

class GlossaryModel {

    itemList: Array<GlossaryItemModel>

    constructor(itemList: Array<GlossaryItemModel>) {
        this.itemList = itemList
    }

    public getItemList() : Array<GlossaryItemModel> {
        return this.itemList;
    }

    public setItemList(itemList : Array<GlossaryItemModel>) : void {
        this.itemList = itemList;
    }
}

export default GlossaryModel