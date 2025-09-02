export const BaseUrl = "http://localhost:8081/api/"
export const serverPort = "http://localhost:8081"

export const API_METHODS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
}

export const userRoles = {
  user: "user",
  admin: "admin",
};

export const logout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export const SidebarType = {
  MENU: "menu",
  CART: "cart",
  WISHLIST: "wishlist"
}

export const initialAddressState = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  phone: '',
  alterPhone: '',
  addressType: '',
};

export const calculateCartItemTotals = (item, gstRate = 18) => {
  const price = item?.cartAddedOption?.[0]?.optionPrice;
  const quantity = item?.cartQuantity;

  const subTotal = quantity * price;
  const gst = (subTotal * gstRate) / 100;
  const shippingCharges = quantity > 1 ? 0 : 50;
  const totalAmount = subTotal + gst + shippingCharges;

  return {
    subTotal,
    gst,
    shippingCharges,
    totalAmount,
  };
};

export const menuItems = [
  { name: "Home", path: "/", icon: "pi pi-home" },
  // { name: "Categories", icon: "pi pi-th-large" },
  { name: "Products", path: "/products", icon: "pi pi-shopping-bag" },
  { name: "My Account", path: "/account-details", icon: "pi pi-user" },
  {
    name: "Pages",
    icon: "pi pi-clone",
    children: [
      { name: "About Us", path: "/about-us" },
      { name: "Cart", path: "/cart-items" },
      { name: "Check Out", path: "/check-out/items" },
      { name: "Contact Us", path: "/contact-us" },
      { name: "FAQs", path: "/frequently-asked-questions" },
    ],
  },
  // { name: "Blog", path: "/blog", icon: "pi pi-book" },
  { name: "Logout", path: "/", icon: "pi pi-sign-out" },
  { name: "Login", path: "/login", icon: "pi pi-sign-in" },
];


export const isUserLoggedIn = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return !!(userId && token && role);
};

export const RAZORPAY_KEY = "rzp_test_4OZcnUQlJc16Lu";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!email) {
    return "Email is required";
  }
  if (!regex.test(email)) {
    return "Please enter a valid email address";
  }
  return ""; 
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

export const validateUsername = (username) => {
  if (!username.trim()) return "Username is required";
  return "";
};

export const isVideo = (url) => {
  return url.match(/\.(mp4|webm|ogg)$/i);
};

export const addNavigation = (url) => {
   navigation(url)
}