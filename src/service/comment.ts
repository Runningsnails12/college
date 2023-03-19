import Http from "./axios";

export async function getAllComment(sectionId: any) {
  return Http({
    url: '/comment/all',
    method: 'get',
    params: {
      sectionId
    }
  })
}
export async function addComment(sectionId: any, parentId: any, comment: any,replyUserId:any) {
  return Http({
    url: '/comment',
    method: 'post',
    data: {
      sectionId,
      parentId,
      comment,
      replyUserId
    }
  })
}