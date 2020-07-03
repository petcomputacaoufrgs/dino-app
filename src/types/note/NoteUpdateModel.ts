import NoteQuestionModel from './NoteQuestionModel'

export default interface NoteUpdateModel extends NoteQuestionModel {
  answer: string
}
