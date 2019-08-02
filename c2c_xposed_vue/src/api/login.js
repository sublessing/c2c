import request from '@/utils/request'

export function login(username, password, google_key) {
  return request({
    url: '/auth/login/',
    method: 'post',
    data: {
      username,
      password,
      google_key
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout/',
    method: 'post'
  })
}
