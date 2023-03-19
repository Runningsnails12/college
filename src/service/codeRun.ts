import Http from "./axios";
export async function runCode(data: any) {
  return Http({
    url: '/code/run',
    method: 'post',
    data
  })
}
export async function problemCodeRun(data: any) {
  return Http({
    url: '/code/problemCodeRun',
    method: 'post',
    data
  })
}
