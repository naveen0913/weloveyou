export const BaseUrl = "http://localhost:8081/api/"
export const serverPort = "http://localhost:8081"
export const cartImageUrlPort = "http://localhost:8081/uploads/"

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
  { name: "Logout", path: "/", icon: "pi pi-sign-out" },
  { name: "Login", path: "/login", icon: "pi pi-sign-in" },
];



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

export const TrackingStatus = {
  placed: "ORDER_PLACED",
  packed: "PACKED",
  shipped: "SHIPPED",
  out_for_delivery: "OUT_FOR_DELIVERY",
  delivered: "DELIVERED"
}

export const ProductCategories = ["All", "Stickers", "Tables Book", "Pencils"];

export const TrackingSteps = [
  { index: 1, label: <>Order<br />confirmed</>, icon: "ri-shield-check-line" },
  { index: 2, label: <>Processing<br />order</>, icon: "ri-settings-5-line" },
  { index: 3, label: <>Quality<br />check</>, icon: "ri-gift-line" },
  { index: 4, label: <>Product<br />dispatched</>, icon: "ri-truck-line" },
  { index: 5, label: <>Product<br />delivered</>, icon: "ri-home-4-line" },
];

export const convertToWebP = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let { width, height } = img;

        // ✅ Resize if image is larger than max
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, ".webp"),
                { type: "image/webp" }
              );
              resolve(webpFile);
            } else {
              reject(new Error("WebP conversion failed"));
            }
          },
          "image/webp",
          quality 
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const convertMultipleToWebP = async (files) => {
  return Promise.all(files.map((file) => convertToWebP(file)));
};


export const getDesignUrlFromThumbnail = (selectedThumbnail, designs) => {
  if (!selectedThumbnail || !designs) return null;

  const match = designs.find(
    (d) => d.designName.toLowerCase() === selectedThumbnail.thumbnailName.toLowerCase()
  );

  return match?.designImages?.[0]?.designUrl;
}