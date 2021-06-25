import ContactEntity from "../../types/contact/database/ContactEntity"
import EssentialContactEntity from "../../types/contact/database/EssentialContactEntity"
import ContactView, { ContactType, PhoneType } from "../../types/contact/view/ContactView"
import StringUtils from "../../utils/StringUtils"
import Utils from "../../utils/Utils"
import EssentialPhoneService from "./EssentialPhoneService"
import PhoneService from "./PhoneService"

	export const getContactWithSamePhone = (
		items: ContactView[],
		newPhones: PhoneType[],
		currentContact?: ContactView,
	): ContactView | undefined => {
		return items.find(
			item =>
				(!currentContact ||
					item.contact.localId !== currentContact.contact.localId) &&
				item.phones.some(phone =>
					newPhones.some(newPhone => newPhone.number.includes(phone.number)),
				),
		)
	}

	export const getContactViews = (
		contacts: ContactType[],
		phones: PhoneType[],
		isStaff: boolean
	): ContactView[] => {
		return contacts
			.map(
				contact =>
				({
					contact: contact,
					phones: isStaff ?
						EssentialPhoneService.filterByEssentialContact(
							contact as EssentialContactEntity, phones
						)
						: PhoneService.filterByContact(
							contact, phones
						)
				} as ContactView),
			)
			.sort((a, b) => contactViewSort(a, b, isStaff))
	}

	export const filterContactViews = (
		contacts: ContactView[],
		searchTerm: string,
	) => {
		return contacts.filter((item) => StringUtils.contains(item.contact.name, searchTerm))
	}

	export const contactViewSort = (a: ContactView, b: ContactView, isStaff: boolean) => {
		const bComesFirst = 1
		const aComesFirst = -1

		const sortByName = () => {
			return a.contact.name > b.contact.name ? bComesFirst : aComesFirst
		}

		if (!isStaff) {
			const aIsEssential = Utils.isNotEmpty((a.contact as ContactEntity).localEssentialContactId)
			const bIsEssential = Utils.isNotEmpty((b.contact as ContactEntity).localEssentialContactId)

			if (aIsEssential) {
				if (bIsEssential) {
					return sortByName()
				} else {
					return aComesFirst
				}
			} else if (bIsEssential) {
				return bComesFirst
			}
		}

		return sortByName()
	}
	
	export const cameFromEssential = (contact: ContactType) => Utils.isNotEmpty((contact as ContactEntity).localEssentialContactId)
	
	export const isUniversalEssential = (contact: ContactType) => Boolean((contact as EssentialContactEntity).isUniversal)