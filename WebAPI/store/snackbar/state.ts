import { SnackbarState } from './types'

/**
 * Counter state initializer
 */
export const initState = (): SnackbarState => ({
  content: '',
  color: '',
})

export default initState
