import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../Store/Slices/authSlice";
import { clearCart } from "../../Store/Slices/cartSlice";
import { prodUrl } from "../Constants";

export const userLogout = () => {
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await fetch(prodUrl+"user/logout", {
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
