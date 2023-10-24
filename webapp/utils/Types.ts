
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

interface iTweet {
  title: string
  content: string
  upVote: number
  downVote: number
  author_ID: string
}