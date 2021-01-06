import { createContext, useContext } from 'react'
import GoogleContactService, {
  GoogleContactServiceImpl,
} from '../../../services/contact/GoogleContactService'
import GoogleContactModel from '../../../types/contact/api/GoogleContactDataModel'
import GoogleContactEntity from '../../../types/contact/database/GoogleContactEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

interface GoogleContactContextType
  extends SynchronizableContextType<
    number,
    GoogleContactModel,
    GoogleContactEntity,
    GoogleContactServiceImpl
  > {}

const GoogleContactContext = createContext<GoogleContactContextType>({
  service: GoogleContactService,
  loading: true,
  data: [],
})

const GoogleContactProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    GoogleContactModel,
    GoogleContactEntity,
    GoogleContactServiceImpl
  >({
    children: children,
    context: GoogleContactContext,
    service: GoogleContactService,
  })

export const useGoogleContact = () => useContext(GoogleContactContext)

export default GoogleContactProvider
