const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Product = require("../models/Product");
const Client = require("../models/Client");


//get all favorited products by user
router.get("/user/favorites",checkAuth, async (req, res) => {

try {
  let user = await Client.findById(req.userData.id).lean()
  if(!user){
   return res.status(400).json({
      error: "Could not locate user"
    })
  }else {
    return res.status(200).json(user.favorites)
  }
} catch (error) {
  console.log(error)
  return res.status(404).json(error)
}

});

router.get("/user", checkAuth, async (req, res)=>{
  try {
    let user = await req.userData
    if(!user){
      return res.status(400).json({
        error: "User not found"
      })
    }else {
      return res.status(200).json(user)
    }

  } catch (error) {
    return res.status(404).json(error)
  }
})


//add favorited product to user favorited list
router.post("/user/:productId/favorites", checkAuth, async (req, res)=>{
try {
  let product = await Product.findById(req.params.productId).lean();
  if(!product){
   return res.status(400).json({
      error: "could not locate product in store"
    })
  }else{
    Client.update(
      {"_id": req.userData.id},
      {
        $push: {
          favorites: product 
        }
      }
    ).then(()=> {
     return res.status(200).json({
        message: "Added to favorites successfully"
      })
    }).catch((err)=>{
      console.log(err);
      return res.status(400).json({
        error: "Unable to add to favorites" + " " + err
      })
    })
  }

} catch (error) {
  console.log(error)
 return res.status(404).json({
    error: "could not complete task to favorite"
  })
}
})

//remove unfavorited product from user list 
router.delete("/user/:productId/favorites", checkAuth, async (req, res)=>{

  try {
    let product = await Product.findById(req.params.productId).lean();
  if(!product){
   return res.status(400).json({
      error: "could not locate product in store"
    })
  }else{
    Client.update(
      {"_id": req.userData.id},
      {
        $pull: {
          favorites: product 
        }
      }
    ).then(()=> {
      return res.status(200).json({
        message: "Removed from favorites successfully"
      })
    }).catch((err)=>{
      console.log(err);
     return res.status(400).json({
        error: "Unable to remove from favorites" + " " + err
      })
    })
  }
  } catch (error) {
    console.log(error)
    return res.status(404).json(error)
  }
})

//get all carted products of user
router.get("/user/cart", checkAuth, async (req, res)=>{
  try {
    let user = await Client.findById(req.userData.id).lean()
    if(!user){
     return res.status(400).json({
        error: "Could not locate user",
      })
    }else {
      return res.status(200).json(user.addedToCart)
    }
  } catch (error) {
    console.log(error)
    return res.status(404).json(error)
  }

})

//add single product to user cart 
router.post("/user/:productId/cart", checkAuth, async (req, res)=>{
  try {
    let product = await Product.findById(req.params.productId).lean();
    if(!product){
     return res.status(400).json({
        error: "could not locate product in store"
      })
    }else{
      Client.update(
        {"_id": req.userData.id},
        {
          $push: {
            addedToCart: product 
          }
        }
      ).then(()=> {
       return res.status(200).json({
          message: "Added to Cart successfully"
        })
      }).catch((err)=>{
        console.log(err);
        return res.status(400).json({
          error: "Unable to add to cart" + " " + err
        })
      })
    }
  
  } catch (error) {
    console.log(error)
   return res.status(404).json({
      error: "could not complete task to Cart"
    })
  }
})


//remove single product from user cart 
router.delete("/user/:productId/cart", checkAuth, async (req, res)=>{
  try {
    let product = await Product.findById(req.params.productId).lean();
  if(!product){
   return res.status(400).json({
      error: "could not locate product in store"
    })
  }else{
    Client.update(
      {"_id": req.userData.id},
      {
        $pull: {
          addedToCart: product 
        }
      }
    ).then(()=> {
      return res.status(200).json({
        message: "Removed from Cart successfully"
      })
    }).catch((err)=>{
      console.log(err);
     return res.status(400).json({
        error: "Unable to remove from Cart" + " " + err
      })
    })
  }
  } catch (error) {
    console.log(error)
    return res.status(404).json(error)
  }
})

module.exports = router;
