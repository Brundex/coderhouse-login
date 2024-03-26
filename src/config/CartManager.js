import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.products = path
    }

    async getCart() {
        const cart = JSON.parse(await fs.readFile(this.products, 'utf-8'))
        return cart
    }

    async addProductByCart(idProducto, quantityParam) {
        const cart = JSON.parse(await fs.readFile(this.products, 'utf-8'))

        const indice = cart.findIndex(product => product.id == idProducto)

        if (indice != -1) {
            cart[indice].quantity += quantityParam
        } else {
            const prod = { id: idProducto, quantity: quantityParam }
            cart.push(prod)
        }
        await fs.writeFile(this.products, JSON.stringify(cart))
        return "Producto cargado correctamente"
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            cart.products = cart.products.filter(product => product.id_prod.toString() !== productId);
            await cart.save();
            return "Producto eliminado del carrito exitosamente";
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
            return "Carrito actualizado exitosamente";
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            const product = cart.products.find(product => product.id_prod.toString() === productId);
            if (product) {
                product.quantity = quantity;
                await cart.save();
                return "Cantidad del producto actualizada exitosamente";
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
            return "Carrito limpiado exitosamente";
        } catch (error) {
            throw error;
        }
    }
}


