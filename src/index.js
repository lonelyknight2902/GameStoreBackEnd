const express = require("express"); 
const bodyParser = require("body-parser");
const v1GameRouter = require("./v1/routes/gameRoutes");
const v1UserRouter = require("./v1/routes/userRoutes")
const cors = require("cors");

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1/games", v1GameRouter);
app.use("/api/v1/user", v1UserRouter);

app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
});