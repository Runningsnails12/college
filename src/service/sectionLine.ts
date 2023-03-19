import Http from "./axios";

export async function getAllSectionLine(sectionId: any) {
  return Http({
    url: '/section/line',
    method: 'get',
    params: {
      sectionId
    }
  })
}

export async function addSectionLine(sectionId: any, id: any, range: any, text: any) {
  return Http({
    url: '/section/line',
    method: 'post',
    data: {
      sectionId, id, range, text
    }
  })
}

export async function getSectionLineInfo(id: any) {
  return Http({
    url: '/section/line/info',
    method: 'get',
    params: {
      id
    }
  })
}