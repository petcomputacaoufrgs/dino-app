import GoogleAgentService from "../../agent/GoogleAgentService"
import GooglePeopleAPIURLConstants from "../../constants/google/GooglePeopleAPIURLConstants"
import LogAppErrorService from "../log_app_error/LogAppErrorService"
import GooglePeopleModel from "../../types/google_api/people/GooglePeopleModel"
import ContactModel from "../../types/contact/ContactModel"
import AuthService from "../auth/AuthService"
import GoogleScope from "../../types/auth/google/GoogleScope"
import ContactServerService from "./ContactServerService"
import ContactGoogleResourceNameModel from "../../types/contact/ContactGoogleResourceNameModel"
import ContactGoogleResourceNamesModel from "../../types/contact/ContactGoogleResourceNamesModel"
import ContactResponseModel from "../../types/contact/ContactResponseModel"

class ContactGoogleService {

    createNewContact = async (contact: ContactModel): Promise<string | undefined> => {
        if (contact.id) {
            const resourceNameModel = await this.saveContactOnGoogleAPI(contact)
            if (resourceNameModel) {
                ContactServerService.saveGoogleResourceName(resourceNameModel)
            }
        }

        return undefined
    }

    createNewsContacts = async (contacts: ContactResponseModel[]) => {
        const resourceNameModels = await Promise.all(contacts.map(contact => this.saveContactOnGoogleAPI(contact)))

        const validResourceNames: ContactGoogleResourceNameModel[] = []

        resourceNameModels.forEach(item => {
            if (item) {
                validResourceNames.push(item)
            }
        })
        

        const model: ContactGoogleResourceNamesModel = {
            resourceNames: validResourceNames!
        }

        if (model.resourceNames.length > 0) {
            ContactServerService.saveGoogleResourceNames(model)
        }
    }

    private saveContactOnGoogleAPI = async (contact: ContactModel | ContactResponseModel): Promise<ContactGoogleResourceNameModel | undefined> => {
        if (this.hasContactGrant() && contact.id) {
            const peopleModel = this.createPeopleFromContactModel(contact)
            const response = await this.createContactRequest(peopleModel)
            if (response && response.resourceName) {
                return {
                    id: contact.id,
                    resourceName: response.resourceName
                }
            }
        }

        return undefined
    }

    private hasContactGrant = (): boolean => {
        const scopes = AuthService.getGoogleAuthScopes()
        
        if (scopes) {
            return scopes.some(scope => scope === GoogleScope.SCOPE_CONTACT)
        }

        return false
    }

    private createPeopleFromContactModel = (contact: ContactModel | ContactResponseModel): GooglePeopleModel => {
        const model: GooglePeopleModel = {
            names: [
                {
                    givenName: contact.name
                }
            ],
            phoneNumbers: contact.phones.map(phone => ({
                value: phone.number,
            }))
        }

        if (contact.description) {
            model.biographies = [{
                value: contact.description,
                contentType: "TEXT_PLAIN"
            }]
        }

        return model
    }

    private createContactRequest = async (model: GooglePeopleModel): Promise<GooglePeopleModel | null> => {
        const request = await GoogleAgentService.post(
            GooglePeopleAPIURLConstants.CREATE_CONTACT
        )

        if (request.canGo) {
            try {
                const response = await request.authenticate().setBody(model).go()
                
                return response.body
            } catch (e) {
                LogAppErrorService.logError(e)
            }
        }

        return null
    }
}

export default new ContactGoogleService()