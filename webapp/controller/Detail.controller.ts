import BaseController from "./BaseController";
import RouterConfig from "sov/comp/amalitech/forum/utils/RouterConfig";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Event from "sap/ui/base/Event";
import {GetUserDetails} from "sov/comp/amalitech/forum/formatter/GeneralFormatter";
import FeedListItem from "sap/m/FeedListItem";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace sov.comp.amalitech.forum.controller
 */

export default class Detail extends BaseController {
  onInit(): void {
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.getRoute(RouterConfig.detail).attachPatternMatched(this._OnObjectMatched, this)
  }
  //@ts-ignore
  _OnObjectMatched(oEvent): void {
    this.getView().unbindElement("generalThread")
    const sPath = window.decodeURIComponent(oEvent.getParameter("arguments").threadID);
    this.getView().bindElement({
      path: '/' + sPath,
      model: 'generalThread',
      parameters: {expand: "ans"}
    })
  }

  async getAuthorName(id: string, dcb?: string): Promise<string> {
    // console.log("dcb -->>> " + dcb)
    return GetUserDetails(id, this.getModel("generalThread") as ODataModel).then(_auth=>_auth.name)
  }

}