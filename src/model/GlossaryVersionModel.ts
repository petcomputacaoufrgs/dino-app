class GlossaryVersionModel {

    version: number

    constructor(version: number) {
        this.version = version
    }

    public getVersion() : number {
        return this.version;
    }

    public setVersion(version : number) : void {
        this.version = version;
    }
}

export default GlossaryVersionModel