import BaseController from "./BaseController";
import RouterConfig from "sov/comp/amalitech/forum/utils/RouterConfig";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import {GetUserDetails} from "sov/comp/amalitech/forum/formatter/GeneralFormatter";
import Control from "sap/ui/core/Control";
import Dialog from "sap/m/Dialog";
import {IAnswerBasic, IBasicTweet, IoAnswer, MODELNAMES} from "sov/comp/amalitech/forum/utils/Types";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import FeedListItem from "sap/m/FeedListItem";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace sov.comp.amalitech.forum.controller
 */

export default class Detail extends BaseController {
  pDialog: Promise<Control | Control[]> = null
  oData: IoAnswer = {
    answer: {
      id: "",
      content: ""
    }
  }

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
    return GetUserDetails(id, this.getModel("generalThread") as ODataModel).then(_auth => _auth.name)
  }

  onOpenDialog(oEvent: Event) {
    this.getView().unbindElement(MODELNAMES.answerUpdate);

    const oItem = oEvent.getSource() as FeedListItem;
    const OCtxt = oItem.getBindingContext(MODELNAMES.generalThread);

    const oData = {}

    this.oData = {
      answer: {
        id: OCtxt.getProperty("ID"),
        content: OCtxt.getProperty("content"),
      }
    }

    this.getView().setModel(new JSONModel(this.oData), "answerModel")

    // const oItem = oEvent.getSource() as NotificationListItem;
    if (!this.pDialog) {
      this.pDialog = this.loadFragment({
        name: "sov.comp.amalitech.forum.view.AnswerUpdateDialog"
      })
    }
    this.pDialog
      .then((oDialog) => {
        (oDialog as Dialog).open()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  onCloseDialog() {
    //close the modal onclick
    (this.byId("updateAnswerDialog") as Dialog).close()
  }

  async onUpdateAnswer() {
    const basicAnswer = this.GetLocalModel("answerModel")
    const oModel = this.getModel(MODELNAMES.generalThread) as ODataModel;
    try {
      const response = await oModel
        .bindContext("/updateAnswer(...)")
        .setParameter("ID",basicAnswer.id)
        .setParameter("content",basicAnswer.content)
        .execute()
      oModel.refresh();
      console.log(response)
      this.onCloseDialog();
    }catch (e) {
      MessageToast.show("Something bad happened")
      console.log(e)
    }
  }

  public GetLocalModel(localModelName: string): IAnswerBasic {
    const oTweetModel = this.getModel(localModelName) as JSONModel
    const target = Object.keys(this.oData)[0];
    return {
      id: oTweetModel.getProperty(this.getODataPropertyRelativePath(this.oData, target, 0, 0)),
      content: oTweetModel.getProperty(this.getODataPropertyRelativePath(this.oData, target, 0, 1)),
    } as IAnswerBasic;
  }

}