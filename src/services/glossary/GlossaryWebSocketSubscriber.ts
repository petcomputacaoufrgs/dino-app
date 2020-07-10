import BaseWebSocketSubscriber from "../BaseWebSocketSubscriber";
import DinoAPIWebSocketConstants from "../../constants/dino_api/DinoAPIWebSocketConstants";
import GlossaryWebSocketUpdateModel from "../../types/glossary/GlossaryWebSocketUpdateModel";
import GlossaryService from "./GlossaryService";

class GlossaryWebSocketSubscriber implements BaseWebSocketSubscriber {
    path: string = DinoAPIWebSocketConstants.GLOSSARY

    callback = (model: GlossaryWebSocketUpdateModel) => {
        GlossaryService.update(model.newVersion)
    }
}

export default new GlossaryWebSocketSubscriber()