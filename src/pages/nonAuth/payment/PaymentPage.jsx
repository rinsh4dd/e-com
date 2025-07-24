import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../common/context/AuthProvider";
import { URL } from "../../../service/api";

function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [emiPlan, setEmiPlan] = useState("");
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India"
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios.get(`${URL}/users/${user.id}`)
      .then(({ data }) => {
        setCart(data.cart || []);
        if (data.shippingAddress) {
          setBillingAddress(data.shippingAddress);
        }
      })
      .catch(err => {
        console.error("Error fetching cart:", err);
        alert("Failed to load your cart");
      });
  }, [user, navigate]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const handlePayment = async () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    // Validate based on selected payment method
    if (selectedPaymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardName) {
        alert("Please enter cardholder name");
        return;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        alert("Please enter a valid expiry date (MM/YY)");
        return;
      }
      if (!cvv || cvv.length < 3) {
        alert("Please enter a valid CVV");
        return;
      }
    } else if (selectedPaymentMethod === "upi") {
      if (!upiId || !upiId.includes('@')) {
        alert("Please enter a valid UPI ID (e.g., name@upi)");
        return;
      }
    } else if (selectedPaymentMethod === "netbanking") {
      if (!selectedBank) {
        alert("Please select a bank");
        return;
      }
    } else if (selectedPaymentMethod === "emi") {
      if (!emiPlan) {
        alert("Please select an EMI plan");
        return;
      }
    }

    // Validate billing address
    if (!billingAddress.street || !billingAddress.city || !billingAddress.state || !billingAddress.zip) {
      alert("Please complete your billing address");
      return;
    }

    setIsProcessing(true);
    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      let paymentMethodText = "";
      if (selectedPaymentMethod === "card") {
        paymentMethodText = `VISA ****${cardNumber.slice(-4)}`;
      } else if (selectedPaymentMethod === "upi") {
        paymentMethodText = `UPI (${upiId})`;
      } else if (selectedPaymentMethod === "netbanking") {
        paymentMethodText = `Net Banking (${selectedBank})`;
      } else if (selectedPaymentMethod === "emi") {
        paymentMethodText = `EMI (${emiPlan})`;
      } else if (selectedPaymentMethod === "cod") {
        paymentMethodText = "Cash on Delivery";
      }

      const newOrder = {
        id: Date.now(),
        items: [...cart],
        totalAmount,
        paymentStatus: selectedPaymentMethod === "cod" ? "pending" : "completed",
        orderStatus: "processing",
        paymentMethod: paymentMethodText,
        billingAddress,
        createdAt: new Date().toISOString()
      };

      const { data: currentUser } = await axios.get(`${URL}/users/${user.id}`);
      
      await axios.patch(`${URL}/users/${user.id}`, {
        cart: [],
        orders: [...(currentUser.orders || []), newOrder],
        shippingAddress: billingAddress
      });

      navigate("/order-confirmation", { state: { orderId: newOrder.id } });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda"
  ];

  const emiPlans = [
    "3 months EMI (No Cost)",
    "6 months EMI (5% interest)",
    "9 months EMI (8% interest)",
    "12 months EMI (10% interest)"
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "https://www.obsbygg.no/cdn-cgi/image/width=1440,format=auto/globalassets/icons-and-illustrations/payment-and-shipping/2024/visa-logo.png?ref=A9B9C41BE3"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: "https://cdn.icon-icons.com/icons2/2699/PNG/512/upi_logo_icon_169316.png"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "https://tse2.mm.bing.net/th/id/OIP.VAhRNmCpZ8cFESkxcfdGWAHaHa?pid=Api&P=0&h=220"
    },
    {
      id: "emi",
      name: "EMI",
      icon: "https://static.vecteezy.com/system/resources/previews/013/656/949/original/emi-letter-logo-design-in-illustration-logo-calligraphy-designs-for-logo-poster-invitation-etc-free-vector.jpg"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "https://tse3.mm.bing.net/th/id/OIP.uCSz2iH3DI8qIe65edzMkAHaHa?pid=Api&P=0&h=220"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Please login to proceed with payment</p>
          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">P</div>
          <h1 className="text-3xl font-bold text-gray-800">Secure Payment</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Payment Method</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      selectedPaymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={method.icon} 
                      alt={method.name} 
                      className="h-8 mb-2 object-contain"
                    />
                    <span className="text-sm font-medium text-gray-700">{method.name}</span>
                  </button>
                ))}
              </div>

              {/* Card Payment Form */}
              {selectedPaymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {selectedPaymentMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    After clicking "Complete Payment", you'll be redirected to your UPI app to confirm the transaction.
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {selectedPaymentMethod === "netbanking" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]"
                    >
                      <option value="">Select your bank</option>
                      {banks.map((bank, index) => (
                        <option key={index} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    You'll be redirected to your bank's secure payment page to complete the transaction.
                  </div>
                </div>
              )}

              {/* EMI Form */}
              {selectedPaymentMethod === "emi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select EMI Plan
                    </label>
                    <select
                      value={emiPlan}
                      onChange={(e) => setEmiPlan(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]"
                    >
                      <option value="">Select EMI plan</option>
                      {emiPlans.map((plan, index) => (
                        <option key={index} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    EMI options are available for credit cards from selected banks only.
                  </div>
                </div>
              )}

              {/* COD Notice */}
              {selectedPaymentMethod === "cod" && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Cash on Delivery</h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>
                          Pay in cash when your order is delivered. An additional ₹50 processing fee applies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={billingAddress.zip}
                      onChange={(e) => setBillingAddress({...billingAddress, zip: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]"
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex items-start">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-md object-cover mr-3 border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm text-gray-800">₹{cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm text-gray-800">FREE</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax (18%)</p>
                <p className="text-sm text-gray-800">₹{(cartTotal * 0.18).toFixed(2)}</p>
              </div>
              {selectedPaymentMethod === "cod" && (
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">COD Fee</p>
                  <p className="text-sm text-gray-800">₹50.00</p>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-2">
                <p className="font-medium text-gray-800">Total</p>
                <p className="font-medium text-gray-800">
                  ₹{(selectedPaymentMethod === "cod" ? (cartTotal * 1.18 + 50) : (cartTotal * 1.18)).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !cart.length}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isProcessing || !cart.length 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing 
                ? 'Processing...' 
                : selectedPaymentMethod === "cod" 
                  ? 'Place Order (COD)' 
                  : 'Complete Payment'}
            </button>

            <div className="mt-4 text-xs text-gray-500">
              <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Secure Payment</h3>
              <div className="flex space-x-4">
                <img 
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" 
                  alt="Visa" 
                  className="h-8 opacity-70"
                />
                <img 
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" 
                  alt="Mastercard" 
                  className="h-8 opacity-70"
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" 
                  alt="UPI" 
                  className="h-8 opacity-70"
                />
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/196/196578.png" 
                  alt="Rupay" 
                  className="h-8 opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;