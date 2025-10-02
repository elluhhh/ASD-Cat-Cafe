const getCheckout = async (req, res) => {
    try {
        // Demo: dummy cart items
        const dummyCart = [
            { name: "Cappuccino", price: 4.50, qty: 2 },
            { name: "Croissant", price: 3.25, qty: 1 },
            { name: "Cat Playtime (30 min)", price: 12.00, qty: 1 }
        ];
        
        // Calculate totals
        const subtotal = dummyCart.reduce((sum, item) => sum + (item.price * item.qty * 100), 0);
        const tax = Math.round(subtotal * 0.10);
        const total = subtotal + tax;
        
        res.render("checkout", { 
            cartItems: dummyCart,
            subtotal: subtotal,
            tax: tax,
            total: total
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const processPayment = async (req, res) => {
    try {
        const { cardNumber, cardName, expiry, cvv, email } = req.body;
        
        // Validation (U126 - secure input)
        if (!cardNumber || !cardName || !expiry || !cvv || !email) {
            return res.status(400).send("All payment fields required");
        }
        
        // Basic card number validation
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            return res.status(400).send("Invalid card number format");
        }
        
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send("Invalid email format");
        }
        
        // Demo: dummy cart items (same as above for consistency)
        const dummyCart = [
            { name: "Cappuccino", price: 4.50, qty: 2 },
            { name: "Croissant", price: 3.25, qty: 1 },
            { name: "Cat Playtime (30 min)", price: 12.00, qty: 1 }
        ];
        
        res.render("paymentSuccess", {
            orderNumber: `ORD-${Date.now()}`,
            email: email,
            total: req.body.total || "0.00",
            cartItems: dummyCart  // Pass cart items to success page
        });
    } catch (err) {
        console.error("Payment error:", err);
        res.status(500).send("Payment processing failed");
    }
};

module.exports = {
    getCheckout,
    processPayment
};