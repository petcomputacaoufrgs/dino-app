import GlossaryItemModel from '../../types/glossary/api/GlossaryItemDataModel'
import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemDataModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import APIMainPathsConstants from '../../constants/api/APIMainPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'
import StringUtils from '../../utils/StringUtils'
import LanguageBase from '../../constants/languages/LanguageBase'

class GlossaryServiceImpl extends AutoSynchronizableService<
	number,
	GlossaryItemDataModel,
	GlossaryItemEntity
> {
	constructor() {
		super(
			Database.glossary,
			APIRequestMappingConstants.GLOSSARY,
			WebSocketTopicPathService,
			APIMainPathsConstants.GLOSSARY,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	async convertModelToEntity(
		model: GlossaryItemModel,
	): Promise<GlossaryItemEntity> {
		const entity: GlossaryItemEntity = {
			title: model.title,
			fullText: model.fullText,
			subtitle: model.subtitle,
			text: model.text,
		}

		return entity
	}

	async convertEntityToModel(
		entity: GlossaryItemEntity,
	): Promise<GlossaryItemModel> {
		const model: GlossaryItemModel = {
			title: entity.title,
			fullText: entity.fullText,
			subtitle: entity.subtitle,
			text: entity.text,
		}

		return model
	}

	filterGlossary = (glossary: GlossaryItemEntity[], searchTerm: string) => {
		return glossary
			.filter(item => StringUtils.contains(item.title, searchTerm))
			.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1))
	}

	getByTitle = async (title: string): Promise<GlossaryItemEntity | undefined> => {
		return this.table.where('title').equalsIgnoreCase(title).first()
}

	isTitleInvalid = async (item: GlossaryItemEntity, languageData: LanguageBase) => {
		if(StringUtils.isEmpty(item.title)) {
			return languageData.EMPTY_FIELD_ERROR
		}

		const dbItem = await this.getByTitle(item.title)

		return dbItem && dbItem.localId !== item.localId ? languageData.itemAlreadyExists(languageData.TITLE) :	undefined
	}
}

export default new GlossaryServiceImpl()
