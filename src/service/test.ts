import Http from "./axios";

export async function getAlllTest() {
  return Http({
    url: '/test/all',
    method: 'GET'
  })
}
export async function getStuTest(data: any) {
  return Http({
    url: '/test/stu',
    method: 'GET',
    params: {
      testId: data
    }
  })
}
export async function getTestById(data: any) {
  return Http({
    url: '/test',
    method: 'GET',
    params: {
      testId: data
    }
  })
}
export async function deleteTestById(data: any) {
  return Http({
    url: '/test',
    method: 'delete',
    params: {
      testId: data
    }
  })
}
export async function getTestList() {
  return Http({
    url: '/test/list',
    method: 'GET',
  })
}
export async function getTestDrafts() {
  return Http({
    url: '/test/draft',
    method: 'GET',
  })
}
export async function getTestTitle(testId: any,) {
  return Http({
    url: '/test/title',
    method: 'GET',
    params: {
      testId,
    }
  })
}

export async function createTest() {
  return Http({
    url: '/test/create',
    method: 'GET',
  })
}

export async function addTestProblem(testId: any, problemId: any) {
  return Http({
    url: '/test/add',
    method: 'GET',
    params: {
      testId,
      problemId
    }
  })
}

export async function changeExamType(testId: any, type: any) {
  return Http({
    url: '/test/examType',
    method: 'GET',
    params: {
      testId,
      type: type === 'common' ? 1 : 0
    }
  })
}
export async function changeTitle(testId: any, title: any) {
  return Http({
    url: '/test/title',
    method: 'patch',
    params: {
      testId,
      title
    }
  })
}
export async function changeState(testId: any) {
  return Http({
    url: '/test/state',
    method: 'GET',
    params: {
      testId,
    }
  })
}
export async function addTestResult(data: any, testId: any) {
  return Http({
    url: '/test/addResult',
    method: 'post',
    params: {
      testId
    },
    data: {
      res: data,
    }
  })
}
export async function getUserChoose(data: any) {
  return Http({
    url: '/test/userChoose',
    method: 'get',
    params: {
      testId: data
    }
  })
}
export async function getTestInfo(data: any) {
  return Http({
    url: '/test/info',
    method: 'get',
    params: {
      testId: data
    }
  })
}