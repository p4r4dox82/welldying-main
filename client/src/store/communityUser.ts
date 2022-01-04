import { CommunityUser } from "../etc/api/community/communityUser";

const SET_CUSER = 'SET_CUSER' as const;
const CLEAR_CUSER = 'CLEAR_CUSER' as const;

export const setCommunityUser = (communityUser: CommunityUser) => {
  return {
    type: SET_CUSER,
    communityUser,
  };
};

export const clearCommunityUser = () => {
  return {
    type: CLEAR_CUSER,
  };
};

export type CommunityUserAction = 
  | ReturnType<typeof setCommunityUser>
  | ReturnType<typeof clearCommunityUser>
;

export interface CommunityUserState {
  loggedIn: boolean;
  communityUser?: CommunityUser;
};

const initialState : CommunityUserState = {
  loggedIn: false,
  communityUser: undefined,
};

export default function communityUser(state = initialState, action : CommunityUserAction) {
  switch (action.type) {
    case SET_CUSER:
      return {
        ...state,
        user: action.communityUser,
        loggedIn: true,
      };
    case CLEAR_CUSER:
      return {
        ...state,
        user: undefined,
        loggedIn: false,
      }
    default:
      return state;
  }
}
