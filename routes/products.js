const express = require("express");
const router = express.Router();
const formidable = require('formidable');
const detect = require('detect-file-type');
const { v1: uuidv1 } = require('uuid')
const checkAuth = require('../middleware/check-auth');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product')


//@desc   POST a product to store
//@route
router.post("/create", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=> {
        console.log(fields)
       

        if(err){
            return res.status(404).json({
                error: "Error in file" + " " + err
            })
        }

        detect.fromFile( files.image.path, (err, result)=> {
            const imageName = uuidv1()+"."+result.ext
            const allowedImageTypes = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"];

            if(! allowedImageTypes.includes(result.ext)){
                return res.status(404).json({
                    message: "Image type not allowed"
                })
            }

            const oldPath = files.image.path;
            const newPath = path.join(__dirname,"..","pictures", imageName)
    
            fs.rename(oldPath, newPath, err => {
                if(err){
                    console.log(err)
                    return res.status(404).json({
                        error: "cannot move file"
                    })
                }
                const newProduct = new Product({
                    title: fields.title,
                    price: parseFloat(fields.price),
                    descriptionOfProduct: fields.descriptionOfProduct,
                    company: fields.company,
                    category: fields.category,
                    image: newPath,
                    outOfStock: false
                })

                newProduct
                .save()
                .then(() => {
                 return res.status(200).json({
                    message: "Product created Successfully",
                  });
                  
                })
                .catch((error) => {
                 return res.status(404).json({
                    message: "An error occured" + error,
                  });
                });

                
                
            })

        })

    })
  
});



//get a particular product
router.get("/:productId", async (req, res) => {
    try {
        let product = await Product.findById(req.params.productId)
         .populate('product')
         .lean()
         if(!product){
             return res.status(400).json({
                 message: "product not found"
             })
         }
 
         return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
   });






//delete particular product or item
router.delete("/:productId", async (req, res) => {
    try {
        await Product.remove({ _id: req.params.productId })
        
        return res.status(200).json({
            message: `product with id ${req.params.productId} deleted succesfully`
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
  }); 
  



//update a particular product or item




//get all products
router.get("/all", async (req, res, next)=> {
    try {
        const products = await Product.find({
            outOfStock: false
        }).populate('product')
        .sort({ createdAt: 'desc'})
        .lean()
        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error
        })
    }
   
})



module.exports = router;