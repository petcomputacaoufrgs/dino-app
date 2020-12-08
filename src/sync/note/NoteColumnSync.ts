import NoteColumnService from "../../services/note/NoteColumnService"
import { NoteColumnRepositoryImpl } from "../../storage/database/note/NoteColumnRepository"
import NoteColumnDataModel from "../../types/note/api/NoteColumnDataModel"
import NoteColumnEntity from "../../types/note/database/NoteColumnEntity"
import SynchronizableSync from "../synchronizable/SynchronizableSync"

class NoteColumnSync extends SynchronizableSync<
  number,
  number,
  NoteColumnDataModel,
  NoteColumnEntity,
  NoteColumnRepositoryImpl
> {}

export default new NoteColumnSync(NoteColumnService)