import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { fetchCartItems, updateCartQuantity, deleteCartItem } from "../../Store/Slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { calculateCartItemTotals } from "../Constants";

const CartItems = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total, itemCount, loading } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);


    const handleQuantityChange = (id, qty) => {
        dispatch(updateCartQuantity({ cartItemId: id, newQuantity: qty }));
    };

    const handleDeleteItem = (id) => {
        dispatch(deleteCartItem(id));
    };

    const calculateCartTotals = (items) => {
        let subTotal = 0;
        let gst = 0;
        let totalQuantity = 0;

        items.forEach((item) => {
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


    return (
        <div className="mn-main-content">
            <div className="mn-breadcrumb m-b-30">
                <div className="row">
                    <div className="col-12">
                        <div className="row gi_breadcrumb_inner">
                            <div className="col-md-6 col-sm-12">
                                <h2 className="mn-breadcrumb-title">Cart Page</h2>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {/* Breadcrumb list */}
                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="mn-breadcrumb-item active">Cart Page</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart section */}
            <section className="mn-cart-section p-b-15">
                <h2 className="d-none">Cart Page</h2>
                <div className="row">
                    <div className="mn-cart-leftside col-lg-8 col-md-12">
                        <div className="mn-cart-content">
                            <div className="mn-cart-inner cart_list">
                                <div className="row">
                                    <form>
                                        <div className="table-content cart-table-content">
                                            <>
                                                {items.length === 0 ? (
                                                    <p className="text-center" >🛒 Cart is empty</p>
                                                ) : (
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Product</th>
                                                                <th>Price</th>
                                                                <th style={{ textAlign: "center" }}>Quantity</th>
                                                                <th>Total</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.map((item) => (
                                                                <tr key={item.cartItemId} className="mn-cart-product">
                                                                    <td data-label="Product" className="mn-cart-pro-name">
                                                                        <a href="product-detail.html">
                                                                            <img
                                                                                className="mn-cart-pro-img"
                                                                                src={`http://localhost:8081${item.product.productUrl}`}
                                                                                alt="Product-Image"
                                                                            />
                                                                            {item.product.productName}
                                                                        </a>
                                                                    </td>
                                                                    <td className="mn-cart-pro-price">
                                                                        Rs {item?.cartAddedOption[0]?.optionPrice}
                                                                    </td>
                                                                    <td className="mn-cart-pro-qty" style={{ alignItems: "center" }}>
                                                                        <div className="d-flex flex-row justify-content-between gap-2 align-items-center padding">
                                                                            <div>{item.cartQuantity}</div>
                                                                            <div className="d-flex flex-column align-items-center">
                                                                                <i
                                                                                    className="pi pi-angle-up"
                                                                                    style={{ fontSize: ".8rem" }}
                                                                                    onClick={() =>
                                                                                        handleQuantityChange(item.cartItemId, item.cartQuantity + 1)
                                                                                    }
                                                                                ></i>
                                                                                <i
                                                                                    className="pi pi-angle-down"
                                                                                    style={{ fontSize: ".8rem" }}
                                                                                    onClick={() =>
                                                                                        handleQuantityChange(item.cartItemId, item.cartQuantity - 1)
                                                                                    }
                                                                                ></i>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="mn-cart-pro-subtotal">Rs {item?.cartAddedOption[0]?.optionPrice * item.cartQuantity}</td>
                                                                    <td className="mn-cart-pro-remove">
                                                                        <a onClick={() => handleDeleteItem(item.cartItemId)}>
                                                                            <i className="ri-delete-bin-line"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </>
                                        </div>

                                        <div className="col-lg-12">
                                            <div
                                                className={`mn-cart-update-bottom ${items.length === 0 ? "single-item" : ""
                                                    }`}
                                            >
                                                <a onClick={() => navigate("/products")} className="continue-shopping-text">
                                                    Continue Shopping
                                                </a>

                                                {items.length >= 1 && (
                                                    <Link to='/check-out/items'>
                                                        <button
                                                            className="mn-btn-2"
                                                        >
                                                            <span>Check Out</span>
                                                        </button>
                                                    </Link>

                                                )}
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Area (optional) */}

                    {
                        items.length >= 1 && (
                            <div className="mn-cart-rightside col-lg-4 col-md-12 m-t-991">
                                <div className="mn-sidebar-wrap">

                                    <div className="mn-sidebar-block">
                                        <div className="mn-sb-title">
                                            <h3 className="mn-sidebar-title">Summary</h3>
                                        </div>

                                        {/* <div className="mn-sb-block-content">
                                    <div className="mn-cart-form">
                                        <p>Enter your destination to get a shipping estimate</p>
                                        <form action="#" method="post">
                                            <span className="mn-cart-wrap">
                                                <label>Country *</label>
                                                    <span className="mn-cart-select-inner">
                                                        <select name="gi_cart_country" id="mn-cart-select-country"
                                                            className="mn-cart-select">
                                                            <option selected="" disabled="">United States</option>
                                                            <option value="1">Country 1</option>
                                                            <option value="2">Country 2</option>
                                                            <option value="3">Country 3</option>
                                                            <option value="4">Country 4</option>
                                                            <option value="5">Country 5</option>
                                                        </select>
                                                    </span>
                                            </span>
                                            <span className="mn-cart-wrap">
                                                <label>State/Province</label>
                                                <span className="mn-cart-select-inner">
                                                    <select name="gi_cart_state" id="mn-cart-select-state"
                                                        className="mn-cart-select">
                                                        <option selected="" disabled="">Please Select a region,
                                                            state
                                                        </option>
                                                        <option value="1">Region/State 1</option>
                                                        <option value="2">Region/State 2</option>
                                                        <option value="3">Region/State 3</option>
                                                        <option value="4">Region/State 4</option>
                                                        <option value="5">Region/State 5</option>
                                                    </select>
                                                </span>
                                            </span>
                                            <span className="mn-cart-wrap">
                                                <label>Zip/Postal Code</label>
                                                <input type="text" name="postalcode" placeholder="Zip/Postal Code" />
                                            </span>
                                        </form>
                                    </div>
                                </div> */}

                                        <div className="mn-sb-block-content">
                                            <div className="mn-cart-summary-bottom">
                                                <div className="mn-cart-summary">
                                                    <div>
                                                        <span className="text-left">Sub-Total</span>
                                                        <span className="text-right">{subTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-left">GST (18%)</span>
                                                        <span className="text-right">{gst.toFixed(2)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-left">Shipping Charges</span>
                                                        <span className="text-right">{shippingCharges.toFixed(2)}</span>
                                                    </div>
                                                    <div className="mn-cart-summary-total">
                                                        <span className="text-left">Total Amount</span>
                                                        <span className="text-right">{totalAmount.toFixed(2)}</span>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }



                </div>
            </section>

        </div>
    );
};

export default CartItems;
