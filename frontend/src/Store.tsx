/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import { FacebookData, UserInfo } from "./types/UserInfo";
import { Post, What } from "./types/Post";

type AppState = {
  userInfo: UserInfo;
  posts: Post[];
  filesList: File[];
};
const initialState: AppState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
  // userInfo: localStorage.getItem("userInfo")
  //   ? JSON.parse(localStorage.getItem("userInfo")!)
  //   : null,
  posts: [],
  filesList: [],
};


// const checkUser = async (fbData:FacebookData) => {
//   const response = await fetch(
//     `https://graph.facebook.com/${fbData.fb_userID}?access_token=${fbData.accessToken}`
//   );
//   const user = await response.json();
//   console.log("user");
//   console.log(user);
// };

// if (initialState.userInfo&&initialState.userInfo.facebookData.accessToken) {
//   checkUser(initialState.userInfo.facebookData)
// }

type Action =
  | { type: "USER_SIGNIN"; payload: UserInfo|any }
  | { type: "USER_FB_INFO"; payload: FacebookData }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_WHAT_SECTION"; payload: What }
  | { type: "SAVE_FILES"; payload: File[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_FB_INFO":
      return {
        ...state,
        userInfo: { ...state.userInfo, facebookData: action.payload },
      };

    case "SAVE_FILES":
      return {
        ...state,
        filesList: action.payload,
      };

    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );

  return <Store.Provider value={{ state, dispatch }} {...props} />;
}
export { Store, StoreProvider };
