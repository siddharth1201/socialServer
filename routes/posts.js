const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User")

//create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }
    catch (e) {
        res.status(500).json(e)
    }
})

//update
router.put("/:id", async (req, res) => {
   
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.body.userId) {
            await post.updateOne({$set:req.body})
            res.status(200).json("the post has been updated")


        }
        else {
            res.status(403).json("you can update only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})

//delet
router.delete("/:id", async (req, res) => {
   
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.body.userId) {
            await post.deleteOne()
            res.status(200).json("the post has been deleted")            
        }
        else {
            res.status(403).json("you can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})



//like
router.put("/:id/like", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId} });
            res.status(200).json("The post has been liked")
            console.log(post);
            
        }
        else{
            await post.updateOne({$pull:{likes :req.body.userId}})
            res.status(200).json("The post has been disliked");

        }


    } catch (error) {
        res.status(500).json(error);
    }   
})


//get
router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);
    }
    catch{
        res.status(500).json("post not found")
    }
})

//timeline posts
router.get("/timeline/all/:userId", async (req,res)=>{
    try{
        console.log(req.body);
        
        const currUser = await User.findById(req.params.userId);
        
        const userPosts = await Post.find({userId : currUser._id});
        console.log("this works");
        const friendPosts = await Promise.all(
            currUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        )
        res.json(userPosts.concat(...friendPosts))
        
    }
    catch (err){
        res.status(500).json("err");
    }
})


module.exports = router;

