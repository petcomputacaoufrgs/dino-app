import Database from "../../storage/Database"
import PostMessageData from "../../types/service_worker/PostMessageData"
import PostMessageType from "../../types/service_worker/PostMessageType"
import TabEntity from "../../types/tab_control/TabEntity"
import Utils from "../../utils/Utils"
import PostMessageService from "../service_worker/PostMessageService"

class TabControlService {
  private table: Dexie.Table<TabEntity, number>
  private tabId?: number

  constructor() {
    this.table = Database.tab
  }

  registerTab = async () => {
    const tab: TabEntity = {}
    await this.save(tab)
  }

  registerUnloadEvent = () => {
    window.addEventListener("unload", () => {
      PostMessageService.sendPostMessage({
        type: PostMessageType.TAB_CLOSED,
        message: this.tabId
			})
    })
  }
  
  onMessageReceived = async (message: PostMessageData<number>) => {
    console.log(message)
  }

  getAllById = async (entities: TabEntity[]): Promise<TabEntity[]> => {
		const ids = entities
			.filter(entity => Utils.isNotEmpty(entity.id))
			.map(entity => entity.id!)
		return this.table.where('id').anyOf(ids).toArray()
  }
  
  private save = async (entity: TabEntity): Promise<TabEntity> => {
		const id = await this.table.put(entity)

    entity.id = id
    
    this.tabId = id

		return entity
  }
}

export default new TabControlService()