const express= require("express");
const  {isAuthenticatedUser, isAdmin}= require("../Middleware/auth");
const  {Register,login,logout,updateDetails,updatePassword,create,read,put,patch,Delete, getAllUsers, makeAdmin}= require("../Controllers/userController");

const router=express.Router();
router.route("/Register").post(Register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticatedUser,logout);
router.route("/updateDetails").post(isAuthenticatedUser,updateDetails);
router.route("/updatePassword/:__id").post(isAuthenticatedUser,updatePassword);
router.route("/getAllUsers").get(isAuthenticatedUser,isAdmin,getAllUsers);
router.route("/makeAdmin/:__id").post(isAuthenticatedUser,isAdmin,makeAdmin);
router.route("/create").post(create);
router.route("/read").get(read);
router.route("/put").put(put);
router.route("/patch").patch(patch);
router.route("/delete/:__id").delete(Delete);
// router.route("/api1").post(api1);



module.exports = router;
