import BaseLocalStorage from "../BaseLocalStorage"

class FilterLocalStorage extends BaseLocalStorage {

  CONTACT = 'filter__contact_list'
  TREATMENT = 'filter__treatment_list'

  getContactFilterAdress = (staff?: boolean) => this.CONTACT + staff ? "__staff" : "__user"

  setContactFilters = (filters: boolean[], staff?: boolean) => {
    this.set(this.getContactFilterAdress(staff), JSON.stringify(filters))
  }

  getContactFilters = (staff?: boolean): boolean[] => {
    const filters = this.get(this.getContactFilterAdress(staff))

    return filters ? JSON.parse(filters) : []
  }
} 
export default new FilterLocalStorage()