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
