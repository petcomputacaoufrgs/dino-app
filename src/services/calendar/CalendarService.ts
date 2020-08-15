import LanguageBase from "../../types/languages/LanguageBase"

class CalendarService {
    getEventTypeName = (type: number, language: LanguageBase) => {
        switch(type) {
            case 0:
                return language.MEDICAL_APPOINTMENT_TYPE
            case 1:
                return language.MEDICINE_TYPE
            default: 
                return language.INVALID_EVENT_TYPE
        }
    }
}

export default new CalendarService()