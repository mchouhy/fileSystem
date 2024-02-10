// Importación del módulo nativo de Node: "FileSystem", específicamente el de promesas, asignado a la variable "fs".
const fs = require("fs").promises;
//Función de clase constructora que recibe la ruta a trabajar desde el momento de generar la instancia.
class ProductManager {

      constructor() {
            this.path = "./productsDB.json"
            this.products = []
      }

      // Función que lee el archivo json en el cual se guardan los objetos de productos, ejecuta el "parse" para transformar el JSON a objeto y devuelve el array de objetos de productos contenidos el archivo JSON.
      getProducts = async () => {
            try {
                  const productsDB = await fs.readFile(this.path, "UTF-8")
                  const productsDBContent = JSON.parse(productsDB)
                  return console.log("Este es el stock de productos en la base de datos:", productsDBContent)
            } catch (error) {
                  console.log(`Error al consultar el stock de productos.`, error)
            }
      }
      // Función que agrega los objetos de productos al archivo JSON, validando previamente el cumplimiento de las condiciones del desafío.
      addProduct = async (product) => {
            try {
                  // Validación 1: Mensaje de error en caso de que no se completen todos los campos requeridos.
                  if (!product.title ||
                        !product.description ||
                        !product.price ||
                        !product.thumbnail ||
                        !product.code ||
                        !product.stock) {
                        return `Error. Es necesario completar todos los campos del producto para que pueda ser agregado a la base de datos.`
                  }
                  // Validación 2: Mensaje de error en caso de que el "code" del producto agregado ya exista.
                  const repeatedCode = this.products.find(prod => prod.code === product.code)
                  if (repeatedCode) {
                        return console.log(`Error. El producto: "${product.title}" no pudo ser agregado porque ya existe un producto con el código ingresado.`)
                  }
                  // Validación 3: Creación de un id autoincremental en cada producto agregado.
                  if (this.products.length === 0) {
                        product.id = 1
                        this.products.push(product)
                  } else {
                        product.id = this.products.length + 1
                        this.products.push(product)
                  }
                  await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
                  return console.log(`El producto: '${product.title}' ha sido agregado con éxito a la base de datos.`)

            } catch (error) {
                  console.log(`Error al agregar el producto: ${product.title}.`, error)
            }
      }
      // Función que busca en el archivo JSON que guarda los objetos de productos el producto que coincida con el id ingresado por argumento.
      // En caso de no existir un producto con el id ingresado por argumento se retorna un mensaje de error.
      // En caso de que exista un producto con el id ingresado por argumento se retorna el producto en cuestión.
      getProductById = async (prodId) => {
            try {
                  const productsDB = await fs.readFile(this.path, "UTF-8")
                  const productsDBContent = JSON.parse(productsDB)
                  const existingIdProduct = productsDBContent.find(prod => prod.id === prodId)
                  if (!existingIdProduct) {
                        return console.log(`Error. El producto con el id: ${prodId} no existe.`)
                  } else {
                        return console.log(`El producto con el id: ${prodId} existe. Estos son sus detalles: `, existingIdProduct)
                  }
            } catch (error) {
                  console.log('No existe un producto identificado con el id ingresado', error)
            }
      }
      // Función que actualiza las propiedades de los objetos de productos almacenados en el archivo JSON. Si no existe el producto que se pretende actualizar se devuelve un mensaje de error.
      updateProduct = async (prodId,
            {
                  title,
                  description,
                  price,
                  thumbnail,
                  code,
                  stock
            }
      ) => {
            try {
                  const productsDB = await fs.readFile(this.path, 'utf-8')
                  const productsDBParse = JSON.parse(productsDB)
                  const productToUpdate = productsDBParse.find(prod => prod.id === prodId)
                  if (productToUpdate) {
                        productToUpdate.title = title || productToUpdate.title
                        productToUpdate.description = description || productToUpdate.description
                        productToUpdate.price = price || productToUpdate.price
                        productToUpdate.thumbnail = thumbnail || productToUpdate.thumbnail
                        productToUpdate.code = code || productToUpdate.code
                        productToUpdate.stock = stock || productToUpdate.stock
                        const updatedProductsToJSON = JSON.stringify(productsDBParse, null, prodId)
                        await fs.writeFile(this.path, updatedProductsToJSON, 'utf-8')
                        return console.log(`El producto con el id: ${prodId} se ha actualizado con éxito en la base de datos. Estos son sus detalles actualizados: `, productToUpdate)
                  } else {
                        return console.log(`Error al actualizar. No existe un producto en la base de datos con el número de id: ${prodId}.`)
                  }
            } catch (error) {
                  console.log('Error al leer la base de datos, intente nuevamente.', error)

            }

      }
      // Función que elimina productos alojados en el archivo JSON y devuelve el listado de productos actualizados.
      deleteProductById = async (prodId) => {
            try {
                  const productsDB = await fs.readFile(this.path, 'utf-8')
                  const productsDBParse = JSON.parse(productsDB)
                  const indexToRemove = productsDBParse.findIndex(prod => prod.id === prodId)

                  if (indexToRemove !== -1) {
                        productsDBParse.splice(indexToRemove, 1)
                        await fs.writeFile(this.path, JSON.stringify(productsDBParse, null, prodId), 'utf-8')
                        return console.log(`El producto identificado con el id: ${prodId} ha sido eliminado con éxito y se ha actualizado el listado de productos.`)
                  } else {
                        return console.log(`Error al eliminar. El producto identificado con el id: ${prodId} no existe.`)
                  }
            } catch (error) {
                  console.log('Error al consultar la base de datos.', error)
            }

      }

}

//Creación de la instancia del manejador de archivos.
const manager = new ProductManager();

// TEST DE FUNCIONAMIENTO DEL MANEJADOR DE ARCHIVOS:


// 1) Producto de prueba original agregado con éxito.
manager.addProduct(
      {
            title: 'Mesa Goya',
            description: 'Mesa circular de mármol carrara de 1x1',
            price: '2000',
            thumbnail: 'imagen de mesa goya',
            stock: 200,
            code: 'kwy266'
      }
)

// 2) Producto que repite el "code" del producto original para que salte el mensaje de error.
manager.addProduct(
      {
            title: 'Sofa Ana',
            description: 'Sofa de lino de 3x1',
            price: '3500',
            thumbnail: 'imagen de sofa ana',
            stock: 200,
            code: 'kwy266'
      }
)

// 3) Producto agregado con éxito.
manager.addProduct(
      {
            title: 'Silla Amazonas',
            description: 'Silla estilo thonet',
            price: '500',
            thumbnail: 'imagen de silla amazonas',
            stock: 200,
            code: 'jhi357'
      }
)

// 4) Producto agregado con éxito.
manager.addProduct(
      {
            title: 'Mesa Pampa',
            description: 'Mesa de petiribí de 3x2',
            price: '900',
            thumbnail: 'imagen de Mesa Pampa',
            stock: 200,
            code: 'xyt389'
      }
)

// 5) Producto al que le faltan campos por completar para que se accione el mensaje de error de la "validación 1". En este caso faltaría el "code".
manager.addProduct(
      {
            title: 'Vela Sofía',
            description: 'Vela aromatizada',
            price: '40',
            thumbnail: 'imagen de vela sofía',
            stock: 200
      }
)

// 6) Función getProducts que recupera los productos del JSON y los muestra por consola:
manager.getProducts()

// 7) Prueba de que funciona la búsqueda de productos por id, y mensaje de error en caso de no encontrar el id buscado.
manager.getProductById(1)
manager.getProductById(7)

// 8) Prueba de que funciona la actualización de productos por id, y mensaje de error en caso de que no exista el producto a actualizar.
manager.updateProduct(1,
      {
            title: 'título actualizado',
            code: 'código actualizado'
      }
)
manager.updateProduct(12,
      {
            title: 'título actualizado',
            code: 'código actualizado'
      }
)

// 9) Prueba de que funciona la eliminación de productos por id, y mensaje de error en caso de que no exista el producto a eliminar.
//manager.deleteProductById(3)
//manager.deleteProductById(24)
