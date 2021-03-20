import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import NoteConstants from '../../constants/note/NoteConstants'
import Database from '../../storage/Database'
import NoteDataModel from '../../types/note/api/NoteDataModel'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../types/note/database/NoteEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import NoteColumnService from './NoteColumnService'
import NoteView from '../../types/note/view/NoteView'
import Utils from '../../utils/Utils'
import DinoPermission from '../../types/auth/api/DinoPermissions'

class NoteServiceImpl extends AutoSynchronizableService<
	number,
	NoteDataModel,
	NoteEntity
> {
	constructor() {
		super(
			Database.note,
			APIRequestMappingConstants.NOTE,
			WebSocketQueuePathService,
			APIWebSocketDestConstants.NOTE,
		)
	}

	protected getDinoPermissions(): DinoPermission[] {
		return [DinoPermission.RESPONSIBLE]
	}

	getSyncDependencies(): SynchronizableService[] {
		return [NoteColumnService]
	}

	async convertModelToEntity(
		model: NoteDataModel,
	): Promise<NoteEntity | undefined> {
		const noteColumn = await NoteColumnService.getById(model.columnId)
		if (noteColumn) {
			const entity: NoteEntity = {
				answer: model.answer,
				order: model.order,
				question: model.question,
				tags:
					model.tags === ''
						? []
						: model.tags.split(NoteConstants.TAG_SEPARATOR),
				columnLocalId: noteColumn.localId,
			}

			return entity
		}
	}

	async convertEntityToModel(
		entity: NoteEntity,
	): Promise<NoteDataModel | undefined> {
		if (entity.columnLocalId) {
			const noteColumn = await NoteColumnService.getByLocalId(
				entity.columnLocalId,
			)

			if (noteColumn && noteColumn.id) {
				const model: NoteDataModel = {
					answer: entity.answer,
					columnId: noteColumn.id,
					order: entity.order,
					question: entity.question,
					tags: entity.tags.join(NoteConstants.TAG_SEPARATOR),
				}

				return model
			}
		}
	}

	getAllTags(notes: NoteEntity[]): string[] {
		const tags: string[] = []
		notes.forEach(item => tags.push(...item.tags))
		return ArrayUtils.removeRepeatedValues(tags)
	}

	filterNotesInNoteView(
		noteView: NoteView,
		tagsSearch: string[],
		textSearch: string,
		activeTagsSearch: boolean,
		activeTextSearch: boolean,
	) {
		return noteView.notes.filter(note => {
			if (!activeTagsSearch && !activeTextSearch) return true

			if (note.columnLocalId !== noteView.column.localId) return false

			if (activeTagsSearch) {
				const inSearch = note.tags.some(tag =>
					tagsSearch.some(tagSearch => tagSearch === tag),
				)
				if (inSearch) return true
			}

			if (activeTextSearch) {
				const inSearch = note.question.includes(textSearch)

				if (inSearch) return true
			}

			return false
		})
	}

	async deleteNotesByColumn(column: NoteColumnEntity) {
		if (Utils.isNotEmpty(column.localId)) {
			const notes = await this.getAllByColumn(column)
			await this.deleteAll(notes)
		}
	}

	private async getAllByColumn(
		column: NoteColumnEntity,
	): Promise<NoteEntity[]> {
		if (Utils.isNotEmpty(column.localId)) {
			return this.table.where('localColumnId').equals(column.localId!).toArray()
		}

		return []
	}
}

export default new NoteServiceImpl()
