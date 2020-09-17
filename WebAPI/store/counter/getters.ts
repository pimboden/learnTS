import { GetterTree } from 'vuex'
import { RootState } from '../types'
import { CounterState } from './types'

/**
 * Counter getters
 */
export const getters: GetterTree<CounterState, RootState> = {
  square: (state): number => state.count * state.count,
  count: (state): number => state.count,
}

export default getters
