import * as types from './ActionTypes';
import api from "@/config/api";

// 1. Pay Order
export const payOrder = (jwt, orderData, amount) => async (dispatch) => {
  dispatch({ type: types.PAY_ORDER_REQUEST });

  try {
    const response = await api.post('/api/orders/pay', orderData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.PAY_ORDER_SUCCESS,
      payload: response.data,
      amount,
    });

    console.log("Order success", response.data);
  } catch (error) {
    console.error("Error:", error);
    dispatch({
      type: types.PAY_ORDER_FAILURE,
      error: error.message,
    });
  }
};

// 2. Get Order by ID
export const getOrderById = (jwt, orderId) => async (dispatch) => {
  dispatch({ type: types.GET_ORDER_REQUEST });

  try {
    const response = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.GET_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ORDER_FAILURE,
      error: error.message,
    });
  }
};

// 3. Get All Orders for a User
export const getAllOrdersForUser = (jwt, orderType, assetSymbol) => async (dispatch) => {
  dispatch({ type: types.GET_ALL_ORDERS_REQUEST });

  try {
    const response = await api.get('/api/orders', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        order_type: orderType,
        asset_symbol: assetSymbol,
      },
    });

    dispatch({
      type: types.GET_ALL_ORDERS_SUCCESS,
      payload: response.data,
    });

    console.log("All orders fetched successfully", response.data);
  } catch (error) {
    console.error("Error fetching orders", error);
    dispatch({
      type: types.GET_ALL_ORDERS_FAILURE,
      error: error.message,
    });
  }
};
