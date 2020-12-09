import Dexie, { IndexableType, IndexableTypePart } from 'dexie'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableLocalState from '../../../types/synchronizable/database/SynchronizableLocalState'

/**
 * Generic repository of synchronizable entity
 * @param ID API synchronizable entity's id
 * @param ENTITY local synchronizable entity
 */
export default abstract class SynchronizableRepository<
  ID extends IndexableType,
  LOCAL_ID extends IndexableTypePart,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>
> {
  protected table: Dexie.Table<ENTITY, LOCAL_ID>

  constructor(table: Dexie.Table<ENTITY, LOCAL_ID>) {
    this.table = table
  }

  async getAllById(entities: ENTITY[]): Promise<ENTITY[]> {
    const ids = entities
      .filter((entity) => entity.id !== undefined)
      .map((entity) => entity.id!)
    return this.table.where('id').anyOf(ids).toArray()
  }

  async getAllNotFakeDeleted(): Promise<ENTITY[]> {
    return this.table
      .where('localState')
      .notEqual(SynchronizableLocalState.DELETED_LOCALLY)
      .toArray()
  }

  async getAllFakeDeleted(): Promise<ENTITY[]> {
    return this.table
      .where('localState')
      .equals(SynchronizableLocalState.DELETED_LOCALLY)
      .toArray()
  }

  async getAllNotSavedOnAPI(): Promise<ENTITY[]> {
    return this.table
      .where('localState')
      .equals(SynchronizableLocalState.SAVED_LOCALLY)
      .toArray()
  }

  async save(entity: ENTITY): Promise<ENTITY> {
    const localId = await this.table.put(entity)

    entity.localId = localId

    return entity
  }

  async saveAll(entities: ENTITY[]) {
    await this.table.bulkPut(entities)
  }

  async delete(entity: ENTITY) {
    if (entity.localId) {
      await this.deleteByLocalId(entity.localId)
    }
  }

  async deleteByLocalId(localId: LOCAL_ID) {
    if (localId) {
      this.table.delete(localId)
    }
  }

  async deleteByLocalIds(localIds: LOCAL_ID[]) {
    await this.table.bulkDelete(localIds)
  }

  async fakeDelete(entity: ENTITY): Promise<number> {
    if (entity.localId) {
      return await this.table
        .where('localId')
        .equals(entity.localId)
        .modify((item) => {
          item.localState = SynchronizableLocalState.DELETED_LOCALLY
          item.lastUpdate = entity.lastUpdate
        })
    }

    return 0
  }

  async fakeDeleteAll(entities: ENTITY[], lastUpdate: Date): Promise<number> {
    const entitiesIds = entities.filter(entity => entity.localId !== undefined).map(entity => entity.localId!)
    return await this.table
      .where('localId')
      .anyOf(entitiesIds)
      .modify((item) => {
        item.localState = SynchronizableLocalState.DELETED_LOCALLY
        item.lastUpdate = lastUpdate
      })
  }

  async deleteAllFakeDeleteds() {
    return await this.table
      .where('localState')
      .equals(SynchronizableLocalState.DELETED_LOCALLY)
      .delete()
  }

  async deleteAllById(ids: ID[]) {
    return this.table.where('id').anyOf(ids).delete()
  }

  async deleteAllByLocalIds(ids: LOCAL_ID[]) {
    return this.table.where('localId').anyOf(ids).delete()
  }

  async clear() {
    return this.table.clear()
  }
}
