import UserModel from "../models/userModel.js";


//add item to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }
        await UserModel.findByIdAndUpdate(req.userId, { cartData });

        return res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" })
    }
}


//remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1
        }

        await UserModel.findByIdAndUpdate(req.userId, { cartData });
        return res.json({ success: true, message: "Removed from Cart" })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" })
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = await userData.cartData;
        return res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" })
    }


}

export { addToCart, removeFromCart, getCart }