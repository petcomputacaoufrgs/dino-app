import NoteColumnSyncChangedRequestModel from './NoteColumnChangedRequestModel'
import NoteColumnSaveRequestModel from '../../save/NoteColumnSaveRequestModel'
import NoteColumnSyncDeleteRequestModel from './NoteColumnSyncDeleteRequestModel'
import NoteColumnSyncOrderRequestModel from './NoteColumnSyncOrderRequestModel'

export default interface NoteColumnSyncRequestModel {
  changedColumns: NoteColumnSyncChangedRequestModel[]
  newColumns: NoteColumnSaveRequestModel[]
  deletedColumns: NoteColumnSyncDeleteRequestModel[]
  columnsOrder: NoteColumnSyncOrderRequestModel[]
}
