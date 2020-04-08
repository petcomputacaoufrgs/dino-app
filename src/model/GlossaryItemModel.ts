class GlossaryItemModel {

    id : number
    title : string;
    text : string;
    exists : boolean

    constructor(id : number, title : string, text : string, exists : boolean) {
        this.id = id
        this.title = title
        this.text = text
        this.exists = exists
    }

    public getTitle() : string {
        return this.title;
    }

    public getId() : number {
        return this.id;
    }

    public getText() : string {
        return this.text;
    }

    public getExists() : boolean {
        return this.exists;
    }

    public isValid() : boolean {
        return this.text != null && this.title != null && this.title != "";
    }

    public setId(id : number) : void {
        this.id = id;
    }

    public setExists(exists : boolean) : void {
        this.exists = exists;
    }
}

export default GlossaryItemModel
