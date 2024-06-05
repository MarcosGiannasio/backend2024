import express from "express";
import path from "path";
import productsRouter from "./routes/products.router.js"
//import petsRouter from "./routes/products.router.js"


const PORT = 8080
const HOST = "localhost"
const server = express();

server.use(express.urlencoded({extended:true}))
server.use(express.json())

server.use("/public", express.static(path.join(path.basename("src"),"public")));


server.use("/api/products", productsRouter);
//server.use("/api/carts", cartsRouter);


server.listen(PORT, () => {
          console.log(`Ejecutandose en http://${HOST}:${PORT}`);
})