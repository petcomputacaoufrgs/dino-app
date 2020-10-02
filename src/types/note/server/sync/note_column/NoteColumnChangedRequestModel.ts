import NoteColumnSaveRequestModel from '../../save/NoteColumnSaveRequestModel'

export default interface NoteColumnSyncChangedRequestModel
  extends NoteColumnSaveRequestModel {
  id: number
}
