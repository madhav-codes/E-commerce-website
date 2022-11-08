const Product = require("../Models/productModel")
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const ErrorHandler = require("../Utils/errorHandler");

exports.product = async (req, res) => {
    try {
        const product = await Product.create({
            Image: req.body.Image,
            Name: req.body.Name,
            Company: req.body.Company,
            Category: req.body.Category,
            Features: req.body.Features,
            Currency: req.body.Currency,
            Price: req.body.Price,
            Quantity: req.body.Quantity,
            Rating: req.body.Rating,
            Review: req.body.Review,
            SellerId: req.user._id //req.user(defined in auth.js) will give all details from mongodb
            // SellerID: jwt.verify(req.cookies.token , process.env.JWT_SECRET_KEY).id
        })
        console.log(product);
        res.status(200).json({  //status=200 means ok
            success: true, //used for error handling
            product  //sends mongo db details to postman(client)
        })
    }
    catch (e) {
        console.log(e)
        // res.send(e);
    }
}

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params._id).populate("SellerId"); //populate is used connect and get details from another table
    //(which id to update taken from params)
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }
    res.json({
        success: true,
        product
    });
})


exports.getAllProductsByAggregation = async (req, res) => {
    try {
        let { Company, priceG, priceL, page } = req.query
        priceG = Number(priceG)
        priceL = Number(priceL)
        const resultPerPage = 1;
        const product = await Product.aggregate([
            {
                $match: {
                    $and:
                        [{ Company: Company },
                        { Price: { $gte: priceG } },
                        { Price: { $lte: priceL } }
                        ]
                }
            },
            {
                $lookup: {       //to populate for multiple foreign id
                    from: "users",
                    localField: "SellerId",
                    foreignField: "_id",
                    as: "seller"
                }
            },
            {
                $facet: {
                    metadata:                       //summary of data(numerical property)
                        [{ $count: "total" }
                        ],
                    data:                           //actual data
                        [{ $skip: (page - 1) * resultPerPage },
                        { $limit: resultPerPage }
                        ]
                }
            }
        ])
        res.status(202).json({
            product
        })
    }
    catch (e) {
        console.log(e)
    }
}



exports.getAllProducts = async (req, res) => {
    try {

        const { keyword, price } = req.query
        const resultPerPage = 3
        const page = req.query.page ? req.query.page : 1

        // console.log(!!keyword)

        if (price) {
            var priceInString = JSON.stringify(price) // object to string so that we can change its property
            priceInString = priceInString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`) //regex f'n to place $ , /g-global
            var priceInObject = JSON.parse(priceInString) // string to object
        }
        // console.log(priceInString)
        // console.log(priceInObject)

        let filter = []
        // filter.push("hi!!")
        keyword &&
            filter.push({
                $or:
                    [{ Name: { $regex: keyword, $options: "i" } },
                    { Company: { $regex: keyword, $options: "i" } }
                    ]
            })

        price &&
            filter.push({
                "Price": priceInObject
            })


        // console.log(filter)

        const product = await Product.find(
            filter.length ? {
                $and: filter
            } : {}).skip(resultPerPage * (page - 1)).limit(resultPerPage)


        res.status(200).json({ product })

    }
    catch (e) {
        console.log(e)
    }
}


exports.updateProductDetails = async (req, res) => {
    try {
        const { Image, Name, Company, Category, Features, Currency, Number, Quantity, Rating, Review } = req.body
        const product = await Product.findByIdAndUpdate(req.params._id, { Image: Image, Name: Name, Company: Company, Category: Category, Features: Features, Currency: Currency, Number: Number, Quantity: Quantity, Rating: Rating, Review: Review })
        res.status(200).json({
            message: "Product Details Updated",
            product
        })
    }
    catch (e) {
        console.log(e)
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params._id;
        const product = await Product.findOne({ _id: id })
        if (!product) {
            res.status(404).json({
                message: "No Such Product is available"
            })
        }
        else {
            await Product.findByIdAndDelete(id)
            res.status(200).json({
                message: "Product Deleted"
            })
        }
    }
    catch (e) {
        console.log(e)
    }
}
