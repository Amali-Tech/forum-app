import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import {iAuthor} from "sov/comp/amalitech/forum/utils/Types";

export async function GetUserDetails(id: string, oModel: ODataModel): Promise<iAuthor> {
  // const oModel = this.getModel("generalThread") as ODataModel;
  const oBinding = oModel.bindList("/Authors");
  const authorContext  = await oBinding.requestContexts();
  const _result =  authorContext.map(authCtxt=> authCtxt.getObject() as iAuthor);
  const selectedAuthor = _result.find(value=> id === value.ID)
  return selectedAuthor || {name:"winston"} as iAuthor;
}

