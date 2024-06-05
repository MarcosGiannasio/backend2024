import { Router } from "express";
import uploader from "../utils/uploader.js"

const router = Router();
const products = []

// Funcion que genera id automático

const generarId = () => {
          let mayorId = 0;
      
          products.forEach((productoNuevo) => {
              if (productoNuevo.pid > mayorId) {
                  mayorId = productoNuevo.pid;
              }
          });
      
          return mayorId + 1;
      };

router.get("/", (req, res)=> {
          res.status(200).send({ state: "success", payload: products })
});


//busqueda por ID

router.get("/:pid", (req, res) => {
          const {pid} = req.params;
          const product = products.find((item) => item.pid === Number(pid));

          if (!product) {
                    return res.status(400).send({ "error": "no se encontró ningún producto con ese id"});
          }
          res.status(200).send({ payload: product });
});


//Agregar nuevo producto

router.post("/", uploader.single("file"), (req, res) => {
          const {file} = req;
          if (!file) {
                    res.status(400).send({state: "error", message:"no ha seleccionado una imagen"})
          }
          const {   title, 
                    description,
                    code, 
                    price, 
                    estado,
                    stock,
                    category, thumbnail} 
          = req.body;


          if ( !title || !description || !code || !price  || !estado || !stock || !category) {
                    return res.status(400).send({ "error": "Faltan datos"});
          }

          const productoNuevo = {
                    pid: generarId(),
                    title, 
                    description,
                    code,
                    price: Number(price),
                    estado: Boolean(estado),
                    stock: Number(stock),
                    category,
                    thumbnail: [`http://localhost:8080/public/images/${file.filename}`],};

          products.push(productoNuevo);

         res.status(200).send({ payload: productoNuevo, message: "Producto añadido con éxito" })
 });

// Modificación de producto por ID

router.put('/:pid', (req, res) => {
          const { pid } = req.params;
          const { title, description, code, price, estado, stock, category, thumbnail  } = req.body;
          const indice = products.findIndex((product) => product.pid === Number(pid));
      
          if (indice < 0) {
              return res.status(400).send({ status: "error", message: "Producto no encontrado" });
          }
      
          if (!title || !description || !code || !price || !estado || !stock || !category || !thumbnail) {
              return res.status(400).send({ status: "error", message: "Datos incompletos" });
          }
      
          // Esto reemplaza el usuario en el array
          products[indice] = {
                    pid: Number(pid),
                    title, 
                    description,
                    code,
                    price: Number(price),
                    estado: Boolean(estado),
                    stock: Number(stock),
                    category,
                    thumbnails: Array(thumbnails) 
                    };
      
          return res.status(200).send({ status: "success", message: "El producto se ha modificado con éxito" });
      });

// Eliminar un producto por id.
router.delete('/:pid', (req, res) => {
          const { pid } = req.params;
          const indice = products.findIndex((product) => product.pid === Number(pid));
      
          if (indice < 0) {
              return res.status(400).send({ status: "error", message: "Producto no encontrado" });
          }
      
          // Esto elimina el producto del array
          products.splice(indice, 1);
      
          return res.status(200).send({ status: "success", message:  `El producto id: ${pid}, se ha eliminado con éxito`});
      });

export default router;
