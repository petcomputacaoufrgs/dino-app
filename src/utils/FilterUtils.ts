import { LanguageContextType } from "../context/language"
import { cameFromEssential, isUniversalEssential } from "../services/contact/ContactViewService"
import { ContactType } from "../types/contact/view/ContactView"
import TreatmentView from "../types/faq/view/TreatmentView"
import FilterType from "../types/filter/Filter"
import ArrayUtils from "./ArrayUtils"

	export const getContactFilter = (hasStaffPowers: boolean, language: LanguageContextType) => {
	
		const userFilter: FilterType[] = [
			{
				checked: true,
				label: language.data.ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => cameFromEssential(c)
			},
			{
				checked: true,
				label: language.data.YOUR_CONTACTS,
				validator: (c: ContactType) => !cameFromEssential(c)
			}
		]
	
		const staffFilter: FilterType[] = [
			{
				checked: true,
				label: language.data.UNIVERSAL_ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => isUniversalEssential(c)
			},
			{
				checked: true,
				label: language.data.TREATMENT_ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => !isUniversalEssential(c)
			}
		]
	
		return hasStaffPowers ? staffFilter : userFilter
	}
  
	export const getTreatmentFilter = (language: LanguageContextType) => {
	
		return [
			{
				checked: false,
				label: language.data.HAS_USER_QUESTIONS_ONLY,
				validator: (t?: TreatmentView) => ArrayUtils.isNotEmpty(t?.questions)
			}
		] as FilterType[]
	}