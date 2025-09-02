import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { SidebarType, calculateCartItemTotals, isVideo, menuItems, serverPort } from "./Constants";
import { updateCartQuantity, deleteCartItem, fetchCartItems } from "../Store/Slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './styles.css';
import { userLogout } from "./hooks/userLogout";


const CustomSidebar = ({ visible, onHide, heading, position, sidebarType }) => {

    const dispatch = useDispatch();
    const { items, total, itemCount, loading } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);

    const logout = userLogout();
    const nav = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    const updateCartItem = async (cartId) => {
        const currentItem = cartList.find((item) => item.cartItemId === cartId);
        if (!currentItem) return;

        const updatedCart = cartList.map((item) =>
            item.cartItemId === cartId
                ? { ...item, cartGiftWrap: newGiftWrapValue }
                : item,
        );
        setCartList(updatedCart);

        const formData = new FormData();
        const cartPayload = {
            // cartGiftWrap: newGiftWrapValue,
            cartQuantity: currentItem.cartQuantity,
        };
        formData.append("cartPayload", JSON.stringify(cartPayload));

        try {
            const res = await axios.update(`http://localhost:8081/api/cart/update/${cartId}`);
            if (res.data.code === 200) {
                const updatedCart = cartList.filter((item) => item.cartItemId !== cartId);
                // setCartItems(updatedCart);
                // setCartCount(updatedCart.length);
                toast.success("Removed from the cart!", { autoClose: 1000 });
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    }


    const handleQuantityChange = (id, qty) => {
        dispatch(updateCartQuantity({ cartItemId: id, newQuantity: qty }));
    };

    const handleDeleteItem = (id) => {
        dispatch(deleteCartItem(id));
    };

    const calculateCartTotals = (itemsList) => {
        let subTotal = 0;
        let gst = 0;
        let totalQuantity = 0;

        itemsList.forEach((item) => {
            const { subTotal: itemSub, gst: itemGst } = calculateCartItemTotals(item);

            subTotal += itemSub;
            gst += itemGst;
            totalQuantity += item?.cartQuantity;
        });
        const shippingCharges = itemCount >= 2 ? 0 : 50;

        const totalAmount = subTotal + gst + shippingCharges;

        return { subTotal, gst, shippingCharges, totalAmount };
    };
    const { subTotal, gst, shippingCharges, totalAmount } = calculateCartTotals(items);


    const filteredMenu = menuItems.filter((menu) => {
        if (menu.name === "My Account" || menu.name ==="Logout") {
            return isAuthenticated; 
        }
        if (menu.name==="Login") {
            return !isAuthenticated;
        }
        if (menu.children) {
            menu.children = menu.children.filter((child) => {
                if (child.name === "Check Out") {
                    return isAuthenticated;
                }
                return true;
            });
        }
        return true;
    });

    const onChangeMenu = (menu) => {
        if (menu.name === "Logout") {
            nav("/");
            logout();
            onHide?.();
        } else if (menu.path) {
            nav(menu.path);
            onHide?.();
        } else if (menu.children) {
            toggleMenu(menu.name);
        }
    };

    const customHeader = (
        <div className="d-flex flex-row align-items-center gap-2">
            <span className="font-bold text-lg"
                style={{
                    color: sidebarType === SidebarType.MENU ? "#ffffff" : "#000",
                    fontWeight: sidebarType === SidebarType.MENU ? '700' : 'normal',
                }}
            >
                {heading}
            </span>
        </div>
    );

    return (
        <Sidebar
            className="sidebar-style"
            position={position}
            header={customHeader}
            visible={visible}
            onHide={onHide}
            style={{
                backgroundColor: sidebarType === SidebarType.MENU ? "#0a1d37" : "#ffffff",
            }}
        >
            {sidebarType === SidebarType.CART && (
                <div className=" d-flex flex-column gap-3">
                    {items.length >= 1 && items.map((item) => (
                        <div key={item.cartItemId} className="card d-flex flex-row justify-content-between">
                            <div
                                className=" d-flex flex-row gap-3 border-round shadow-1 p-2"
                                style={{ background: "#fff" }}>
                                    
                                {isVideo(item.product.productUrl) ? (
                                    <video
                                        src={serverPort + `${item.product.productUrl}`}
                                        width="80"
                                        height="80"
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            nav(`/product-details/${item.product.productId}`);
                                            onHide();
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={serverPort + `${item.product.productUrl}`}
                                        alt={item.product.productName}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            nav(`/product-details/${item.product.productId}`);
                                            onHide();
                                        }}
                                    />
                                )}

                                <div className="d-flex flex-column">
                                    <div>{item.product.productName}</div>

                                    <span className="text-sm">
                                        Rs {item?.cartAddedOption && item.cartAddedOption.length > 0
                                            ? item.cartAddedOption[0].optionPrice
                                            : ""}.00 × {item.cartQuantity}
                                        {/* Rs {item.optionPrice}.00 × {item.cartQuantity} */}
                                    </span>

                                    <div className=" d-flex flex-row align-items-center gap-3 qty-container">
                                        <i className="pi pi-minus" onClick={() => handleQuantityChange(item.cartItemId, item.cartQuantity - 1)} style={{ fontSize: ".6rem" }} ></i>
                                        <span className="qty-style">{item.cartQuantity}</span>
                                        <i className="pi pi-plus" onClick={() => handleQuantityChange(item.cartItemId, item.cartQuantity + 1)} style={{ fontSize: ".6rem" }} ></i>
                                    </div>
                                </div>


                            </div>
                            <div className="d-flex flex-column gap-3 p-2">

                                <i
                                    className="pi pi-times" style={{ fontSize: ".7rem", color: "gray" }}
                                    onClick={() => handleDeleteItem(item.cartItemId)}
                                ></i>
                            </div>
                        </div>

                    ))}
                    {
                        items.length === 0 && (
                            <div>
                                <hr className="no-spacing" />
                                <p className="mt-2">
                                    Your Cart is Empty!
                                </p>
                            </div>
                        )
                    }
                </div>
            )}

            {
                items.length >= 1 && sidebarType === SidebarType.CART && (
                    <>
                        <div className="mt-5">
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex flex-row justify-content-between">
                                    Sub-Total: <span>Rs {subTotal}</span>
                                </div>
                                <div className="d-flex flex-row justify-content-between">
                                    GST: <span>Rs {gst.toFixed(2)}</span>
                                </div>
                                <div className="d-flex flex-row justify-content-between">
                                    shipping: <span>Rs {shippingCharges}</span>
                                </div>
                                <hr className="no-spacing" />
                                <div className="d-flex flex-row justify-content-between">
                                    Total: <span>Rs {totalAmount}</span>
                                </div>
                                <div className="d-flex flex-row justify-content-between mt-2">

                                    <button className="mn-btn-2" onClick={() => { nav('/cart-items'); onHide() }} >
                                        Cart
                                    </button>

                                    <button className="mn-btn-2" onClick={() => { nav('/check-out/items'); onHide() }} >Checkout
                                    </button>
                                </div>
                            </div>
                        </div>



                    </>
                )
            }
            <br />

            {sidebarType === SidebarType.MENU && (
                <div className="menu-sidebar d-flex flex-column justify-content-between">
                    <ul className="list-unstyled menu-list">
                        {filteredMenu.map((menu, index) => (
                            <li key={index} className="menu-item mt-2">
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    onClick={() => onChangeMenu(menu)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className="text-white">
                                        <i className={`${menu.icon || ""} me-1`}></i> {menu.name}
                                    </span>
                                    {menu.children && (
                                        <i
                                            className={`pi text-white ${openMenu === menu.name ? "pi-minus" : "pi-plus"}`}
                                            style={{ fontSize: ".6rem" }}
                                        ></i>
                                    )}
                                </div>

                                {menu.children && openMenu === menu.name && (
                                    <ul className={`submenu ${openMenu === menu.name ? "expanded" : "collapsed"}`}>
                                        {menu.children.map((child, i) => (
                                            <li
                                                key={i}
                                                className="submenu-item"
                                                onClick={() => {
                                                    nav(child.path);
                                                    onHide?.();
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {child.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="sidebar-icon-container">
                        <a href="#" className="social-icon">
                            <i className="pi pi-facebook" style={{ fontSize: "1.5rem" }}></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="pi pi-twitter" style={{ fontSize: "1.5rem" }}></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="pi pi-instagram" style={{ fontSize: "1.5rem" }}></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="pi pi-linkedin" style={{ fontSize: "1.5rem" }}></i>
                        </a>
                    </div>
                </div>
            )
            }


        </Sidebar>
    );
};

export default CustomSidebar;
