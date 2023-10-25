import BaseController from "./BaseController";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import RouterConfig from "sov/comp/amalitech/forum/utils/RouterConfig";
import {GetUserDetails} from "sov/comp/amalitech/forum/formatter/GeneralFormatter";
import Event from "sap/ui/base/Event";
import MessageToast from "sap/m/MessageToast";
import NotificationListItem from "sap/m/NotificationListItem";
import {IBasicTweet, IoBasicTweet, IoTweet, MODELNAMES} from "sov/comp/amalitech/forum/utils/Types";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import List from "sap/m/List";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import formatter from "sov/comp/amalitech/forum/model/formatter";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";

/**
 * @namespace sov.comp.amalitech.forum.controller
 */

export default class Main extends BaseController {
  oData: IoTweet = {
    tweet: {
      author_ID: "",
      title: "",
      content: "",
      upVote: 0,
      downVote: 0
    }
  }
  oBasicTweet: IoBasicTweet = {
    update:{
      title:"",
      content:""
    }
  }
  formatter = formatter
  pDialog: Promise<Control | Control[]> = null

  private getODataProperty(source: any, position: int): string {
    return Object.keys(source)[position];
  }

  private getODataSubProperty(source: any, target: string, sub: int): string {
    return Object.keys(source[target])[sub]
  }

  private getODataPropertyRelativePath(source: any, target: string, head: int, sub: int): string {
    return "/".concat(this.getODataProperty(source, head)).concat("/").concat(this.getODataSubProperty(source,target, sub))
  }

  public onInit() {
    this.getView().setModel(new JSONModel(this.oData));
  }

  //@ts-ignore
  public onListItemPress(oEvent): void {
    // get the item
    const oItem = oEvent.getSource();
    //get router
    const oRouter = this.getOwnerComponent().getRouter();
    //navigate
    console.dir(window.encodeURIComponent(oItem.getBindingContext(MODELNAMES.generalThread).getPath().substring(1)))
    oRouter.navTo(RouterConfig.detail, {
      threadID: window.encodeURIComponent(oItem.getBindingContext(MODELNAMES.generalThread).getPath().substring(1))
    })
  }

  public getProfilePicture(): string {
    console.log("___boomer___")
    let randomNum = Math.floor(Math.random() * 2);
    return "https://i.pinimg.com/originals/8f/ee/fa/8feefa47ea7f3f48a5ada1ed8ba7b59d.jpg"
  }

  async getAuthorName(id: string): Promise<string> {
    return GetUserDetails(id, this.getModel(MODELNAMES.generalThread) as ODataModel).then(_auth => _auth.name)
  }

  private async onCreateThread(): Promise<void> {
    const oModel = this.getModel() as JSONModel;
    const target = Object.keys(this.oData)[0]
    const sTitle = oModel.getProperty(this.getODataPropertyRelativePath(this.oData,target, 0, 1)) as string
    const sContent = oModel.getProperty(this.getODataPropertyRelativePath(this.oData, target,0, 2)) as string

    //save this thread

    const oGeneralModel = this.getModel(MODELNAMES.generalThread) as ODataModel;
    //bind to the create thread context
    try {
      const oList = this.byId("threadList") as List;
      const oBinding = oList.getBinding("items");
      const data: IBasicTweet = {
        title: sTitle,
        content: sContent
      }
      //@ts-ignore
      const oContext = (oBinding as ODataListBinding).create(data)
      MessageToast.show("Thread create")
      oGeneralModel.refresh();
    } catch (e) {
      console.log(e)
      MessageToast.show("Could not create data")
    }

  }

  public onClearThreadFields(): void {
    const target = Object.keys(this.oData)[0]
    const sTitlePath = this.getODataPropertyRelativePath(this.oData, target,0, 1);
    const sContentPath = this.getODataPropertyRelativePath(this.oData, target,0, 2);
    const oModel = this.getModel() as JSONModel;
    oModel.setProperty(sTitlePath, "")
    oModel.setProperty(sContentPath, "")
    MessageToast.show("Cleared")
  }

  async onDelete(oEvent: Event): Promise<void> {
    const oItem = oEvent.getSource() as NotificationListItem;
    const sId = oItem.getBindingContext(MODELNAMES.generalThread).getProperty("ID") as string;
    const oModel = this.getModel(MODELNAMES.generalThread) as ODataModel
    const sDeleteSuccessText = this.getResourceBundleAsText('deleteSuccess');
    const sDeleteErrorText = this.getResourceBundleAsText('deleteSuccess');
    if (sId) {
      //commence the delete procedure
      try {
        const response = await oModel.bindContext('/deleteThread(...)').setParameter("ID", sId).execute();
        console.log("response -->> ", response)
        MessageToast.show(sDeleteSuccessText);
        oModel.refresh();
      } catch (e) {
        MessageToast.show(sDeleteErrorText);
      }
    }
  }

  onOpenUpdateDialog(oEvent: Event) {
    this.getView().unbindElement(MODELNAMES.tweetUpdate);
    const oItem = oEvent.getSource() as NotificationListItem;
    const oItemCtxt = oItem.getBindingContext(MODELNAMES.generalThread);

    const oData: IoBasicTweet = {
      update: {
        title: oItemCtxt.getProperty("title") as string,
        content: oItemCtxt.getProperty("content") as string
      }
    }
    this.setModel(new JSONModel(oData), MODELNAMES.tweetUpdate)

    if (!this.pDialog) {
      this.pDialog = this.loadFragment({
        name: "sov.comp.amalitech.forum.view.Dialog"
      })
    }
    this.pDialog.then((oDialog) => {
      (oDialog as Dialog).open();
    }).catch((err) => {
      console.dir(err)
    })
  }

  onUpdateTweet() {
    console.log("data --->>> ")
    const oTweetModel = this.getModel(MODELNAMES.tweetUpdate) as JSONModel
    const target = Object.keys(this.oBasicTweet)[0]
    const data = {
      title: oTweetModel.getProperty(this.getODataPropertyRelativePath(this.oBasicTweet, target,0, 0)),
      content: oTweetModel.getProperty(this.getODataPropertyRelativePath(this.oBasicTweet, target,0, 1))
    }
    console.dir(data)
  }

  onCloseDialog() {
    (this.byId("updateTweetDialog") as Dialog).close();
  }

  async onUpVote(oEvent: Event): Promise<void> {
    const oItem = oEvent.getSource() as Button;
    const sId = oItem.getBindingContext('generalThread').getProperty("ID") as string;
    const oModel = this.getModel('generalThread') as ODataModel
    console.log("sId -->>> ", sId)
    if (sId) {
      //commence the delete procedure
      try {
        const response =
          await oModel.bindContext('/upvoteThread(...)')
            .setParameter("ID", sId)
            .execute();
        console.log("response -->> ", response)
        oModel.refresh();
      } catch (e) {
        console.log(e)
      }
    }
  }

  async onDownVote(oEvent: Event): Promise<void> {
    const oItem = oEvent.getSource() as Button;
    const sId = oItem.getBindingContext('generalThread').getProperty("ID") as string;
    const oModel = this.getModel('generalThread') as ODataModel
    console.log("sId -->>> ", sId)
    if (sId) {
      //commence the delete procedure
      try {
        const response =
          await oModel.bindContext('/downvoteThread(...)')
            .setParameter("ID", sId)
            .execute();
        console.log("response -->> ", response)
        oModel.refresh();
      } catch (e) {
        console.log(e)
      }
    }
  }
}
