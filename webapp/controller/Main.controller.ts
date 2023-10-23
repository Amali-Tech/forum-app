import BaseController from "./BaseController";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import RouterConfig from "sov/comp/amalitech/forum/utils/RouterConfig";
import {GetUserDetails, iAuthor} from "sov/comp/amalitech/forum/formatter/GeneralFormatter";
import Event from "sap/ui/base/Event";
import FeedListItem from "sap/m/FeedListItem";
import MessageToast from "sap/m/MessageToast";
import NotificationListItem from "sap/m/NotificationListItem";
/**
 * @namespace sov.comp.amalitech.forum.controller
 */

export default class Main extends BaseController {
	//@ts-ignore
	public onListItemPress(oEvent): void {
		// get the item
		const oItem = oEvent.getSource();
		//get router
		const oRouter = this.getOwnerComponent().getRouter();
		//navigate
		console.dir(window.encodeURIComponent(oItem.getBindingContext("generalThread").getPath().substring(1)))
		oRouter.navTo(RouterConfig.detail,{
			threadID: window.encodeURIComponent(oItem.getBindingContext("generalThread").getPath().substring(1))
		})
	}

	public getProfilePicture(): string {
		console.log("___boomer___")
		let randomNum = Math.floor(Math.random() * 2);
		return "https://i.pinimg.com/originals/8f/ee/fa/8feefa47ea7f3f48a5ada1ed8ba7b59d.jpg"
	}

	async getAuthorName(id: string): Promise<string> {
		return GetUserDetails(id, this.getModel("generalThread") as ODataModel).then(_auth=>_auth.name)
	}


	async onDelete(oEvent: Event):Promise<void>{
		const oItem = oEvent.getSource() as NotificationListItem;
		const sId = oItem.getBindingContext('generalThread').getProperty("ID") as string;
		const oModel = this.getModel('generalThread') as ODataModel
		const sDeleteSuccessText = this.getResourceBundleAsText('deleteSuccess');
		const sDeleteErrorText = this.getResourceBundleAsText('deleteSuccess');
		console.log(sId)
		if(sId){
			//commence the delete procedure
			try {
				const response =  await oModel.bindContext('/deleteThread(...)').setParameter("ID", sId).execute();
				console.log("response -->> ", response)
				MessageToast.show(sDeleteSuccessText);
				oModel.refresh();
			}catch (e) {
				MessageToast.show(sDeleteErrorText);
			}
		}
	}

}
