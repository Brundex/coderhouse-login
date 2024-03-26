import { Router } from "express";
import { CartManager } from "../config/CartManager.js";
const cartManager = new CartManager('./src/data/cart.json');
import Cart from '../models/cart.js'; // Importar el modelo de Carts

const cartRouter = Router();

// Obtener todos los productos del carrito con detalle
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.id_prod');
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
});

// Eliminar un producto específico del carrito
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const mensaje = await cartManager.removeProductFromCart(cartId, productId);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto del carrito: ${error}`);
    }
});

// Actualizar el carrito con un arreglo de productos
cartRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;
        const mensaje = await cartManager.updateCart(cartId, products);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }
});

// Actualizar la cantidad de ejemplares de un producto en el carrito
cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const mensaje = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar cantidad del producto en el carrito: ${error}`);
    }
});

// Eliminar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const mensaje = await cartManager.clearCart(cartId);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar todos los productos del carrito: ${error}`);
    }
});

export default cartRouter;