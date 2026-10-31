// State/Watchlist/reducer.js
import * as types from "./ActionTypes";

const initialState = {
  items: [],    // ← array of coin objects
  loading: false,
  error: null,
};

export default function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_WATCHLIST_REQUEST:
    case types.ADD_COIN_TO_WATCHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_USER_WATCHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload   // ← overwrite with the fetched coins array
      };

    case types.ADD_COIN_TO_WATCHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload]  // ← append the new coin
      };

    case types.GET_USER_WATCHLIST_FAILURE:
    case types.ADD_COIN_TO_WATCHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}
