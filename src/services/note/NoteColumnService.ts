import NoteColumnVersionLocalStorage from '../../local_storage/note/NoteColumnVersionLocalStorage'
import NoteColumnServerService from './NoteColumnServerService'
import NoteColumnSyncLocalStorage from '../../local_storage/note/NoteColumnSyncLocalStorage'
import NoteColumnContextUpdater from '../../context_updater/NoteColumnContextUpdater'
import NoteService from './NoteService'
import NoteColumnWebSocketAlertUpdateOrderModel from '../../types/note/web_socket/NoteColumnWebSocketAlertUpdateOrderModel'
import NoteColumnWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteColumnWebSocketAlertDeleteModel'
import NoteColumnConstants from '../../constants/note/NoteColumnConstants'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import NoteColumnDatabaseService from './NoteColumnDatabaseService'
import DeletedNoteColumnDatabaseService from './DeletedNoteColumnDatabaseService'
import NoteColumnLocalStorageService from './NoteColumnLocalStorageService'
import DeletedNoteColumnEntity from '../../types/note/database/DeletedNoteColumnEntity'

class NoteColumnService {
  //#region GET
  
  getColumns = async (): Promise<NoteColumnEntity[]> => {
    return NoteColumnDatabaseService.getAll()
  }

  getDeletedColumns = async (): Promise<DeletedNoteColumnEntity[]> => {
    return DeletedNoteColumnDatabaseService.getAll()
  }

  getVersion = (): number => NoteColumnVersionLocalStorage.getVersion()

  getVersionFromServer = async (): Promise<number | undefined> => {
    return NoteColumnServerService.getVersion()
  }

  //#endregion

  //#region SYNC
  setShouldSync = (shoudSync: boolean) => {
    NoteColumnLocalStorageService.setShouldSync(shoudSync)
  }
  //

  //#region SAVE

  saveColumn = async (changedColumn: NoteColumnEntity, oldTitle?: string) => {
    if (oldTitle && changedColumn.id) {
      await NoteService.updateNoteColumnTitle(changedColumn.title, oldTitle)

      const savedColumn = await NoteColumnDatabaseService.getById(changedColumn.id)

      if (savedColumn) {
        savedColumn.lastUpdate = new Date().getTime()
        savedColumn.savedOnServer = false
        savedColumn.title = changedColumn.title
        
        await NoteColumnDatabaseService.put(savedColumn)
        
        NoteService.updateContext()
        this.saveColumnOnServer(savedColumn)
      }
    } else {
      const newColumn: NoteColumnEntity = {
        lastUpdate: new Date().getTime(),
        savedOnServer: false,
        title: changedColumn.title,
        lastOrderUpdate: new Date().getTime(),
        order: changedColumn.order,
      }

      await NoteColumnDatabaseService.put(newColumn)
      this.saveColumnOnServer(newColumn)
    }

    this.updateContext()
  }

  saveColumnOnServer = async (column: NoteColumnEntity) => {
    const response = await NoteColumnServerService.save(column)
    
    if (response && column.id) {
      await NoteColumnDatabaseService.saveExternalIdByIdAndSavedOnServer(column.id, response.id, true)
      NoteColumnLocalStorageService.setVersion(response.version)
      this.updateContext()
    } else {
      NoteColumnLocalStorageService.setShouldSync(true)
    }
  }

  saveColumnsOnServer = async (columns: NoteColumnEntity[]) => {
    if (columns.length > 0) {
      const response = await NoteColumnServerService.saveAll(columns)

      if (response) {
        for (const item of response.items) {
          const savedColumn = columns.find(column => column.title === item.title)
          if (savedColumn && savedColumn.id) {
            await NoteColumnDatabaseService.saveExternalIdByIdAndSavedOnServer(savedColumn.id, item.id, true)
          }
        }
        NoteColumnLocalStorageService.setVersion(response.newVersion)
        this.updateContext()
      } else {
        NoteColumnLocalStorageService.setShouldSync(true)
      }
    }
  }

  saveColumnsOrder = async (columns: NoteColumnEntity[]) => {
    if (columns.length > 0) {
      const savedColumn = await this.getColumns()
      columns.forEach((column, index) => {
        const updatedColumn = savedColumn.find(c => c.title === column.title)

        if (updatedColumn) {
          updatedColumn.order = index
          updatedColumn.lastOrderUpdate = new Date().getTime()
        }
      })
      
      await NoteColumnDatabaseService.putAll(savedColumn)

      this.saveColumnsOrderOnServer(savedColumn)

      this.updateContext()
    }
  }

  saveColumnsOrderOnServer = async (columns?: NoteColumnEntity[]): Promise<void> => {
    if (!columns) {
      columns = await this.getColumns()
    }

    const success = await NoteColumnServerService.saveOrder(columns)

    if (!success) {
      NoteColumnLocalStorageService.setShouldSync(true)
    }
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteColumnVersionLocalStorage.removeUserData()
    NoteColumnSyncLocalStorage.removeUserData()
    NoteColumnDatabaseService.deleteAll()
    DeletedNoteColumnDatabaseService.deleteAll()
  }

  deleteColumn = async (column: NoteColumnEntity) => {
    if (column.id) {
      const savedColumn = await NoteColumnDatabaseService.getById(column.id)
      if (savedColumn) {
        await NoteService.deleteAllDatabaseNotesByColumnTitle(savedColumn.title)
        await NoteColumnDatabaseService.deleteById(column.id)
        this.updateContext()

        this.deleteColumnOnServer(savedColumn)
      }
    }
  }

  deleteColumnsOnServer = async () => {
    const deletedColumns = await this.getDeletedColumns()
    if (deletedColumns.length > 0) {
      const newVersion = await NoteColumnServerService.deleteAll(deletedColumns)

      if (newVersion !== undefined) {
        DeletedNoteColumnDatabaseService.deleteAll()
        NoteColumnLocalStorageService.setVersion(newVersion)
      } else {
        NoteColumnLocalStorageService.setShouldSync(true)
      }
    }
  }

  private deleteColumnOnServer = async (column: NoteColumnEntity) => {
    if (column.id) {
      const deletedColumn = await DeletedNoteColumnDatabaseService.getById(column.id)
      if (!deletedColumn && column && column.external_id) {
        const newVersion = await NoteColumnServerService.delete(column.external_id)

        if (newVersion !== null) {
          NoteColumnLocalStorageService.setVersion(newVersion)
        } else {
          column.lastUpdate = new Date().getTime()
          NoteColumnLocalStorageService.setShouldSync(true)
          DeletedNoteColumnDatabaseService.add(column)
        }
      }
    }
  }

  //#endregion

  //#region UPDATE

  updateContext = () => {
    NoteColumnContextUpdater.update()
  }

  checkTitleConflict = (localVersion: NoteColumnEntity, serverColumnsDocs: NoteColumnEntity[]): boolean => (
    serverColumnsDocs.some(serverColumn =>
      serverColumn.title === localVersion.title &&
      serverColumn.lastUpdate !== localVersion.lastUpdate &&
      serverColumn.external_id !== localVersion.external_id
    )
  )

  updateColumnsFromServer = async (newVersion: number, force?: boolean) => {
    const localVersion = NoteColumnLocalStorageService.getVersion()
    if (newVersion > localVersion || force) {
      const serverData = await NoteColumnServerService.get()

      if (serverData) {
        let maxOrder = 0
        const deletedColumns = await this.getDeletedColumns()
        const serverColumns: NoteColumnEntity[] = []
        serverData.forEach((column) => {
          if (column.order > maxOrder) {
            maxOrder = column.order
          }
          const localDeleted = deletedColumns.find(
            (deletedColumn) => deletedColumn.external_id === column.id
          )
          if (localDeleted) {
            const serverMoreUpdated = column.lastUpdate>= localDeleted.lastUpdate
            if (serverMoreUpdated && localDeleted.id !== undefined) {
              DeletedNoteColumnDatabaseService.deleteById(localDeleted.id)
            } else {
              return
            }
          }
          serverColumns.push({
            external_id: column.id,
            order: column.order,
            lastUpdate: column.lastUpdate,
            lastOrderUpdate: column.lastOrderUpdate,
            title: column.title,
            savedOnServer: true,
          } as NoteColumnEntity)
        })

        const localColumns = await this.getColumns()

        const mergedColumns: NoteColumnEntity[] = serverColumns

        const idsOfDeletedColumnsOnServer: number[] = []

        for (const localVersion of localColumns) {
          const originalColumnTitle = localVersion.title

          let titleConflict = this.checkTitleConflict(localVersion, serverColumns)
          while (titleConflict) {
            localVersion.title = localVersion.title + NoteColumnConstants.SAME_TITLE_CONFLICT_DIFF
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

            serverVersion.id = localVersion.id

            if (localDataMoreUpdated) {
              serverVersion.title = localVersion.title
              serverVersion.lastUpdate = localVersion.lastUpdate
              serverVersion.savedOnServer = false
            } else {
              const serverTitleChanged = serverVersion.title !== localVersion.title
              if (serverTitleChanged) {
                await NoteService.updateNoteColumnTitle(serverVersion.title, localVersion.title)
              }
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
            } else if (localVersion.id) {
              idsOfDeletedColumnsOnServer.push(localVersion.id)
            }
          }
        }
        await NoteColumnDatabaseService.deleteAllById(idsOfDeletedColumnsOnServer)
        await NoteColumnDatabaseService.putAll(mergedColumns)
        NoteColumnLocalStorageService.setVersion(newVersion)
        NoteService.updateContext()
        this.updateContext()
      } else {
        NoteColumnLocalStorageService.setShouldSync(true)
      }
    }
  }

  updateColumnsOrderFromServer = async (model: NoteColumnWebSocketAlertUpdateOrderModel) => {
    const notes = await this.getColumns()
    let updated = false

    notes.forEach(note => {
      const serverItem = model.items.find(item => item.id === note.external_id)
      if (serverItem) {
        const serverOrderMoreUpdated = serverItem.lastOrderUpdate > note.lastOrderUpdate
        if (serverOrderMoreUpdated) {
          note.order = serverItem.order
          note.lastOrderUpdate = serverItem.lastOrderUpdate
          updated = true
        }
      }
    })

    if (updated) {
      await NoteColumnDatabaseService.putAll(notes)

      this.updateContext()
    }
  }

  updateDeletedColumnsFromServer = async (model: NoteColumnWebSocketAlertDeleteModel) => {
    const localVersion = this.getVersion()

    if (model.newVersion > localVersion) {
      let hasDeletedNotes: boolean = false

      for (const externalId of model.idList) {
        const deletedColumn = await NoteColumnDatabaseService.deleteByExternalId(externalId)
        if (deletedColumn) {
          const deletedNotes = await NoteService.deleteAllDatabaseNotesByColumnTitle(deletedColumn.title)

          if (!hasDeletedNotes && deletedNotes.length > 0) {
            hasDeletedNotes = true
          }
        }
      }

      NoteColumnLocalStorageService.setVersion(model.newVersion)

      this.updateContext()

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

  //#endregion

  //#region VALIDATION

  titleAlreadyExists = async (title: string): Promise<boolean> => {
    const column = await NoteColumnDatabaseService.getByTitle(title)

    if (column) {
      return true
    }

    return false
  }

  //#endregion

  //#region CREATE

  createNewNoteColunmEntity = (
    title: string,
    order: number
  ): NoteColumnEntity => ({
    lastUpdate: new Date().getTime(),
    lastOrderUpdate: new Date().getTime(),
    order: order,
    savedOnServer: false,
    title: title,
  })

  //#endregion
}

export default new NoteColumnService()
