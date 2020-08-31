import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import FaqWebSocketAlertUpdateModel from '../types/faq/FaqWebSocketAlertUpdateModel'
import Service from '../services/faq/FaqService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class FaqWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_FAQ_UPDATE,
      callback: (model: FaqWebSocketAlertUpdateModel) => {
        //se não for a faq do user que atualizou, não carrega dnv. 
        //"newId" só é chamado de novo pelo modelo dos alertas de topic na API, é pra validar o id nesse caso
        if(Service.getUserFaqId() === model.newId) { 
          if(Service.getVersion() !== model.newVersion) {
            Service.getUserFaqFromServer()
          }
        }
      },
    },
  ]
}

export default new FaqWebSocketSubscriber()
