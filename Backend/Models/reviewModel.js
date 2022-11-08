const mongoose = require("mongoose")

const productReview = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

const Review=mongoose.model("Review",productReview)

module.exports=Review;


