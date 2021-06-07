import EssentialContactEntity from "../types/contact/database/EssentialContactEntity"
import GlossaryItemEntity from "../types/glossary/database/GlossaryItemEntity"
import FaqItemEntity from "./../types/faq/database/FaqItemEntity"
import TreatmentEntity from "./../types/treatment/database/TreatmentEntity"
import EssentialContactService from "./contact/EssentialContactService"
import FaqItemService from "./faq/FaqItemService"
import GlossaryService from "./glossary/GlossaryService"
import TreatmentService from "./treatment/TreatmentService"

class TestInstanceService {

	async loadInstances() {
    await this.loadTreatmentInstances()
    await this.loadFaqItemInstances()
    await this.loadEssentialContacts()
    await this.loadGlossary()
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

    console.log(treatments)
    
    const instances: FaqItemEntity[] = treatments.map((t, index) => {
      return {
        question: `[Test] FaqItem Question ${index}`,
        answer: `[Test] FaqItem Answer ${index}`,
        localTreatmentId: t.localId
      }
    }) 

    console.log(instances)

    await FaqItemService.saveAll(instances)
  }

  private async loadEssentialContacts() {
    const instances = [
      { 
        name: "[Test] EC Name 1",
        description: "",
        color: undefined,
        isUniversal: 1
      },
      { 
        name: "[Test] EC Name 2",
        description: "",
        color: undefined,
        isUniversal: 1
      },
    ] as EssentialContactEntity[]

    await EssentialContactService.saveAll(instances)
  }

  private async loadGlossary() {
    const instances = [
      { 
        title: "[Test] Glossary Title 1",
        text: "[Test] Glossary Text 1",
        subtitle: "[Test] Glossary subtitle 1",
        fullText: "[Test] Glossary fullText 1",
      },
      { 
        title: "[Test] Glossary Title 2",
        text: "[Test] Glossary Text 2",
        subtitle: "[Test] Glossary subtitle 2",
        fullText: "[Test] Glossary fullText 2",
      },
    ] as GlossaryItemEntity[]

    await GlossaryService.saveAll(instances)
  }
}


export default new TestInstanceService()