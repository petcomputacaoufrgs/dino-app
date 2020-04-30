import NoteTagAPIModel from './NoteTagAPIModel'

export default interface NoteSaveResponseAPIModel {
    version: number

    tags: NoteTagAPIModel[]
}