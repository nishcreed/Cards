import {legacy_createStore as createStore} from 'redux'
import cardReducer from './game/gameReducer'

const store = createStore(cardReducer)

export default store
