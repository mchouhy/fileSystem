// Variable que importa el módulo nativo de Node: "FileSystem"
const fs = require('fs')

//Función de clase constructora que inicialmente devuelve un array vacío.
class ProductManager {
    constructor() {
        this.products = []
        this.path = 'productsDB.json'
    }
    // Función que lee el archivo json en el cual se guardan los objetos de productos, ejecuta el "parse" para transformar el JSON a objeto y devuelve el array de objetos de productos contenidos el archivo JSON.
    getProducts() {
        const productsDB = fs.readFileSync(this.path, 'utf-8')
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
        // Función que guarda los productos creados con éxito en el archivo JSON.
        this.pushToJsonFile()
        return `Producto: "${product.title}" agregado con éxito`
    }
    // Función que busca en el archivo JSON que guarda los objetos de productos el producto que coincida con el id ingresado por argumento.
    // En caso de no existir un producto con el id ingresado por argumento se retorna un mensaje de error.
    // En caso de que exista un producto con el id ingresado por argumento se retorna el producto en cuestión.
    getProductById(prodId) {
        const existingIdProduct = this.getProducts().find(prod => prod.id === prodId)
        if (!existingIdProduct) {
            return 'Error. No existe un producto identificado con el id ingresado.'
        }
        return existingIdProduct
    }
    // Función que actualiza las propiedades de los objetos de productos almacenados en el archivo JSON. Si no existe el producto que se pretende actualizar se devuelve un mensaje de error.
    updateProduct(prodId, title, description, price, thumbnail, code, stock) {
        const productsDB = fs.readFileSync(this.path, 'utf-8')
        const productsDBParse = JSON.parse(productsDB)
        const updateProduct = productsDBParse.find(prod => prod.id === prodId)

        if (updateProduct) {
            updateProduct.title = title
            updateProduct.description = description
            updateProduct.price = price
            updateProduct.thumbnail = thumbnail
            updateProduct.code = code
            updateProduct.stock = stock
            const updatedProductsJSON = JSON.stringify(productsDBParse, null, prodId)
            fs.writeFileSync(this.path, updatedProductsJSON, 'utf-8')
            return updateProduct
        } else {
            return 'Error. El producto que pretende actualizar no existe.'
        }
    }
    // Función que elimina productos alojados en el archivo JSON y devuelve el listado de productos actualizados.
    deleteProduct(prodId) {
        const productsDB = fs.readFileSync(this.path, 'utf-8')
        const productsDBParse = JSON.parse(productsDB)
        const existingProduct = productsDBParse.findIndex(prod => prod.id === prodId)

        if(existingProduct !== -1) {
            productsDBParse.splice(existingProduct, prodId)
            const updatedProductsJSON = JSON.stringify(productsDBParse, null, prodId)
            fs.writeFileSync(this.path, updatedProductsJSON, 'utf-8')
            return `El producto identificado con el id: ${existingProduct} ha sido eliminado con éxito y se ha actualizado el listado de productos.`
        } else {
            return 'Error. El producto que pretende eliminar no existe.'
        }
    }
    // Función descripta en la línea de código 39.
    pushToJsonFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8')
    }
}

const products = new ProductManager()
//Producto de prueba original agregado con éxito.
console.log(products.addProduct({ title: 'Mesa Goya', description: 'Mesa circular de mármol carrara de 1x1', price: '2000', thumbnail: 'imagen de mesa goya', stock: 200, code: 'kwy266' }))

//Producto que repite el "code" del producto original para que salte el mensaje de error.
console.log(products.addProduct({ title: 'Sofa Ana', description: 'Sofa de lino de 3x1', price: '3500', thumbnail: 'imagen de sofa ana', stock: 200, code: 'kwy266' }))

//Producto agregado con éxito.
console.log(products.addProduct({ title: 'Silla Amazonas', description: 'Silla estilo thonet', price: '500', thumbnail: 'imagen de silla amazonas', stock: 200, code: 'jhi357' }))

//Producto agregado con éxito.
console.log(products.addProduct({ title: 'Mesa Pampa', description: 'Mesa de petiribí de 3x2', price: '900', thumbnail: 'imagen de Mesa Pampa', stock: 200, code: 'xyt389' }))

//Producto en el que faltan campos por completar para que se salte el mensaje de error.
console.log(products.addProduct({ title: 'Vela Sofía', description: 'Vela aromatizada', price: '40', thumbnail: 'imagen de vela sofía', stock: 200 }))

//console.log(products.getProducts())

//Prueba de que funciona la búsqueda de productos por id, y mensaje de error en caso de no encontrar el id buscado.
console.log(products.getProductById(1))
console.log(products.getProductById(7))

// Prueba de que funciona la actualización de productos por id, y mensaje de error en caso de que no exista el producto a actualizar.
console.log(products.updateProduct(1, "Título modificado", "Descripción actualizada", "Precio actualizado", "Thumbnail actualizado", 100, "code actualizado"))
console.log(products.updateProduct(8, "Título modificado", "Descripción actualizada", "Precio actualizado", "Thumbnail actualizado", 100, "code actualizado"))

//Prueba de que funciona la eliminación de productos por id, y mensaje de error en caso de que no exista el producto a eliminar.
console.log(products.deleteProduct(3))
console.log(products.deleteProduct(10))

