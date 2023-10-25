
export interface iAuthor {
  name: string
  createdAt: string,
  createdBy: string,
  modifiedAt: string,
  modifiedBy: string,
  ID: string,
}

export interface IoTweet {
  tweet: iTweet
}

export interface IoBasicTweet{
  update: IBasicTweet
}

export interface IBasicTweet {
  id?: string
  title: string
  content: string
}

interface iTweet extends IBasicTweet{
  upVote: number
  downVote: number
  author_ID: string
}

export const MODELNAMES  = {
  generalThread: "generalThread",
  tweetUpdate: "tweetUpdate",
}

export const VIEWIDS = {
  threadListID: "threadList",
  threadSearchField: "threadSearchField",
}