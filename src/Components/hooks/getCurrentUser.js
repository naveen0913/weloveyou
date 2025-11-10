import {
  checkAuthStart,
  checkAuthFailure,
  checkAuthSuccess,
} from "../../Store/Slices/authSlice";
import { prodUrl } from "../Constants";

export const getAuthUser = () => async (dispatch) => {
  dispatch(checkAuthStart());
  try {
    const response = await fetch(prodUrl+"user/authorized", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errMsg = await response.text();
      dispatch(checkAuthFailure(errMsg || "Unauthorized"));
      return;
    }

    const result = await response.json();
    const userData = result?.data;
    dispatch(
      checkAuthSuccess({
        user: userData,
        role: userData.role,
        userId: userData.id,
      })
    );
    if (!userData) {
      dispatch(checkAuthFailure("Invalid user data"));
      return;
    }
  } catch (error) {
    dispatch(checkAuthFailure(error.message));
  }
};
