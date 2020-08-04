export default class DatabaseDeleteWithoutID extends Error {
  constructor(database: string, doc: PouchDB.Core.GetMeta) {
    super(
      `Trying to delete item without ID in database: ${database}. Item: ${JSON.stringify(
        doc
      )}`
    )
  }
}
