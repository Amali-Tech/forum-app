import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export async function GetUserDetails(id: string, oModel: ODataModel): Promise<iAuthor> {
  // const oModel = this.getModel("generalThread") as ODataModel;
  const oBinding = oModel.bindList("/Authors");
  const authorContext  = await oBinding.requestContexts();
  const _result =  authorContext.map(authCtxt=> authCtxt.getObject() as iAuthor);
  const selectedAuthor = _result.find(value=> id === value.ID)
  return selectedAuthor || {name:"winston"} as iAuthor;
}

export interface iAuthor {
  name: string
  createdAt: string,
  createdBy: string,
  modifiedAt: string,
  modifiedBy: string,
  ID: string,
}