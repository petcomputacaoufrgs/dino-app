import GoogleAuthRequestModel from "./GoogleAuthRequestModel";

interface GoogleGrantRequestModel extends GoogleAuthRequestModel {
    scopeList: string[]
}

export default GoogleGrantRequestModel
