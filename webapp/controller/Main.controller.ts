import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace sov.comp.amalitech.forum.controller
 */

interface iAuthor {
	name: string
	createdAt: string,
	createdBy: string,
	modifiedAt: string,
	modifiedBy: string,
	ID: string,
}

export default class Main extends BaseController {
	private formatter = formatter;

	onInit(): void {		
		
	}
	
	public sayHello(): void {
		MessageBox.show("Hello World!");
	}

	public getProfilePicture(): string {
		console.log("___boomer___");

		let randomNum = Math.floor(Math.random() * 2);
		console.log(randomNum);

		return "https://i.pinimg.com/originals/8f/ee/fa/8feefa47ea7f3f48a5ada1ed8ba7b59d.jpg"
	}

	async getAuthorName(id: string): Promise<string> {		
		return this.getAuthorDetails(id).then(_auth=>_auth.name);
	}

	async getAuthorDetails(id: string = "99c1b2ea-53e3-48f9-b3d3-88f449af3bbf"): Promise<iAuthor> {
	
		const oModel = this.getModel("generalThread") as ODataModel;
		const oBinding = oModel.bindList("/Authors");
		const authorContext  = await oBinding.requestContexts()
		const _result =  authorContext.map(authCtxt=> authCtxt.getObject() as iAuthor);
		const selectedAuthor = _result.find(value=> id === value.ID)
		return selectedAuthor || {name:"winston"} as iAuthor;
	}
}
