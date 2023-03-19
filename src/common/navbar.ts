export interface content {
  id: number
  text: string
  path: string
  url: string
}

export const contents: content[] =
  [{
    id: 1,
    text: "代办",
    path: "/todo",
    url: "https://tcs-ga.teambition.net/thumbnail/111v73a89f08ddea2c90f670de5c82cd7b26/w/144/h/144"
  }, {
    id: 2,
    text: "课程",
    path: "/project",
    url: "https://tcs-ga.teambition.net/thumbnail/111w0d1cd6f7a20623c574f9f8276ed2e75b/w/200/h/200"
  }, {
    id: 3,
    text: "日历",
    path: "/calendar",
    url: "https://tcs-ga.teambition.net/thumbnail/111v044bfb740f84296e82176538ca165378/w/144/h/144"
  }, {
    id: 4,
    text: "文章",
    path: "/article",
    url: "https://tcs-ga.teambition.net/thumbnail/111vb617a0ec320a346e3ab7848b52c47dbf/w/144/h/144"
  }, {
    id: 5,
    text: "圈子",
    path: "/cycle",
    url: "https://tcs-ga.teambition.net/thumbnail/111v254e50e036b207ee1f8adfc664ba991e/w/144/h/144"
  }]

export const more: content = {
  id: 10,
  text: "更多",
  path: "",
  url: "https://img.alicdn.com/imgextra/i3/O1CN01gsyrJT1Ve6wmIDuYz_!!6000000002677-2-tps-40-40.png"
}

export const recommend: content[] = [{
  id: 106,
  text: "班级管理",
  path: "/class/management",
  url: "https://tcs.teambition.net/thumbnail/111v8f223137a022ac8f56ca28f21a125177/w/88/h/88"
}, {
  id: 107,
  text: "a",
  path: "",
  url: "https://striker.teambition.net/thumbnail/1119f87d6658f5dbea861daa17946aec29de/w/1024/h/1024"
}, {
  id: 108,
  text: "时间",
  path: "",
  url: "https://striker.teambition.net/thumbnail/11193f197529451ed9bce062893c821ea2e6/w/1024/h/1024"
}, {
  id: 109,
  text: "b",
  path: "",
  url: "https://tcs-ga.teambition.net/thumbnail/312ca08e98b657c56f74c8f5eae0b66dd8d2/w/80/h/80"
}]