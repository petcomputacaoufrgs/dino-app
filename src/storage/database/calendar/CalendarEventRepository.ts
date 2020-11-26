import DinoDatabase from "../DinoDatabase"
import CalendarEventEntity from "../../../types/calendar/database/CalendarEventEntity"

class CalendarEventRepository {
    private table = DinoDatabase.calendarEvent

    putAll = async (entities: CalendarEventEntity[]) => {
        const ids = await DinoDatabase.transaction(
            'readwrite',
            this.table,
            () => Promise.all(entities.map((entity) => this.table.put(entity)))
        )

        entities.forEach((entity, index) => (entity.id = ids[index]))
    }

    getByDate = async (init_date: Date, end_date: Date): Promise<CalendarEventEntity[]> => {
        const calendarEvents = await this.table.where('init_date').aboveOrEqual(init_date)
            .and(event => event.end_date <= end_date).toArray()

        return calendarEvents
    }

    async deleteAll() {
        return this.table.clear()
    }

}

export default new CalendarEventRepository()
