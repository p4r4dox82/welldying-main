import { UserData } from "../etc/api/user";

const SET_USER = 'SET_USER' as const;
const CLEAR_USER = 'CLEAR_USER' as const;

export const setUser = (user: UserData) => {
  return {
    type: SET_USER,
    user,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
;

export interface UserState {
  loggedIn: boolean;
  user?: UserData;
};

const initialState : UserState = {
  loggedIn: false,
  user: undefined,
};

export default function user(state = initialState, action : UserAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        loggedIn: true,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: undefined,
        loggedIn: false,
      }
    default:
      return state;
  }
}
