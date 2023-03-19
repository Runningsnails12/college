import Http from "./axios";

export async function getCycleText(pageNum: any, pageSize: any, cycleId?: any) {
  return Http({
    url: '/cycle/text/recommend',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      cycleId
    }
  })
}
export async function saveStar(textId: any) {
  return Http({
    url: '/cycle/star/save',
    method: 'get',
    params: {
      textId
    }
  })
}
export async function cancelStar(textId: any) {
  return Http({
    url: '/cycle/star/cancel',
    method: 'get',
    params: {
      textId
    }
  })
}
export async function getMyCycle() {
  return Http({
    url: '/cycle/my',
    method: 'get'
  })
}

export async function addText(cycleId: any, text: any) {
  return Http({
    url: '/cycle/text',
    method: 'post',
    data: {
      cycleId,
      text
    }
  })
}
export async function getCycleArticle() {
  return Http({
    url: '/article/recommend',
    method: 'get'
  })
}

export async function getCycleUserInfo() {
  return Http({
    url: '/cycle/userData',
    method: 'get'
  })
}
export async function joinCycle(id: any) {
  return Http({
    url: '/cycle/join',
    method: 'get',
    params: {
      cycleId: id
    }
  })
}