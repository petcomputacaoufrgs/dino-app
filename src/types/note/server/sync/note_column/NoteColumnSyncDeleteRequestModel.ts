import NoteColumnDeleteRequestModel from '../../delete/NoteColumnDeleteRequestModel'

export default interface NoteColumnSyncDeleteRequestModel
  extends NoteColumnDeleteRequestModel {
  lastUpdate: number
}
