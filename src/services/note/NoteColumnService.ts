import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import NoteColumnDatabase from '../../database/note/NoteColumnDatabase'
import DeletedNoteColumnDatabase from '../../database/note/DeletedNoteColumnDatabase'
import NoteColumnVersionLocalStorage from '../../local_storage/note/NoteColumnVersionLocalStorage'
import NoteColumnServerService from './NoteColumnServerService'
import NoteColumnSyncLocalStorage from '../../local_storage/note/NoteColumnSyncLocalStorage'
import NoteColumnContextUpdater from '../../context_updater/NoteColumnContextUpdater'
import { NoteColumnViewModel } from '../../types/note/view/NoteColumnViewModel'
import NoteService from './NoteService'
import NoteColumnWebSocketAlertUpdateOrderModel from '../../types/note/web_socket/NoteColumnWebSocketAlertUpdateOrderModel'
import NoteColumnWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteColumnWebSocketAlertDeleteModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteColumnConstants from '../../constants/NoteColumnConstants'

class NoteColumnService {
  //#region GET
  
  getColumns = async (): Promise<NoteColumnDoc[]> => {
    return NoteColumnDatabase.getAll()
  }

  getDeletedColumns = async (): Promise<NoteColumnDoc[]> => {
    return DeletedNoteColumnDatabase.getAll()
  }

  getVersion = (): number => NoteColumnVersionLocalStorage.getVersion()

  getVersionFromServer = async (): Promise<number | undefined> => {
    return NoteColumnServerService.getVersion()
  }

  //#endregion

  //#region SAVE

  setVersion = (version: number) => {
    NoteColumnVersionLocalStorage.setVersion(version)
  }

  saveColumn = async (changedDoc: NoteColumnDoc, oldTitle?: string) => {
    if (oldTitle) {
      await NoteService.updateNoteColumnTitle(changedDoc.title, oldTitle)

      const savedColumn = await NoteColumnDatabase.getById(changedDoc._id)

      console.log(savedColumn)
      if (savedColumn) {
        await NoteColumnDatabase.deleteByTitle(oldTitle)

        const newDoc: NoteColumnDoc = {
          lastUpdate: new Date().getTime(),
          savedOnServer: false,
          title: changedDoc.title,
          lastOrderUpdate: savedColumn.lastOrderUpdate,
          order: savedColumn.order,
          external_id: savedColumn.external_id,
          _id: '',
          _rev: ''
        }
        
        await NoteColumnDatabase.put(newDoc)
        NoteService.updateContext()
        this.saveColumnOnServer(newDoc)
      }
    } else {
      const newDoc: NoteColumnDoc = {
        lastUpdate: new Date().getTime(),
        savedOnServer: false,
        title: changedDoc.title,
        lastOrderUpdate: new Date().getTime(),
        order: changedDoc.order,
        _id: '',
        _rev: ''
      }

      await NoteColumnDatabase.put(newDoc)
      this.saveColumnOnServer(newDoc)
    }

    NoteColumnContextUpdater.update()
  }

  saveColumnOnServer = async (doc: NoteColumnDoc) => {
    const newVersion = await NoteColumnServerService.save(doc)

    if (newVersion) {
      this.setVersion(newVersion)
      NoteColumnContextUpdater.update()
    } else {
      this.setShouldSync(true)
    }
  }

  saveColumnsOnServer = async (docs: NoteColumnDoc[]) => {
    if (docs.length > 0) {
      const newVersion = await NoteColumnServerService.saveAll(docs)
      if (newVersion) {
        this.setVersion(newVersion)
        NoteColumnContextUpdater.update()
      } else {
        this.setShouldSync(true)
      }
    }
  }

  saveColumnsOrder = async (docs: NoteColumnDoc[]) => {
    if (docs.length > 0) {
      const updatedColumns = await this.getColumns()

      docs.forEach((columnDoc, index) => {
        const updatedColumn = updatedColumns.find(c => c.title === columnDoc.title)

        if (updatedColumn) {
          updatedColumn.order = index
          updatedColumn.lastOrderUpdate = new Date().getTime()
        }
      })
      
      await NoteColumnDatabase.putAll(updatedColumns)

      this.saveColumnsOrderOnServer(updatedColumns)

      NoteColumnContextUpdater.update()
    }
  }

  saveColumnsOrderOnServer = async (docs?: NoteColumnDoc[]): Promise<void> => {
    if (!docs) {
      docs = await this.getColumns()
    }

    const success = await NoteColumnServerService.saveOrder(docs)

    if (!success) {
      this.setShouldSync(true)
    }
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteColumnVersionLocalStorage.removeUserData()
    NoteColumnSyncLocalStorage.removeUserData()
    NoteColumnDatabase.removeAll()
    DeletedNoteColumnDatabase.removeAll()
  }

  deleteColumn = async (doc: NoteColumnDoc) => {
    const updatedDoc = await NoteColumnDatabase.getById(doc._id)
    if (updatedDoc) {
      const deletedNotes = await NoteService.deleteAllDatabaseNotesByColumnTitle(updatedDoc.title)
      await NoteColumnDatabase.deleteByDoc(updatedDoc)
      NoteColumnContextUpdater.update()

      this.deleteColumnOnServer(updatedDoc, deletedNotes)
    }
  }

  deleteColumnsOnServer = async () => {
    const deletedDocs = await this.getDeletedColumns()
    if (deletedDocs.length > 0) {
      const newVersion = await NoteColumnServerService.deleteAll(deletedDocs)

      if (newVersion) {
        DeletedNoteColumnDatabase.removeAll()
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  private deleteColumnOnServer = async (doc: NoteColumnDoc, deletedNotes: NoteDoc[]) => {
    const deletedColumn = await DeletedNoteColumnDatabase.getById(doc._id)
    if (!deletedColumn && doc && doc.external_id) {
      const newVersion = await NoteColumnServerService.delete(doc.external_id)

      if (newVersion !== null) {
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
        DeletedNoteColumnDatabase.putNew(doc)
        NoteService.putAllDeletedNoteDatabase(deletedNotes)
      }
    }
  }

  //#endregion

  //#region UPDATE

  checkTitleConflict = (localVersion: NoteColumnDoc, serverColumnsDocs: NoteColumnDoc[]): boolean => (
    serverColumnsDocs.some(serverColumn =>
      serverColumn.title === localVersion.title &&
      serverColumn.lastUpdate !== localVersion.lastUpdate &&
      serverColumn.external_id !== localVersion.external_id
    )
  )

  updateColumnsFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()

    if (newVersion > localVersion) {
      const serverData = await NoteColumnServerService.get()

      if (serverData) {
        let maxOrder = 0
        const deletedColumns = await this.getDeletedColumns()
        const serverColumns: NoteColumnDoc[] = []
        serverData.forEach((column) => {
          if (column.order > maxOrder) {
            maxOrder = column.order
          }
          const localDeleted = deletedColumns.find(
            (deletedColumn) => deletedColumn.external_id === column.id
          )
          if (localDeleted) {
            if (localDeleted.lastUpdate > column.lastUpdate) {
              return
            } else {
              DeletedNoteColumnDatabase.deleteByDoc(localDeleted)
            }
          }
          serverColumns.push({
            external_id: column.id,
            order: column.order,
            lastUpdate: column.lastUpdate,
            lastOrderUpdate: column.lastOrderUpdate,
            title: column.title,
            savedOnServer: true,
          } as NoteColumnDoc)
        })

        const localColumns = await this.getColumns()

        const mergedColumns: NoteColumnDoc[] = serverColumns

        for (const localVersion of localColumns) {
          const originalColumnTitle = localVersion.title

          let titleConflict = this.checkTitleConflict(localVersion, serverColumns)
          while (titleConflict) {
            localVersion.title = localVersion.title + NoteColumnConstants.SAME_TITLE_CONFLICT_DIFF
            localVersion._id = NoteColumnDatabase.getId(localVersion)
            titleConflict = this.checkTitleConflict(localVersion, serverColumns)
          }

          if (originalColumnTitle !== localVersion.title) {
            await NoteService.updateNoteColumnTitle(localVersion.title, originalColumnTitle)
          }

          const serverVersion = mergedColumns.find(serverColumn =>
            serverColumn.external_id === localVersion.external_id
          )
          
          if (serverVersion) {
            const localOrderMoreUpdated = localVersion.lastOrderUpdate > serverVersion.lastOrderUpdate

            const localDataMoreUpdated = localVersion.lastUpdate > serverVersion.lastUpdate

            serverVersion._id = localVersion._id

            if (localDataMoreUpdated) {
              serverVersion.title = localVersion.title
              serverVersion.lastUpdate = localVersion.lastUpdate
              serverVersion.savedOnServer = false
            } else if (serverVersion.title !== localVersion.title) {
              await NoteService.updateNoteColumnTitle(serverVersion.title, localVersion.title)
            }
            
            if (localOrderMoreUpdated) {
              serverVersion.lastOrderUpdate = localVersion.lastOrderUpdate
              serverVersion.order = localVersion.order
            }
          } else {
            const isUnsaved = !localVersion.savedOnServer

            if (isUnsaved) {
              maxOrder++

              localVersion.order = maxOrder
              
              mergedColumns.push(localVersion)
            }
          }
        }

        await NoteColumnDatabase.removeAll()
        await NoteColumnDatabase.putAll(mergedColumns)
        NoteService.updateContext()
        NoteColumnContextUpdater.update()
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  updateColumnsOrderFromServer = async (model: NoteColumnWebSocketAlertUpdateOrderModel) => {
    const docs = await this.getColumns()
    let updated = false

    docs.forEach(doc => {
      const serverItem = model.items.find(item => item.id === doc.external_id)
      if (serverItem) {
        const serverOrderMoreUpdated = serverItem.lastOrderUpdate > doc.lastOrderUpdate
        if (serverOrderMoreUpdated) {
          doc.order = serverItem.order
          doc.lastOrderUpdate = serverItem.lastOrderUpdate
          updated = true
        }
      }
    })

    if (updated) {
      await NoteColumnDatabase.putAll(docs)

      NoteColumnContextUpdater.update()
    }
  }

  updateDeletedColumnsFromServer = async (model: NoteColumnWebSocketAlertDeleteModel) => {
    const localVersion = this.getVersion()

    if (model.newVersion > localVersion) {
      let hasDeletedNotes: boolean = false

      for (const title of model.titleList) {
        const deletedNotes = await NoteService.deleteAllDatabaseNotesByColumnTitle(title)

        hasDeletedNotes = hasDeletedNotes || deletedNotes.length > 0
      }

      await NoteColumnDatabase.deleteByTitles(model.titleList)

      this.setVersion(model.newVersion)

      NoteColumnContextUpdater.update()

      if (hasDeletedNotes) {
        NoteService.updateContext()
      }
    }
  }

  //#endregion

  //#region SYNC

  shouldSync = (): boolean => {
    return NoteColumnSyncLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    NoteColumnSyncLocalStorage.setShouldSync(should)
  }

  //#endregion

  //#region VALIDATION

  titleAlreadyExists = async (title: string): Promise<boolean> => {
    const doc = await NoteColumnDatabase.getByTitle(title)

    if (doc) {
      return true
    }

    return false
  }

  //#endregion

  //#region CREATE

  createNewNoteColumnView = (
    title: string,
    order: number
  ): NoteColumnViewModel => ({
    lastUpdate: new Date().getTime(),
    lastOrderUpdate: new Date().getTime(),
    notes: [],
    order: order,
    savedOnServer: false,
    title: title,
    _rev: '',
    _id: ''
  })

  //#endregion
}

export default new NoteColumnService()
