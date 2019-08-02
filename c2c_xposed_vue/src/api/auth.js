import request from '@/utils/request'

export function listPermission(query) {
  return request({
    url: '/auth/permission/list/',
    method: 'get',
    params: query
  })
}

export function addPermission(data) {
  return request({
    url: '/auth/permission/curd/',
    method: 'post',
    data: data
  })
}

export function updatePermission(data) {
  return request({
    url: '/auth/permission/curd/',
    method: 'patch',
    data: data
  })
}

export function deletePermission(id) {
  return request({
    url: '/auth/permission/curd/',
    method: 'delete',
    data: {
      id
    }
  })
}

export function listRole(query) {
  return request({
    url: '/auth/role/list/',
    method: 'get',
    params: query
  })
}

export function listRoleSelect(query) {
  return request({
    url: '/auth/role/selectList/',
    method: 'get',
    params: query
  })
}

export function getRole(id) {
  return request({
    url: '/auth/role/curd/',
    method: 'get',
    params: {
      id
    }
  })
}

export function addRole(data) {
  return request({
    url: '/auth/role/curd/',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/auth/role/curd/',
    method: 'patch',
    data: data
  })
}

export function deleteRole(id) {
  return request({
    url: '/auth/role/curd/',
    method: 'delete',
    data: {
      id
    }
  })
}

export function authRole(roleId, ids) {
  return request({
    url: '/auth/role/curd/',
    method: 'put',
    data: {
      roleId,
      ids
    }
  })
}

export function listUser(data) {
  return request({
    url: '/auth/user/list/',
    method: 'get',
    params: data
  })
}

export function getUser(id) {
  return request({
    url: '/auth/user/curd/',
    method: 'get',
    params: {
      id
    }
  })
}

export function addUser(data) {
  return request({
    url: '/auth/user/curd/',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/auth/user/curd/',
    method: 'patch',
    data: data
  })
}

export function resetUserPassword(id) {
  return request({
    url: '/auth/user/password/reset/',
    method: 'post',
    data: {
      id
    }
  })
}

export function editUserPassword(data) {
  return request({
    url: '/auth/user/password/edit/',
    method: 'post',
    data: data
  })
}

export function authUser(userId, ids) {
  return request({
    url: '/auth/user/curd/',
    method: 'put',
    data: {
      userId,
      ids
    }
  })
}

export function delUser(data) {
  return request({
    url: '/auth/user/guanlian/',
    method: 'patch',
    data: data
  })
}

export function guanlianAgentAndMerchant(userId, merchantIds, agentIds) {
  return request({
    url: '/auth/user/guanlian/',
    method: 'post',
    data: {
      userId,
      merchantIds,
      agentIds
    }
  })
}
