import { useState, useEffect } from 'react';
import axios from '../services/customizeAxios';

const useCartCount = () => {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
            let userId = localStorage.getItem("userId");

            if (!userId) {
                const user = localStorage.getItem("user");
                if (user) {
                    try {
                        const userObj = JSON.parse(user);
                        userId = userObj.id;
                    } catch (e) {
                        console.error("Error parsing user data:", e);
                    }
                }
            }

            if (!accessToken || !userId) {
                setCartCount(0);
                return;
            }

            const res = await axios.get(`/api/shopping-cart/items?userId=${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const totalCount = res.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(totalCount);
        } catch (err) {
            console.error("Cart count fetch error:", err);
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Refresh cart count every 30 seconds
        const interval = setInterval(fetchCartCount, 30000);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            clearInterval(interval);
        };
    }, []);

    return { cartCount, refreshCartCount: fetchCartCount };
};

export default useCartCount;
