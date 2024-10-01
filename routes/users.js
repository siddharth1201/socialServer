const { request } = require("express");
const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async (req, res) => {

   
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }
            catch (e) {
                console.log(e);
                return res.status(500).json(e)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })

            res.status(200).json("ACcount has been updated")
        } catch (error) {
            res.status(400).json(error)
        }
    } else {
        return res.status(403).json("you can update only your account")

    }
}
)


// delete user
// route.delete()

router.delete("/:id", async (req, res) => {
    //console.log(req);
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        console.log(req.params.id);
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("ACcount has been deleted")

        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        return res.status(403).json("you can delete only your account")

    }
}
)


// //get a user
// route.get()
router.get("/:id", async (req, res) => {
    //console.log(req);
    try{
        const user = await User.findById(req.params.id)
        const {password, createdAt, updatedAt, ...other} = user._doc
        
        res.status(200).send(other)
    }
    catch(err){
        console.log(err);
        res.status(500).send("user Not found")

    }
}
)


// //follow a user
// route.get()
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers : req.body.userId}})
                await currUser.updateOne({$push:{ followings:req.body.userId}})

                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you already follow this user")
            }
        } catch (error) {
            res.status(403).json("you already follow this user")
        }

    }
    else {
        res.status(403).json("can't follow yourself")
    }
    

})


//unfollow a user
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currUser = await User.findById(req.body.userId);
            if(!currUser.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers : req.body.userId}})
                await currUser.updateOne({$pull:{ followings:req.body.userId}})

                res.status(200).json("user has been funollowed");
            }else{
                res.status(403).json("you don't follow this user");
            }
        } catch (error) {
            res.status(403).json("you ")
        }

    }
    else {
        res.status(403).json("can't unfollow yourself")
    }
    

})


module.exports = router;
