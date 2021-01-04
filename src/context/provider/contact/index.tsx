import React, { createContext, useContext } from 'react'
import ContactService, {
  ContactServiceImpl,
} from '../../../services/contact/ContactService'
import { ContactRepositoryImpl } from '../../../storage/database/contact/ContactRepository'
import ContactDataModel from '../../../types/contact/api/ContactDataModel'
import ContactEntity from '../../../types/contact/database/ContactEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

interface ContactContextType
  extends SynchronizableContextType<
    number,
    ContactDataModel,
    ContactEntity,
    ContactRepositoryImpl,
    ContactServiceImpl
  > {}

const ContactContext = createContext<ContactContextType>({
  service: ContactService,
  loading: true,
  data: [],
})

const ContactProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    ContactDataModel,
    ContactEntity,
    ContactRepositoryImpl,
    ContactServiceImpl
  >({
    children: children,
    context: ContactContext,
    service: ContactService,
  })

export const useContact = () => useContext(ContactContext)

export default ContactProvider
