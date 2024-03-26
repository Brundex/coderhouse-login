import { Router } from "express";
import { ProductManager } from '../config/ProductManager.js'

const productManager = new ProductManager('./src/data/products.json')
const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        console.log(query)

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });
        console.log(ordQuery)
        res.status(200).send(prods)

    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        });
    }
});


productsRouter.get('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid 
        const prod = await productManager.getProductById(idProducto)
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto no existe")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        console.log(product)
        const mensaje = await productManager.addProduct(product)
        if (mensaje == "Producto cargado correctamente")
            res.status(200).send(mensaje)
        else
            res.status(400).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const updateProduct = req.body
        const mensaje = await productManager.updateProduct(idProducto, updateProduct)
        if (mensaje == "Producto actualizado correctamente")
            res.status(200).send(mensaje)
        else
            res.status(404).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const mensaje = await productManager.deleteProduct(idProducto)
        if (mensaje == "Producto eliminado correctamente")
            res.status(200).send(mensaje)
        else
            res.status(404).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
})

export default productsRouter