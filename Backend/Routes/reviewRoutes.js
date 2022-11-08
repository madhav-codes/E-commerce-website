const express=require("express")
const { reviewProduct, getProductReview, deleteProductReview, updateProductReview } = require("../Controllers/reviewController")
const { isAuthenticatedUser } = require("../Middleware/auth")


const router=express.Router()

router.route("/reviewProduct/:_id").post(isAuthenticatedUser,reviewProduct)
router.route("/getProductReview/:_id").get(getProductReview)
router.route("/deleteProductReview/:_id").delete(isAuthenticatedUser,deleteProductReview)
router.route("/updateProductReview/:_id").post(isAuthenticatedUser,updateProductReview)

module.exports=router;