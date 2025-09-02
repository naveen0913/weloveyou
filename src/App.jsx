import Header from "./Components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./Components/ProductDetails";
import Footer from "./Components/Footer";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Products from "./Components/Products";
import AllProducts from "./Components/AllProducts";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Regsiter";
import CartItems from "./Components/pages/CartItems";
import Checkout from "./Components/pages/Checkout";
import AccountLayout from "./Components/auth/account/AccountLayout";
import Faqs from "./Components/pages/Faqs";
import About from "./Components/pages/About"
import Contact from "./Components/pages/Contact"
import { useDispatch, useSelector } from "react-redux";
import { getAuthUser } from "./Components/hooks/getCurrentUser";
import { useEffect } from "react";
import ForgotPassword from "./Components/auth/Forgotpassword";
import { fetchCartItems } from "./Store/Slices/cartSlice";

function App() {

  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAuthUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, user?.id, dispatch]);
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart-items" element={<CartItems />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/frequently-asked-questions" element={<Faqs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/check-out/items" element={<Checkout />} />
        <Route path="/account-details" element={<AccountLayout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>
      <Footer />
    </>
  );
}

export default App;
