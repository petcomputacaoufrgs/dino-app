import GlossaryItemEntity from "../../../types/glossary/database/GlossaryItemEntity"
import SynchronizableRepository from "../synchronizable/SynchronizableRepository"
import Database from "../Database"

export class GlossaryRepositoryImpl extends SynchronizableRepository<number, number, GlossaryItemEntity> {}

export default new GlossaryRepositoryImpl(Database.glossary)