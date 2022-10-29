import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js"; // import product routenya

const app = express(); // inisiasi servernya

app.use(cors()); // inisiasi cors
app.use(express.json()); // inisiasi olah data dalam format json
app.use(fileUpload()); // inisiasi fileupload
app.use(express.static("public")); // menjadikan folder public jadi folder static (tidak perlu dicantumkan di url)
app.use(ProductRoute); // inisiasi penggunaan product routenya

// jalankan servernya di port 5000
app.listen(5000, ()=> console.log('Server up and running'));