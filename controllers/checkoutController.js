const getCheckout = async (req, res) => {
    try {
        // for demo, rendering page with empty cart
        res.render("checkout", { 
            cartItems: [],
            subtotal: 0,
            tax: 0,
            total: 0
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
        
        // demo: simulate successful payment
        
        res.render("paymentSuccess", {
            orderNumber: `ORD-${Date.now()}`,
            email: email,
            total: req.body.total || "0.00"
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