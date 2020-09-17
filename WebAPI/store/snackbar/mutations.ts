import { MutationTree } from 'vuex'
import { SnackbarState } from './types'

/**
 * SnackbarState mutations
 */
export const mutations: MutationTree<SnackbarState> = {
  showMessage(state, payload: SnackbarState): void {
    debugger
    state.content = payload.content
    state.color = payload.color
  },
}

export default mutations
