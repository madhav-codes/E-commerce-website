const Product = require("../Models/productModel")
const Review = require("../Models/reviewModel")


exports.reviewProduct = async (req, res) => {
    try {
        const reviewed = await Review.findOne({ userId: req.user._id, productId: req.params._id })
        if (reviewed) {
            res.status(400).json({
                message: "You have already reviwed"
            })
        }
        else {
            const { review, rating } = req.body
            const productReview = await Review.create({
                review: review,
                rating: rating,
                userId: req.user._id,   // from auth.js
                productId: req.params._id
            })
            res.status(200).json({
                message: "Reviewed  Successfully:",
                productReview
            })
        }
    }
    catch (e) {
        console.log(e)
    }
}

exports.getProductReview = async (req, res) => {
    try {
        let overallRating = 0;
        const id = req.params._id
        const reviews = await Review.find({ productId: id })
        // const product=await Product.findOne({_id:id})
        for (var i in reviews) {
            overallRating = overallRating + reviews[i].rating;
        }
        const l = reviews.length;
        if (l == 0)
            overallRating = "Rating not available";
        else
            overallRating = overallRating / l;

        res.status(200).json({
            message: "Reviews",
            overallRating,
            reviwedBy: l + " people",
            Reviews: reviews
        })
    }
    catch (e) {
        console.log(e)
    }
}

exports.updateProductReview = async (req, res) => {
    try {
        const reviewed = await Review.findOne({ userId: req.user._id, productId: req.params._id })
        if (!reviewed) {
            res.status(404).json({
                message: "There is no review of your's"
            })
        }
        else {
            await Review.findByIdAndUpdate({ _id:reviewed._id },
                { review: req.body.review, rating: req.body.rating })
            res.status(200).json({
                message: "Review Updated Successfully",
                reviewed
            })
        }
    }
    catch (e) {
        console.log(e)
    }
}


exports.deleteProductReview = async (req, res) => {
    try {
        const review = await Review.findOne({ _id: req.params._id, userId: req.user._id })
        if (!review) {
            res.status(400).json({
                message: "No such Review is present"
            })
        }
        else {
            await Review.findByIdAndDelete({ _id: req.params._id })
            res.status(200).json({
                message: "Review deleted"
            })
        }
    }
    catch (e) {
        console.log(e)
    }
}

