import { createContext, useEffect, useState } from "react"
import axios from 'axios'


export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState('');

    const url = 'http://localhost:8000'
    const [food_list, setFoodlist] = useState([])

    const addToCard = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }

    const fetchFoodlist = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodlist(response.data.data);

        } catch (error) {
            console.log(error)
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodlist();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])



    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCard,
        removeFromCart,
        getTotalCartAmount,
        url, token, setToken
    }

    return (

        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider