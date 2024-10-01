const router = require("express").Router();
const { json } = require("express");
const User = require("../models/User")
const bcrypt = require("bcrypt")


router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.error("Error during user registration:", error);
        
        // Send detailed error message to frontend
        res.status(500).json({
            success: false,
            message: "Failed to register user. Please try again later.",
            error: error.message, // Optional: You can remove this in production for security reasons
        });
    }
});



//login
router.post("/login", async (req,res)=>{
   
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).send("user not Found")
    
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send("incorrect password")
    
        
        validPassword && res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500);
    }
    
})
module.exports = router;

