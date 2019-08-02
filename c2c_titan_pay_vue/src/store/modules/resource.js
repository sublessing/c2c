import {
  loadMerchantIdAndName,
  loadAgentIdAndName
} from '@/api/service'

const resource = {
  state: {
    merchantMap: null,
    merchantMap2: null,
    merchantCode: null,
    agentMap: null
  },

  mutations: {
    SET_MERCHANT_MAP: (state, map) => {
      state.merchantMap = map
    },
    SET_MERCHANT_MAP2: (state, map) => {
      state.merchantMap2 = map
    },
    SET_MERCHANT_CODE: (state, map) => {
      state.merchantCode = map
    },
    SET_AGENT_MAP: (state, map) => {
      state.agentMap = map
    }
  },

  actions: {
    InitMerchantMap({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        loadMerchantIdAndName().then(response => {
          const map = {}
          for (let i = 0; i < response.data.items.length; i++) {
            const item = response.data.items[i]
            map[item.id] = item.merchant_name
          }
          commit('SET_MERCHANT_MAP', map)
          const map2 = {}
          for (let i = 0; i < response.data.items.length; i++) {
            const item = response.data.items[i]
            map2[item.id] = item.merchant_name
          }
          commit('SET_MERCHANT_MAP2', map2)
          const map3 = {}
          for (let i = 0; i < response.data.items.length; i++) {
            const item = response.data.items[i]
            map3[item.id] = item.merchant_code
          }
          commit('SET_MERCHANT_CODE', map3)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    InitAgentMap({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        loadAgentIdAndName().then(response => {
          const map = {}
          for (let i = 0; i < response.data.items.length; i++) {
            const item = response.data.items[i]
            map[item.agent_id] = item.login_name
          }
          commit('SET_AGENT_MAP', map)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default resource
