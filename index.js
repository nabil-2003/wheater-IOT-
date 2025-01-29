const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const DATA = require("./Modules/mongoose");
const { json } = require("stream/consumers");

let firstTime = true 
const app = express();
app.use(cors());
app.use(express.json())

// Use environment variable or config for database URI
const dbURI = process.env.MONGODB_URI ||  "mongodb+srv://filalinabil010:pbVYn8!5Pwdv_Md@cluster0.xaloc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const server = http.createServer(app);
const io = new socketIo.Server(server, { cors: { origin: "*" } });

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

app.get('/api/data', async  (req, res) => {
 const arr =    await week() ; 
 console.log(arr)
 res.json({data : arr })
});


// Single interval for fetching and saving data
setInterval(async () => {
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl&models=meteofrance_seamless");
    const data = await response.json();
    const dayName = new Date().getDay();

    console.log("Day Index:", dayName);

    // Save data to MongoDB
    await DATA.create({ day: dayName , date : new Date().getTime(), data: {temp : data.current.temperature_2m , pressure : data.current.pressure_msl , humidity: data.current.relative_humidity_2m}});
    console.log("Data saved successfully");

    // Broadcast updates to all connected clients
    io.emit("generateUpdate", JSON.stringify( {temperature : data.current.temperature_2m , pressure : data.current.pressure_msl , humidity: data.current.relative_humidity_2m}));

    // Optionally, fetch and send weekly data if needed
  } catch (err) {
    console.error("Error in generating data or saving to DB:", err);
  }
}, 10000); // Every 10 seconds
io.on("sendforThefirstTime" , (data)=>{
  week();
})

setInterval( async ()=>{
  const weekData = await DATA.find({
    date: {
      $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).getTime(), // 7 days ago
      $lte: new Date().getTime() // Current date
    }
  });
  let array = []
     for (let index = 0; index < 7; index++) {
      let s = {t  :0 , p :0  , h : 0 }
      let m =0 
        weekData.forEach((e , i , t )=> {
          
          if(e.day == index){
               s.t += e.data.temp 
               s.p += e.data.pressure
               s.h += e.data.humidity
                m++; 
          }

        }
        
      )
      s.t /= m
      s.p /=m
      s.h /= m
      array.push(s) 
     }
     
  io.emit("weekData" , JSON.stringify(array)) ; 

} , 10000)
io.on("connection", (sc) => {
  console.log("Client connected:", sc.id);

  // Handle client disconnection
  sc.on("disconnect", () => {
    console.log("Client disconnected:", sc.id);
  });
});

