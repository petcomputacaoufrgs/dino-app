import DataConstants from "../constants/app_data/DataConstants"
import ContactEntity from "../types/contact/database/ContactEntity"
import EssentialContactEntity from "../types/contact/database/EssentialContactEntity"
import EssentialPhoneEntity from "../types/contact/database/EssentialPhoneEntity"
import PhoneEntity from "../types/contact/database/PhoneEntity"
import GlossaryItemEntity from "../types/glossary/database/GlossaryItemEntity"
import NoteEntity from "../types/note/database/NoteEntity"
import FaqItemEntity from "./../types/faq/database/FaqItemEntity"
import TreatmentEntity from "./../types/treatment/database/TreatmentEntity"
import AuthService from "./auth/AuthService"
import ContactService from "./contact/ContactService"
import EssentialContactService from "./contact/EssentialContactService"
import EssentialPhoneService from "./contact/EssentialPhoneService"
import PhoneService from "./contact/PhoneService"
import FaqItemService from "./faq/FaqItemService"
import GlossaryService from "./glossary/GlossaryService"
import NoteService from "./note/NoteService"
import TreatmentService from "./treatment/TreatmentService"

class TestInstanceService {

	async loadInstances() {

    const isStaff = await AuthService.hasStaffPowers()

    if(isStaff) {
      await this.loadTreatmentInstances()
      await this.loadFaqItemInstances()
      await this.loadEssentialContacts()
      await this.loadEssentialPhones()
      await this.loadGlossary()
    } else {
      await this.loadContacts()
      await this.loadPhones()
    }
  }

  private async loadTreatmentInstances() {

    const instances = [
      { name: "[Test] Treatment Name 1" },
      { name: "[Test] Treatment Name 2" },
      { name: "[Test] Treatment Name 3" },
    ] as TreatmentEntity[]

    await TreatmentService.saveAll(instances)
  }

  private async loadFaqItemInstances() {

    const treatments = await TreatmentService.getAll()
    
    const instances: FaqItemEntity[] = treatments.map((t, index) => {
      return {
        question: `[Test] FaqItem Question ${index}`,
        answer: `[Test] FaqItem Answer ${index}`,
        localTreatmentId: t.localId
      }
    }) 

    await FaqItemService.saveAll(instances)
  }

  private async loadEssentialContacts() {

    const instances = [
      { 
        name: "[Test] EC Name 1",
        description: "",
        isUniversal: 1
      },
      { 
        name: "[Test] EC Name 2",
        description: "",
        isUniversal: 1
      },
    ] as EssentialContactEntity[]

    const treatments = await TreatmentService.getAll()
    
    const instancesNonUniversal: EssentialContactEntity[] = treatments.map((t, index) => {
      return { 
        name: `[Test] EC Name ${index + instances.length}`,
        description: "",
        isUniversal: 0,
        treatmentLocalIds: [t.localId as number]
      }
    }) 

    await EssentialContactService.saveAll([...instances, ...instancesNonUniversal])
  }

  private async loadEssentialPhones() {

    const ecs = await EssentialContactService.getAll()
    
    const instances: EssentialPhoneEntity[] = ecs.map((ec, index) => {
      return { 
        number: "99999999",
        type: DataConstants.CONTACT_PHONE_CODE_MOBILE,
        localEssentialContactId: ec.localId
      }
    }) 

    await EssentialPhoneService.saveAll([...instances])
  }

  private async loadGlossary() {
    const instances = [
      { 
        title: "[Test] Glossary Title 1",
        text: "[Test] Glossary Text 1",
        subtitle: "[Test] Subtitle 1",
        fullText: "[Test] Glossary fullText 1",
      },
      { 
        title: "[Test] Glossary Title 2",
        text: "[Test] Glossary Text 2",
        subtitle: "[Test] Subtitle 2",
        fullText: "[Test] Glossary fullText 2",
      },
    ] as GlossaryItemEntity[]

    await GlossaryService.saveAll(instances)
  }

  private async loadContacts() {

    const instances = [
      { 
        name: "[Test] Contact Name 1",
        description: "",
      },
      { 
        name: "[Test] Contact Name 2",
        description: "",
      },
      { 
        name: "[Test] Contact Name 3",
        description: "",
      },
    ] as ContactEntity[]

    await ContactService.saveAll([...instances])
  }

  private async loadPhones() {

    const constacts = await ContactService.getAll()
    
    const instances: PhoneEntity[] = constacts.map((c, index) => {
      return { 
        number: "99999999",
        type: DataConstants.CONTACT_PHONE_CODE_MOBILE,
        localContactId: c.localId
      }
    }) 

    await PhoneService.saveAll([...instances])
  }

  private async loadNotes() {

    const instances = [
      { 
        order: 0,
        question: "[Test] Note Question 1",
        answer: "[Test] Note Question 1",
        tags: []
      },
      { 
        order: 1,
        question: "[Test] Note Question 2",
        answer: "[Test] Note Question 2",
        tags: []
      },
    ] as NoteEntity[]

    await NoteService.saveAll([...instances])
  }

}


export default new TestInstanceService()