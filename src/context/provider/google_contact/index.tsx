import { createContext, useContext } from "react"
import GoogleContactService, { GoogleContactServiceImpl } from "../../../services/contact/GoogleContactService"
import { GoogleContactRepositoryImpl } from "../../../storage/database/contact/GoogleContactRepository"
import GoogleContactModel from "../../../types/contact/api/GoogleContactModel"
import GoogleContactEntity from "../../../types/contact/database/GoogleContactEntity"
import SynchronizableProvider from "../synchronizable"
import SynchronizableContextType from "../synchronizable/context"

export interface GoogleContactContextType
  extends SynchronizableContextType<
    number,
    number,
    GoogleContactModel,
    GoogleContactEntity,
    GoogleContactRepositoryImpl,
    GoogleContactServiceImpl
  > {}

const GoogleContactContext = createContext<GoogleContactContextType>({
  service: GoogleContactService,
  loading: true,
  data: [],
})

const GoogleContactProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    GoogleContactModel,
    GoogleContactEntity,
    GoogleContactRepositoryImpl,
    GoogleContactServiceImpl
  >({
    children: children,
    context: GoogleContactContext,
    service: GoogleContactService,
  })

  export const useGoogleContact = () => useContext(GoogleContactContext)

  export default GoogleContactProvider
