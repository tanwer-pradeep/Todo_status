import { legacy_createStore as createStore } from 'redux';
import rootReducer from './reducers'; // You need to create this

const store = createStore(rootReducer);

export default store;