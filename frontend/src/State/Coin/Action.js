import axios from "axios";
import {
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_TOP_50_COINS_REQUEST,
  FETCH_TOP_50_COINS_SUCCESS,
  FETCH_TOP_50_COINS_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_COIN_BY_ID_REQUEST,
  FETCH_COIN_BY_ID_SUCCESS,
  FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_DETAILS_FAILURE,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_DETAILS_REQUEST,
  SEARCH_COIN_SUCCESS,
  SEARCH_COIN_FAILURE,
  SEARCH_COIN_REQUEST,
} from "./ActionTypes";

const API_BASE_URL = "http://localhost:9229";

// 1. Get Coin List (paginated)
export const getCoinList = (page) => async dispatch => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/coins?page=${page}`
    );
    dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: error.message });
  }
};

// 2. Get Top 50 Coins
export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_50_COINS_REQUEST });

  try {
    const response = await axios.get(`${API_BASE_URL}/coins/top50`);
    dispatch({ type: FETCH_TOP_50_COINS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOP_50_COINS_FAILURE, payload: error.message });
  }
};

// 3. Get Market Chart
export const fetchMarketChart = ({ coinId, days }) => async (dispatch) => {
  dispatch({ type: FETCH_MARKET_CHART_REQUEST });

  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/${coinId}/chart?days=${days}`
    );
    dispatch({ type: FETCH_MARKET_CHART_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: error.message });
  }
};

// 4. Fetch Coin by ID (Not directly supported in your controller, optional)
export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST });

  try {
    const response = await axios.get(`${API_BASE_URL}/coins/details/${coinId}`);
    dispatch({ type: FETCH_COIN_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_BY_ID_FAILURE, payload: error.message });
  }
};

// 5. Fetch Full Coin Details (requires JWT)
export const fetchCoinDetails = ({ coinId, jwt }) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });

  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/details/${coinId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: error.message });
  }
};

// 6. Search Coin
export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });

  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/search?q=${keyword}`
    );
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SEARCH_COIN_FAILURE, payload: error.message });
  }
};
