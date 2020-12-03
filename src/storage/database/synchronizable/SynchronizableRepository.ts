import Dexie, { IndexableType } from 'dexie'
import DinoDatabase from '../DinoDatabase'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableLocalState from '../../../types/synchronizable/database/SynchronizableLocalState'

/**
 * Generic repository of synchronizable entity
 * @param ID API synchronizable entity's id
 * @param LOCAL_ID local synchronizable entity's id
 * @param ENTITY local synchronizable entity
 */
export default abstract class SynchronizableRepository<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>
> {
  private table: Dexie.Table<ENTITY, LOCAL_ID>

  constructor(table: Dexie.Table<ENTITY, LOCAL_ID>) {
    this.table = table
  }

  public needSync = async (): Promise<boolean> => {
    const unsynchronizedCount = await this.table
      .where(['localState'])
      .notEqual(SynchronizableLocalState.SAVED_ON_API)
      .count()

    return unsynchronizedCount > 0
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
      .notEqual(SynchronizableLocalState.DELETED_LOCAL)
      .toArray()
  }

  async getAllFakeDeleted(): Promise<ENTITY[]> {
    return this.table
      .where('localState')
      .equals(SynchronizableLocalState.DELETED_LOCAL)
      .toArray()
  }

  async getAllNotSavedOnAPI(): Promise<ENTITY[]> {
    return this.table
      .where('localState')
      .equals(SynchronizableLocalState.SAVED_LOCAL)
      .toArray()
  }

  async save(entity: ENTITY): Promise<ENTITY> {
    const localId = await this.table.put(entity)

    entity.localId = localId

    return entity
  }

  async saveAll(entities: ENTITY[]): Promise<ENTITY[]> {
    const localIds = await DinoDatabase.transaction(
      'readwrite',
      this.table,
      () =>
        Promise.all(
          entities.map(async (entity) => {
            return this.table.put(entity)
          })
        )
    )

    entities.forEach((entity, index) => (entity.localId = localIds[index]))

    return entities
  }

  async delete(entity: ENTITY): Promise<number> {
    if (entity.localId) {
      return await this.deleteByLocalId(entity.localId)
    }

    return 0
  }

  async deleteByLocalId(localId: LOCAL_ID): Promise<number> {
    if (localId) {
      return this.table.where('localId').equals(localId).delete()
    }

    return 0
  }

  async deleteByLocalIds(localIds: LOCAL_ID[]): Promise<number> {
    return this.table.where('localId').anyOf(localIds).delete()
  }

  async fakeDelete(entity: ENTITY): Promise<number> {
    if (entity.localId) {
      return await this.table
        .where('localId')
        .equals(entity.localId)
        .modify((item) => {
          item.localState = SynchronizableLocalState.DELETED_LOCAL
        })
    }

    return 0
  }

  async deleteAllFakeDeleteds(): Promise<number> {
    return this.table
      .where('localState')
      .equals(SynchronizableLocalState.DELETED_LOCAL)
      .delete()
  }

  async deleteAllById(ids: ID[]): Promise<number> {
    return this.table.where('ids').anyOf(ids).delete()
  }

  async clear() {
    return this.table.clear()
  }
}
