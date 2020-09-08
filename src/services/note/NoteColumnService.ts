import NoteColumnDoc from "../../types/note/database/NoteColumnDoc"
import NoteColumnDatabase from "../../database/note/NoteColumnDatabase"
import DeletedNoteColumnDatabase from "../../database/note/DeletedNoteColumnDatabase"
import NoteColumnVersionLocalStorage from "../../local_storage/note/NoteColumnVersionLocalStorage"
import NoteColumnServerService from "./NoteColumnServerService"
import NoteColumnSyncLocalStorage from "../../local_storage/note/NoteColumnSyncLocalStorage"
import NoteColumnContextUpdater from "../../context_updater/NoteColumnContextUpdater"
import StringUtils from "../../utils/StringUtils"
import NoteContextUpdater from "../../context_updater/NoteContextUpdater"

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

  saveColumn = async (doc: NoteColumnDoc) => {
    doc.savedOnServer = false
    doc.lastUpdate = new Date().getTime()

    await NoteColumnDatabase.put(doc)

    NoteColumnContextUpdater.update()

    this.saveColumnOnServer(doc)
  }

  saveColumnOnServer = async (doc: NoteColumnDoc) => {
    const newVersion = await NoteColumnServerService.save(doc)

    if (newVersion) {
      this.setVersion(newVersion)
      NoteContextUpdater.update()
    } else {
      this.setShouldSync(true)
    }
  }

  saveColumnsOnServer = async (docs: NoteColumnDoc[]) => {
    const newVersion = await NoteColumnServerService.saveAll(docs)

    if (newVersion) {
      this.setVersion(newVersion)
      NoteContextUpdater.update()
    } else {
      this.setShouldSync(true)
    }
  }

  saveColumnsOrder = async (docs: NoteColumnDoc[]) => {
    if (docs.length > 0) {
      docs.forEach((noteDoc, index) => {
        noteDoc.order = index
      })

      await NoteColumnDatabase.putAll(docs)

      this.saveColumnsOrderOnServer(docs)
    }
  }

  saveColumnsOrderOnServer = async (docs: NoteColumnDoc[]): Promise<void> => {
    const newVersion = await NoteColumnServerService.saveOrder(docs)

    if (newVersion) {
      this.setVersion(newVersion)
    } else {
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
    await NoteColumnDatabase.deleteByDoc(doc)

    NoteColumnContextUpdater.update()

    if (doc.external_id) {
      const deletedNote = await DeletedNoteColumnDatabase.getByDoc(doc)
      if (!deletedNote) {
        await DeletedNoteColumnDatabase.putNew(doc)
        this.deleteColumnOnServer(doc)
      }
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

  private deleteColumnOnServer = async (doc: NoteColumnDoc) => {
    if (doc.external_id) {
      const newVersion = await NoteColumnServerService.delete(doc.external_id)

      if (newVersion) {
        DeletedNoteColumnDatabase.deleteByDoc(doc)
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  //#endregion

  //#region UPDATE

  updateColumnsFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()

    if (newVersion > localVersion) {
      const serverColumns = await NoteColumnServerService.get()

      if (serverColumns) {
        let maxOrder = 0

        const deletedColumns = await this.getDeletedColumns()
        const serverColumnsDocs: NoteColumnDoc[] = []

        serverColumns.forEach((serverColumn) => {
          if (serverColumn.order > maxOrder) {
            maxOrder = serverColumn.order
          }

          const localDeletedSearch = deletedColumns.filter(
            (deletedColumn) => deletedColumn.external_id === serverColumn.id
          )

          if (localDeletedSearch.length > 0) {
            const localDeleted = localDeletedSearch[0]
            if (localDeleted.lastUpdate > serverColumn.lastUpdate) {
              return
            } else {
              DeletedNoteColumnDatabase.deleteByDoc(localDeleted)
            }
          }

          serverColumnsDocs.push({
            external_id: serverColumn.id,
            order: serverColumn.order,
            lastUpdate: serverColumn.lastUpdate,
            title: serverColumn.title,
            savedOnServer: true,
          } as NoteColumnDoc)
        })

        const localColumns = await this.getColumns()

        await NoteColumnDatabase.removeAll()

        await NoteColumnDatabase.putAll(serverColumnsDocs)

        const newColumns = localColumns.filter((doc) => {
          const serverVersionSearch = serverColumnsDocs.filter((serverColumn) =>
            StringUtils.areEqual(serverColumn.title, doc.title)
          )
          if (serverVersionSearch.length > 0) {
            const serverVersion = serverVersionSearch[0]
            if (serverVersion.lastUpdate > doc.lastUpdate) {
              return serverVersion
            }
          }
          maxOrder++
          return {
            title: doc.title,
            lastUpdate: doc.lastUpdate,
            savedOnServer: doc.savedOnServer,
            order: maxOrder,
            external_id: doc.external_id,
          } as NoteColumnDoc
        })

        await NoteColumnDatabase.putAll(newColumns)

        this.setVersion(newVersion)

        NoteColumnContextUpdater.update()
      } else {
        this.setShouldSync(true)
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
}

export default new NoteColumnService()