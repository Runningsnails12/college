import Http from "./axios";

export async function getArticleBySectionId(data: any) {
  return Http({
    url: '/article/BySectionId',
    method: 'GET',
    params: {
      sectionId: data
    }
  })
}

export async function getArticle(articleId: any) {
  return Http({
    url: '/article',
    method: 'GET',
    params: {
      articleId
    }
  })
}

export async function addArticle(data?: any) {
  return Http({
    url: '/article',
    method: 'post',
    data
  })
}
export async function updateArticle(data: any) {
  return Http({
    url: '/article',
    method: 'patch',
    data
  })
}
export async function deleteArticle(data: any) {
  return Http({
    url: '/article',
    method: 'delete',
    params: {
      articleId: data
    }
  })
}
export async function getAllArticle() {
  return Http({
    url: '/article/all',
    method: 'get',
  })
}
export async function getMyArticle() {
  return Http({
    url: '/article/my',
    method: 'get',
  })
}
export async function getArticleByArticleId(data: any) {
  return Http({
    url: '/article/ByArticleId',
    method: 'get',
    params: {
      articleId: data
    }
  })
}
