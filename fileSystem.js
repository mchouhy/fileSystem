// Variable que importa el módulo nativo de Node: "FileSystem"
const fs = require('fs')

class ProductManager {
    constructor() {
        this.products = []
    }
// Función que lee el archivo json en el cual se guardan los productos, ejecuta el "parse" para transformar el JSON a objeto y devuelve el array de objetos de productos contenidos el archivo JSON.
    getProducts() {
        const productsDB = fs.readFileSync('productsDB.json', 'utf-8')
        const productsDBContent = JSON.parse(productsDB)
        return productsDBContent
    }
// Función que agrega los objetos de productos al archivo JSON, validando previamente el cumplimiento de las condiciones del desafío.
    addProduct(product) {
        // Validación 1: Mensaje de error en caso de que no se completen todos los campos requeridos.
        if (!product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock) {
            return `Error. Es necesario completar todos los campos del producto para que pueda ser agregado.`
        }
        // Validación 2: Mensaje de error en caso de que el "code" del producto agregado ya exista.
        const repeatedCode = this.products.find(prod => prod.code === product.code)
        if (repeatedCode) {
            return `Error. El producto: "${product.title}" no pudo ser agregado porque ya existe un producto con el código ingresado.`
        }
        // Validación 3: Creación de un id autoincremental en cada producto agregado.
        if (this.products.length === 0) {
            product.id = 1
            this.products.push(product)
        } else {
            product.id = this.products.length + 1
            this.products.push(product)
        }
        this.pushToJsonFile()
        return `Producto: "${product.title}" agregado con éxito`
    }
// Función que busca en el archivo JSON que guarda los objetos de productos el producto que coincida con el id ingresado por argumento.
// En caso de no existir un producto con el id ingresado por argumento se retorna un mensaje de error.
// En caso de que exista un producto con el id ingresado por argumento se retorna el producto en cuestión.
    getProductById(prodId) {
        const existingIdProduct = this.getProducts().find(prod => prod.id === prodId)
        if(!existingIdProduct) {
            return 'Error. No existe un producto identificado con el id ingresado.' 
        }
        return existingIdProduct 
    }

    updateProduct(prodId, title, description, price, thumbnail, code, stock) {
        const productToUpdate = this.getProductById(prodId)
        productToUpdate.title = title
        productToUpdate.description = description
        productToUpdate.price = price
        productToUpdate.thumbnail = thumbnail
        productToUpdate.code = code
        productToUpdate.stock = stock
        fs.writeFileSync('productsDB.json', JSON.stringify(...productToUpdate), 'utf-8')
        return `El producto ha sido actualizado con éxito.`
    }

    pushToJsonFile() {
        fs.writeFileSync('productsDB.json', JSON.stringify(this.products), 'utf-8')
    }
}


const products = new ProductManager()
//Producto de prueba original agregado con éxito.
console.log(products.addProduct({ title: 'Mesa Goya', description: 'Mesa circular de mármol carrara de 1x1', price: '2000', thumbnail: 'imagen de mesa goya', stock: 200, code: 'kwy266' }))

//Producto que repite el "code" del producto original para que salte el mensaje de error.
console.log(products.addProduct({ title: 'Sofa Ana', description: 'Sofa de lino de 3x1', price: '3500', thumbnail: 'imagen de sofa ana', stock: 200, code: 'kwy266' }))

//Producto agregado con éxito.
console.log(products.addProduct({ title: 'Silla Amazonas', description: 'Silla estilo thonet', price: '500', thumbnail: 'imagen de silla amazonas', stock: 200, code: 'jhi357' }))

//Producto en el que faltan campos por completar para que se salte el mensaje de error.
console.log(products.addProduct({ title: 'Vela Sofía', description: 'Vela aromatizada', price: '40', thumbnail: 'imagen de vela sofía', stock: 200 }))

//console.log(products.getProducts())

//Prueba de que funciona la búsqueda de productos por id, y mensaje de error en caso de no encontrar el id buscado.
console.log(products.getProductById(1))
console.log(products.getProductById(7))

console.log(products.updateProduct(1, "Título modificado", "Descripción actualizada", "Precio actualizado", "Thumbnail actualizado", 100, "code actualizado"))

