import { combineReducers, createStore } from 'redux';
import user from './user';
import communityUser from './communityUser';

const rootReducer = combineReducers({
    user,
    communityUser
});

export type RootReducer = ReturnType<typeof rootReducer>;

const store = createStore(combineReducers({
    user,
    communityUser
}));

export default store;