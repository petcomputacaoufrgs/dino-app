import ColorConstants from "../../constants/app/ColorConstants"
import DataConstants from "../../constants/app_data/DataConstants"
import ContactEntity from "../../types/contact/database/ContactEntity"
import EssentialContactEntity from "../../types/contact/database/EssentialContactEntity"
import EssentialPhoneEntity from "../../types/contact/database/EssentialPhoneEntity"
import PhoneEntity from "../../types/contact/database/PhoneEntity"
import TreatmentQuestionEntity from "../../types/faq/database/TreatmentQuestionEntity"
import GlossaryItemEntity from "../../types/glossary/database/GlossaryItemEntity"
import NoteColumnEntity from "../../types/note/database/NoteColumnEntity"
import NoteEntity from "../../types/note/database/NoteEntity"
import ArrayUtils from "../../utils/ArrayUtils"
import FaqItemEntity from "../../types/faq/database/FaqItemEntity"
import TreatmentEntity from "../../types/treatment/database/TreatmentEntity"
import AuthService from "../auth/AuthService"
import ContactService from "../contact/ContactService"
import EssentialContactService from "../contact/EssentialContactService"
import EssentialPhoneService from "../contact/EssentialPhoneService"
import PhoneService from "../contact/PhoneService"
import FaqItemService from "../faq/FaqItemService"
import GlossaryService from "../glossary/GlossaryService"
import NoteColumnService from "../note/NoteColumnService"
import NoteService from "../note/NoteService"
import TreatmentQuestionService from "../treatment/TreatmentQuestionService"
import TreatmentService from "../treatment/TreatmentService"
import data from './glossary.json'

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
      await this.loadNotes()
      await this.loadTreatmentQuestionInstances()
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
    
    treatments.forEach(t => {

      const instances = [
        {
          question: `[Test] FaqItem Question 1`,
          answer: `[Test] FaqItem Answer 1`,
          localTreatmentId: t.localId
        },
        {
          question: `[Test] FaqItem Question 2`,
          answer: `[Test] FaqItem Answer 2`,
          localTreatmentId: t.localId
        },
        {
          question: `[Test] FaqItem Question 3`,
          answer: `[Test] FaqItem Answer 3`,
          localTreatmentId: t.localId
        }
      ] as FaqItemEntity[]
      
      FaqItemService.saveAll(instances)
    }) 
  }

  private async loadTreatmentQuestionInstances() {

    const treatments = await TreatmentService.getAll()
    
    treatments.forEach(t => {

      const instances = [
        {
          question: `[Test] Treatment Question 1`,
          localTreatmentId: t.localId
        },
        {
          question: `[Test] Treatment Question 2`,
          localTreatmentId: t.localId
        },
      ] as TreatmentQuestionEntity[]

      TreatmentQuestionService.saveAll(instances)
    }) 
  }

  private async loadEssentialContacts() {

    const getRandomTreatments = () => {
      const response = new Set<number>() 
      const numberOfTreatments = Math.ceil(Math.random() * 3)
      for (let n = 0; n < numberOfTreatments; n++) {
        const randomTreatment = ArrayUtils.randomItem(treatments)
        if(randomTreatment.localId) 
          response.add(randomTreatment.localId)
      }
      return Array.from(response)
    }

    const instancesUniversal: EssentialContactEntity[] = this.contactInstances.map(c => {
      const ec = c as EssentialContactEntity 
      ec.isUniversal = 1
      return ec
    })

    await EssentialContactService.saveAll(instancesUniversal)

    const treatments = await TreatmentService.getAll()
    
    const instancesNonUniversal: EssentialContactEntity[] = this.contactInstances.map(c => {
        const ec = c as EssentialContactEntity 
        ec.isUniversal = 0
        ec.treatmentLocalIds = getRandomTreatments()
        return ec
    }) 

    await EssentialContactService.saveAll(instancesNonUniversal)
  }

  private async loadEssentialPhones() {

    const ecs = await EssentialContactService.getAll()

    const toSave: EssentialPhoneEntity[] = []
    
    ecs.forEach(ec => {
      toSave.push(...this.getRandomPhones().map((p: EssentialPhoneEntity) => {
        const newPhone  = { ...p } 
        newPhone.localEssentialContactId = ec.localId
        return newPhone
      }))
    })
    
    EssentialPhoneService.saveAll(toSave)
  }

  private async loadGlossary() {

    let instances: GlossaryItemEntity[] = []

    if(data) {
      instances = data.itemList
    } else {
      instances = [
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
    }

    await GlossaryService.saveAll(instances)
  }

  private async loadContacts() {
    await ContactService.saveAll(this.contactInstances)
  }

  private async loadPhones() {

    const contacts = await ContactService.getAll()

    const toSave = [] as PhoneEntity[]
    
    contacts.forEach(c => {
      toSave.push(...this.getRandomPhones().map((p: PhoneEntity) => {
        const newPhone  = { ...p } 
        newPhone.localContactId = c.localId
        return newPhone
      }))
    }) 
    
    PhoneService.saveAll(toSave)
  }

  private async loadNotes() {

    const columnInstances = [
      {
        order: 0,
        title: "[Test] Column Title 1"
      }, 
      {
        order: 1,
        title: "[Test] Column Title 2"
      }, 
    ] as NoteColumnEntity[]

    await NoteColumnService.saveAll(columnInstances)

    const columns = await NoteColumnService.getAll()

    columns.forEach(c => {
      const noteInstances = [
        { 
          order: 0,
          question: "[Test] Note Question 1",
          answer: "[Test] Note Answer 1",
          tags: ["[Test] Note Tag 1"],
          columnLocalId: c.localId
        },
        { 
          order: 1,
          question: "[Test] Note Question 2",
          answer: "[Test] Note Answer 2",
          tags: ["[Test] Note Tag 2"],
          columnLocalId: c.localId
        },
        { 
          order: 2,
          question: "[Test] Note Question 3",
          answer: "[Test] Note Answer 3",
          tags: ["[Test] Note Tag 3"],
          columnLocalId: c.localId
        }
      ] as NoteEntity[]

      NoteService.saveAll(noteInstances)
    }) 

  }

  private contactInstances: (ContactEntity|EssentialContactEntity)[] = [
    { 
      name: "[Test] Contact Name 1",
      description: "[Test] Contact Description 1",
      color: ColorConstants.COLORS[0]
    },
    { 
      name: "[Test] Contact Name 2",
      description: "[Test] Contact Description 2",
      color: ColorConstants.COLORS[1]
    },
    { 
      name: "[Test] Contact Name 3",
      description: "[Test] Contact Description 3",
      color: ColorConstants.COLORS[2]
    },
    { 
      name: "[Test] Contact Name 4",
      description: "[Test] Contact Description 4",
      color: ColorConstants.COLORS[3]
    },
    { 
      name: "[Test] Contact Name 5",
      description: "[Test] Contact Description 5",
      color: ColorConstants.COLORS[4]
    },
    { 
      name: "[Test] Contact Name 6",
      description: "[Test] Contact Description 6",
      color: ColorConstants.COLORS[5]
    },
  ]

  private getRandomPhones = () => {
    const response = new Set<(PhoneEntity | EssentialPhoneEntity)>() 
    const numberOfPhones = Math.ceil(Math.random() * 3)
    for (let n = 0; n < numberOfPhones; n++) {
      const randomPhone = ArrayUtils.randomItem(this.phoneInstances)
      response.add(randomPhone)
    }
    return Array.from(response)
  }

  private phoneInstances: (PhoneEntity | EssentialPhoneEntity)[] = [
    { 
      number: "999999999",
      type: DataConstants.CONTACT_PHONE_CODE_MOBILE,
    },
    { 
      number: "182",
      type: DataConstants.CONTACT_PHONE_CODE_PUBLIC_SERVICE,
    },
    { 
      number: "32323232",
      type: DataConstants.CONTACT_PHONE_CODE_RESIDENTIAL,
    }
  ]

}


export default new TestInstanceService()