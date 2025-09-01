import {
  checkAuthStart,
  checkAuthFailure,
  checkAuthSuccess,
} from "../../Store/Slices/authSlice";

export const getAuthUser = () => async (dispatch) => {
  dispatch(checkAuthStart());
  try {
    const response = await fetch("http://localhost:8081/api/user/authorized", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errMsg = await response.text();
      dispatch(checkAuthFailure(errMsg || "Unauthorized"));
      return;
    }

    const data = await response.json();
    dispatch(checkAuthSuccess(data));
  } catch (error) {
    dispatch(checkAuthFailure(error.message));
  }
};
