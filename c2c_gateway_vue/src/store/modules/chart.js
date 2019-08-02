
import { parseTime } from '@/utils/index'

const chart = {
  namespaced: true,
  state: {
    queryParams: {
      day__gte: parseTime(
        new Date().getTime(),
        '{y}-{m}-{d}'
      ),
      day__lte: parseTime(
        new Date().getTime(),
        '{y}-{m}-{d}'
      )
    }
  },
  mutations: {

  },
  actions: {

  }
}

export default chart
