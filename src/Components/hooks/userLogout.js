import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../Store/Slices/authSlice";
import { clearCart } from "../../Store/Slices/cartSlice";

export const userLogout = () => {
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await fetch("http://localhost:8081/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      dispatch(logoutSuccess());
      dispatch(clearCart());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return logout;
};
