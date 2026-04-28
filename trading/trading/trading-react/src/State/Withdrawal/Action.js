import {
  WITHDRAWAL_REQUEST,
  WITHDRAWAL_SUCCESS,
  WITHDRAWAL_FAILURE,
  WITHDRAWAL_PROCEED_REQUEST,
  WITHDRAWAL_PROCEED_SUCCESS,
  WITHDRAWAL_PROCEED_FAILURE,
  GET_WITHDRAWAL_HISTORY_REQUEST,
  GET_WITHDRAWAL_HISTORY_SUCCESS,
  GET_WITHDRAWAL_HISTORY_FAILURE,
  GET_WITHDRAWAL_REQUEST_REQUEST,
  GET_WITHDRAWAL_REQUEST_SUCCESS,
  GET_WITHDRAWAL_REQUEST_FAILURE,
  ADD_PAYMENT_DETAILS_REQUEST,
  ADD_PAYMENT_DETAILS_SUCCESS,
  ADD_PAYMENT_DETAILS_FAILURE,
  GET_PAYMENT_DETAILS_REQUEST,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_FAILURE,
} from "./ActionTypes";
import api from "@/config/api";

// 1. Request Withdrawal
export const withdrawalRequest = (amount, jwt) => async (dispatch) => {
  dispatch({ type: WITHDRAWAL_REQUEST });

  try {
    const response = await api.post(`/api/withdrawal/${amount}`, null, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Withdrawal Response:", response.data);
    dispatch({ type: WITHDRAWAL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: WITHDRAWAL_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 2. Proceed Withdrawal (Admin)
export const proceedWithdrawal = (id, jwt, accept) => async (dispatch) => {
  dispatch({ type: WITHDRAWAL_PROCEED_REQUEST });

  try {
    const response = await api.patch(
      `/api/admin/withdrawal/${id}/proceed/${accept}`,
      null,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );

    console.log("Proceed Withdrawal Response:", response.data);
    dispatch({ type: WITHDRAWAL_PROCEED_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: WITHDRAWAL_PROCEED_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 3. Get Withdrawal History (User)
export const getWithdrawalHistory = ({jwt}) => async (dispatch) => {
  dispatch({ type: GET_WITHDRAWAL_HISTORY_REQUEST });
  try {
    const response = await api.get("/api/withdrawal", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Get Withdrawal History:", response.data);
    dispatch({ type: GET_WITHDRAWAL_HISTORY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_WITHDRAWAL_HISTORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 4. Get All Withdrawal Requests (Admin)
export const getAllWithdrawalRequest = (jwt) => async (dispatch) => {
  dispatch({ type: GET_WITHDRAWAL_REQUEST_REQUEST });

  try {
    const response = await api.get("/api/admin/withdrawal", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Get Withdrawal Requests:", response.data);
    dispatch({ type: GET_WITHDRAWAL_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    console.log("Error", error);
    dispatch({
      type: GET_WITHDRAWAL_REQUEST_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 5. Add Payment Details
export const addPaymentDetails = (paymentDetails, jwt) => async (dispatch) => {
  dispatch({ type: ADD_PAYMENT_DETAILS_REQUEST });

  try {
    const response = await api.post("/api/payment-details", paymentDetails, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Add Payment Details:", response.data);
    dispatch({ type: ADD_PAYMENT_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ADD_PAYMENT_DETAILS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 6. Get Payment Details
export const getPaymentDetails = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PAYMENT_DETAILS_REQUEST });

  try {
    const response = await api.get("/api/payment-details", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Get Payment Details:", response.data);
    dispatch({ type: GET_PAYMENT_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_PAYMENT_DETAILS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
