import NoteTagAPIModel from './NoteTagAPIModel'

export default interface NoteSaveResponseAPIModel {
    version: number

    noteId: number

    newTags: NoteTagAPIModel[]
}