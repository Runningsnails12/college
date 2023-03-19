/**
 * 环境配置
 * dev是开发环境,prod是生产环境,如果开启mock他的根路径是mockApi,否则是baseApi
 */

type mode = 'dev' | 'prod'
const env = (import.meta.env.MODE as mode) || 'prod';
const TIMEOUT = 5000;

const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/0acd4bcc24454a87071a01a861e66d6b/api'
  },
  prod: {
    baseApi: '/api',
    mockApi: 'http://localhost:8081'
  }
};
export default {
  env,
  mock: false,//是否全局开启mock
  namespace: 'college',
  TIMEOUT,
  ...EnvConfig[env]
};