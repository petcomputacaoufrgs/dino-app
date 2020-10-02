import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteServerService from './NoteServerService'
import { NoteColumnViewModel } from '../../types/note/view/NoteColumnViewModel'
import NoteWebSocketOrderUpdateModel from '../../types/note/web_socket/NoteWebSocketOrderUpdateModel'
import NoteWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteWebSocketAlertDeleteModel'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteDatabaseService from './NoteDatabaseService'
import NoteViewModel from '../../types/note/view/NoteViewModel'
import NoteLocalStorageService from './NoteLocalStorageService'
import DeletedNoteDatabaseService from './DeletedNoteDatabaseService'
import DeletedNoteEntity from '../../types/note/database/DeletedNoteEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import NoteSyncRequestModel from '../../types/note/server/sync/note/NoteSyncRequestModel'
import NoteColumnService from './NoteColumnService'
import NoteWithColumn from '../../types/note/server/sync/note/NoteWithColumn'

class NoteService {
  //#region GET

  getNotes = async (): Promise<NoteEntity[]> => {
    return NoteDatabaseService.getAll()
  }

  getDeletedNotes = async (): Promise<DeletedNoteEntity[]> => {
    return DeletedNoteDatabaseService.getAll()
  }

  getTags = async (): Promise<string[]> => {
    return NoteDatabaseService.getAllTags()
  }

  getVersion = (): number => NoteLocalStorageService.getVersion()

  getVersionFromServer = async (): Promise<number | undefined> => {
    return NoteServerService.getVersion()
  }

  //#endregion

  //#region SYNC

  sync = async () => {
    const shouldSync = NoteLocalStorageService.shouldSync()

    const shouldSyncOrder = NoteLocalStorageService.shouldSyncOrder()

    const deletedNotes = await this.getDeletedNotes()

    const localNotes = await this.getNotes()

    const localColumns = await NoteColumnService.getColumns()

    const localNotesWithColumn: NoteWithColumn[] = localNotes
      .map((note) => ({
        ...note,
        column: localColumns.find(
          (column) => column.title === note.columnTitle
        ),
      }))
      .filter(
        (note) =>
          note.column !== undefined && note.column.external_id !== undefined
      )

    const [savedNotes, unsavedNotes] = ArrayUtils.partition(
      localNotesWithColumn,
      (note) => note.savedOnServer && note.external_id !== undefined
    )

    const [newNotes, changedNotes] = ArrayUtils.partition(
      unsavedNotes,
      (note) => note.external_id === undefined
    )

    const model: NoteSyncRequestModel = {
      deletedNotes: shouldSync
        ? deletedNotes.map((note) => ({
            id: note.external_id,
            lastUpdate: note.lastUpdate,
          }))
        : [],
      changedNotes: shouldSync
        ? changedNotes.map((note) => ({
            id: note.external_id!,
            lastUpdate: note.lastUpdate,
            question: note.question,
            answer: note.answer,
            tagNames: note.tagNames,
            columnId: note.column!.external_id!,
            lastOrderUpdate: shouldSyncOrder ? note.lastOrderUpdate : undefined,
            order: shouldSyncOrder ? note.order : undefined,
          }))
        : [],
      newNotes: shouldSync
        ? newNotes.map((note) => ({
            answer: note.answer,
            columnId: note.column!.external_id!,
            lastUpdate: note.lastUpdate,
            question: note.question,
            tagNames: note.tagNames,
            lastOrderUpdate: shouldSyncOrder ? note.lastOrderUpdate : undefined,
            order: shouldSyncOrder ? note.order : undefined,
          }))
        : [],
      notesOrder: shouldSyncOrder
        ? savedNotes.map((note) => ({
            id: note.external_id!,
            columnId: note.column!.external_id!,
            lastOrderUpdate: note.lastOrderUpdate,
            order: note.order,
          }))
        : [],
    }

    const response = await NoteServerService.sync(model)

    if (response) {
      const notes: NoteEntity[] = response.notes.map((note) => ({
        external_id: note.id,
        order: note.order,
        answer: note.answer,
        lastUpdate: note.lastUpdate,
        lastOrderUpdate: note.lastOrderUpdate,
        question: note.question,
        tagNames: note.tags,
        savedOnServer: true,
        columnTitle: note.columnTitle,
      }))
      DeletedNoteDatabaseService.deleteAll()
      await NoteDatabaseService.deleteAll()
      await NoteDatabaseService.putAll(notes)
      this.updateContext()
      NoteLocalStorageService.setVersion(response.version)
    }
  }

  //#endregion

  //#region SAVE

  saveNote = async (note: NoteViewModel) => {
    const dbNote = await NoteDatabaseService.getById(note.id)

    if (dbNote) {
      dbNote.answer = note.answer
      dbNote.question = note.question
      dbNote.tagNames = note.tagNames
      dbNote.savedOnServer = false
      dbNote.lastUpdate = new Date().getTime()

      await NoteDatabaseService.put(dbNote)

      this.saveNoteOnServer(dbNote)
    }

    this.updateContext()
  }

  createNote = async (
    question: string,
    tagNames: string[],
    colunm: NoteColumnViewModel
  ) => {
    const date = new Date().getTime()

    const note: NoteEntity = {
      answer: '',
      question: question,
      tagNames: tagNames,
      lastUpdate: date,
      lastOrderUpdate: date,
      savedOnServer: false,
      order: colunm.notes.length,
      columnTitle: colunm.title,
    }

    await NoteDatabaseService.put(note)

    this.updateContext()

    this.saveNoteOnServer(note)
  }

  saveNoteOnServer = async (note: NoteEntity) => {
    const response = await NoteServerService.save(note)

    if (response && note.id) {
      await NoteDatabaseService.saveExternalIdByIdAndSavedOnServer(
        note.id,
        response.id,
        true
      )
      NoteLocalStorageService.setVersion(response.userNoteVersion)
      this.updateContext()
    } else {
      NoteLocalStorageService.setShouldSync(true)
    }
  }

  saveNotesOrder = async (notes: NoteEntity[]) => {
    if (notes.length > 0) {
      const databaseNotes = await this.getNotes()
      notes.forEach((note, index) => {
        const savedNote = databaseNotes.find(
          (savedNote) => savedNote.id === note.id
        )

        if (savedNote) {
          savedNote.order = index
          savedNote.lastOrderUpdate = new Date().getTime()
          savedNote.columnTitle = note.columnTitle
        }
      })

      await NoteDatabaseService.putAll(databaseNotes)

      this.saveOrderOnServer(databaseNotes)

      this.updateContext()
    }
  }

  saveOrderOnServer = async (notes?: NoteEntity[]): Promise<void> => {
    if (!notes) {
      notes = await this.getNotes()
    }

    const success = await NoteServerService.saveOrder(notes)

    if (!success) {
      NoteLocalStorageService.setShouldSync(true)
      NoteLocalStorageService.setShouldSyncOrder(true)
    }
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteLocalStorageService.removeUserData()
    NoteDatabaseService.deleteAll()
    DeletedNoteDatabaseService.deleteAll()
  }

  addNotesInDeletedNoteDatabase = async (deletedNotes: NoteEntity[]) => {
    deletedNotes.forEach(
      (deletedNote) => (deletedNote.lastUpdate = new Date().getTime())
    )
    return DeletedNoteDatabaseService.addAll(deletedNotes)
  }

  deleteAllDatabaseNotesByColumnTitle = async (
    columnTitle: string
  ): Promise<NoteEntity[]> => {
    const deletedNotes = await NoteDatabaseService.deleteByColumnTitle(
      columnTitle
    )

    this.updateContext()

    return deletedNotes
  }

  deleteNote = async (note: NoteViewModel) => {
    const deletedNote = await NoteDatabaseService.deleteById(note.id)

    this.updateContext()

    if (deletedNote) {
      this.deleteNoteOnServer(deletedNote)
    }
  }

  deleteNotesOnServer = async () => {
    const deletedNotes = await this.getDeletedNotes()
    if (deletedNotes.length > 0) {
      const newVersion = await NoteServerService.deleteAll(deletedNotes)

      if (newVersion !== undefined) {
        DeletedNoteDatabaseService.deleteAll()
        NoteLocalStorageService.setVersion(newVersion)
      } else {
        NoteLocalStorageService.setShouldSync(true)
      }
    }
  }

  private deleteNoteOnServer = async (note: NoteEntity) => {
    if (note.external_id) {
      const newVersion = await NoteServerService.delete(note.external_id)

      if (newVersion !== null) {
        NoteLocalStorageService.setVersion(newVersion)
      } else {
        note.lastUpdate = new Date().getTime()
        await DeletedNoteDatabaseService.add(note)
        NoteLocalStorageService.setShouldSync(true)
      }
    }
  }

  //#endregion

  //#region UPDATE

  updateContext = () => {
    NoteContextUpdater.update()
  }

  updateNoteColumnTitle = async (
    newColumnTitle: string,
    oldCclumnTitle: string
  ) => {
    return NoteDatabaseService.updateColumnTitle(newColumnTitle, oldCclumnTitle)
  }

  checkQuestionConflict = (
    localVersion: NoteEntity,
    serverNotesDocs: NoteEntity[]
  ): boolean =>
    serverNotesDocs.some(
      (serverNote) =>
        serverNote.question === localVersion.question &&
        serverNote.lastUpdate !== localVersion.lastUpdate &&
        serverNote.external_id !== localVersion.external_id
    )

  updateNotesFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()

    if (newVersion > localVersion) {
      const response = await NoteServerService.get()
      if (response) {
        const notes: NoteEntity[] = response.map((note) => ({
          external_id: note.id,
          order: note.order,
          answer: note.answer,
          lastUpdate: note.lastUpdate,
          lastOrderUpdate: note.lastOrderUpdate,
          question: note.question,
          tagNames: note.tags,
          savedOnServer: true,
          columnTitle: note.columnTitle,
        }))

        await NoteDatabaseService.deleteAll()

        await NoteDatabaseService.putAll(notes)

        this.updateContext()
        NoteLocalStorageService.setVersion(newVersion)
      }
    }
  }

  updateNotesOrderFromServer = async (model: NoteWebSocketOrderUpdateModel) => {
    const notes = await this.getNotes()
    let updated = false

    notes.forEach((note) => {
      const serverItem = model.items.find(
        (item) => item.id === note.external_id
      )
      if (serverItem) {
        const serverOrderMoreUpdated =
          serverItem.lastOrderUpdate > note.lastOrderUpdate

        if (serverOrderMoreUpdated) {
          note.order = serverItem.order
          note.lastOrderUpdate = serverItem.lastOrderUpdate
          note.columnTitle = serverItem.columnTitle
          updated = true
        }
      }
    })

    if (updated) {
      await NoteDatabaseService.putAll(notes)

      this.updateContext()
    }
  }

  updateDeletedNotesFromServer = async (
    model: NoteWebSocketAlertDeleteModel
  ) => {
    const localVersion = this.getVersion()

    if (model.newVersion > localVersion && model.idList) {
      await NoteDatabaseService.deleteByExternalIds(model.idList)
      NoteLocalStorageService.setVersion(model.newVersion)

      this.updateContext()
    }
  }

  //#endregion

  //#region VALIDATE

  questionAlreadyExists = async (question: string): Promise<boolean> => {
    const note = await NoteDatabaseService.getByQuestion(question)

    if (note) {
      return true
    }

    return false
  }

  //#endregion
}

export default new NoteService()
