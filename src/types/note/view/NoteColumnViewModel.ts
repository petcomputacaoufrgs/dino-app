import NoteColumnDoc from "../database/NoteColumnDoc"
import NoteViewModel from "./NoteViewModel"

export interface NoteColumnViewModel extends NoteColumnDoc {
  notes: NoteViewModel[]
}