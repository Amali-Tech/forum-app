import BaseController from "./BaseController";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import RouterConfig from "sov/comp/amalitech/forum/utils/RouterConfig";
import {GetUserDetails} from "sov/comp/amalitech/forum/formatter/GeneralFormatter";
import Event from "sap/ui/base/Event";
import MessageToast from "sap/m/MessageToast";
import NotificationListItem from "sap/m/NotificationListItem";
import {IoTweet} from "sov/comp/amalitech/forum/utils/Types";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import Binding from "sap/ui/model/Binding";
import List from "sap/m/List";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import formatter from "sov/comp/amalitech/forum/model/formatter";
/**
 * @namespace sov.comp.amalitech.forum.controller
 */

export default class Main extends BaseController {
	oData: IoTweet ={
		tweet:{
			author_ID: "",
			title:"",
			content:"",
			upVote: 0,
			downVote: 0
		}
	}
	formatter = formatter
	private getODataPropety(position: int):string{
		return Object.keys(this.oData)[position];
	}

	private getODataSubProperty(sub: int): string{
		return Object.keys(this.oData.tweet)[sub]
	}

	private getODataPropertyRelativePath(head: int, sub: int): string{
		return "/".concat(this.getODataPropety(head)).concat("/").concat(this.getODataSubProperty(sub))
	}

	public onInit() {

		this.getView().setModel(new JSONModel(this.oData))
	}

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

	 private async onCreateThread(): Promise<void>{
		const oModel = this.getModel() as JSONModel;
		const sTitle = oModel.getProperty(this.getODataPropertyRelativePath(0,1)) as string
		const sContent = oModel.getProperty(this.getODataPropertyRelativePath(0,2))

		//save this thread

		const oGeneralModel = this.getModel("generalThread") as ODataModel;
		//bind to the create thread context
		try {
			const oList = this.byId("threadList") as List;
			const oBinding= oList.getBinding("items");
			const data = {
				title: sTitle,
				content: sContent
			}
			//@ts-ignore
			const oContext = (oBinding as ODataListBinding).create(data)

			console.log("Hello world");
			// const response =
			// 	await oGeneralModel.bindContext("/Threads(...)")
			// 		.setParameter("title", sTitle)
			// 		.setParameter("content", sContent)
			// 		.setParameter("upvotes", 0)
			// 		.setParameter("downvotes", 0)
			// 		.execute();
			// console.log("response --->>> ", response);
			MessageToast.show("Thread create")
			oGeneralModel.refresh();
		}catch (e) {
			console.log(e)
			MessageToast.show("Could not create data")
		}

	}

	public onClearThreadFields(): void{
		const sTitlePath = this.getODataPropertyRelativePath(0,1);
		const sContentPath = this.getODataPropertyRelativePath(0,2);
		const oModel = this.getModel() as JSONModel;
		oModel.setProperty(sTitlePath,"")
		oModel.setProperty(sContentPath,"")
		MessageToast.show("Cleared")
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

	async onUpVote(oEvent: Event):Promise<void>{
		const oItem = oEvent.getSource() as Button;
		const sId = oItem.getBindingContext('generalThread').getProperty("ID") as string;
		const oModel = this.getModel('generalThread') as ODataModel
		console.log("sId -->>> ", sId)
		if(sId){
			//commence the delete procedure
			try {
				const response =
					await oModel.bindContext('/upvoteThread(...)')
						.setParameter("ID", sId)
						.execute();
				console.log("response -->> ", response)
				oModel.refresh();
			}catch (e) {
				console.log(e)
			}
		}
	}

	async onDownVote(oEvent: Event):Promise<void>{
		const oItem = oEvent.getSource() as Button;
		const sId = oItem.getBindingContext('generalThread').getProperty("ID") as string;
		const oModel = this.getModel('generalThread') as ODataModel
		console.log("sId -->>> ", sId)
		if(sId){
			//commence the delete procedure
			try {
				const response =
					await oModel.bindContext('/downvoteThread(...)')
						.setParameter("ID", sId)
						.execute();
				console.log("response -->> ", response)
				oModel.refresh();
			}catch (e) {
				console.log(e)
			}
		}
	}
}
