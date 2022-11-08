const express= require("express");
const  {isAuthenticatedUser,isAdmin}= require("../Middleware/auth");
const  {product, getProductDetails, getAllProducts, updateProductDetails, deleteProduct, getAllProductsByAggregation}= require("../Controllers/productController");


const router=express.Router();

router.route("/createProduct").post(isAuthenticatedUser,isAdmin,product);
router.route("/getProductDetails/:_id").get(getProductDetails);
router.route("/getAllProducts").get(getAllProducts);
router.route("/updateproductDetails/:_id").post(updateProductDetails)
router.route("/deleteProduct/:_id").delete(deleteProduct)
router.route("/getAllProductsByAggregation").get(getAllProductsByAggregation)


module.exports= router;
