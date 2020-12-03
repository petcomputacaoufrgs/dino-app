import Dexie, { IndexableType } from 'dexie'
import DinoDatabase from "../DinoDatabase"
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'

//TODO: Remover métodos não utilizados
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

  async getByLocalId(localId: LOCAL_ID): Promise<ENTITY | undefined> {
    return this.table.where('localId').equals(localId).first()
  }

  async getAllByLocalId(localIds: LOCAL_ID[]): Promise<ENTITY[]> {
    return this.table.where('localId').anyOf(localIds).toArray()
  }

  async getAll(): Promise<ENTITY[]> {
    return this.table.toArray()
  }

  async getAllNotDeleted(): Promise<ENTITY[]> {
    return this.table.where('deleted').equals(0).toArray()
  }

  async getAllDeleted(): Promise<ENTITY[]> {
    return this.table.where('deleted').equals(1).toArray()
  }

  async getAllNotSavedOnAPI(): Promise<ENTITY[]> {
    return this.table.where('savedOnAPI').equals(0).toArray()
  }

  async saveId(
    localId: LOCAL_ID,
    id: ID,
  ): Promise<number> {
    return await this.table
      .where('localId')
      .equals(localId)
      .modify((item) => {
        item.id = id
      })
  }

  async save(entity: ENTITY): Promise<ENTITY> {
    const localId = await this.table.put(entity)

    entity.localId = localId

    return entity
  }

  async saveAll(entities: ENTITY[]): Promise<ENTITY[]> {
    const localIds = await DinoDatabase.transaction('readwrite', this.table, () =>
      Promise.all(entities.map((entity) => this.table.put(entity)))
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

  async deleteById(id: ID): Promise<number> {
    return this.table.where('id').equals(id).delete()
  }

  async deleteByIds(ids: ID[]): Promise<number> {
    return this.table.where('id').anyOf(ids).delete()
  }

  async deleteAll(entities: ENTITY[]): Promise<number> {
    const ids: LOCAL_ID[] = entities
      .filter((entity) => entity.localId)
      .map((entity) => entity.localId!)

    return await this.deleteByLocalIds(ids)
  }

  async fakeDelete(entity: ENTITY): Promise<number> {
    if (entity.localId) {
        return await this.table
          .where('localId')
          .equals(entity.localId)
          .modify((item) => {
            item.deleted = 1
          })
    }

    return 0
  }

  async fakeDeleteAll(entities: ENTITY[]): Promise<number> {
    const localIds = entities
      .filter((entity) => entity.localId)
      .map((entity) => entity.localId!)

    return await this.table
      .where('localId')
      .anyOf(localIds)
      .modify((item) => {
        item.deleted = 1
      })
  }

  async deleteAllFakeDeleteds(): Promise<number> {
    return this.table.where('deleted').equals(1).delete()
  }

  async clear() {
    return this.table.clear()
  }
}