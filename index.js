
const express = require("express")
const cors = require('cors');



const app = express();

const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config()



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("CONNECTED");
}


//MIDDLEWARE
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

const corsOptions = {
  origin: 'http://localhost:5173/',//(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.listen(8800, ()=>{
    console.log("server is running new");
})