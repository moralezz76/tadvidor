import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import SessionMiddleware from './redux_session/middleware';

// state on app start
const initialState = {};

// configure middleware
const middleware = [thunk, SessionMiddleware];

// create store
const enhancer = compose(applyMiddleware(...middleware));
const store = createStore(rootReducer, initialState, enhancer);

// export store singleton instance
export default store;
