// Importación del módulo nativo de Node: "FileSystem", específicamente el de promesas, asignado a la variable "fs".
const fs = require("fs").promises;
//Función de clase constructora que recibe la ruta a trabajar desde el momento de generar la instancia.
class ProductManager {

      constructor() {
            this.path = "./productsDB.json"
      }

      // Función que lee el archivo json en el cual se guardan los objetos de productos, ejecuta el "parse" para transformar el JSON a objeto y devuelve el array de objetos de productos contenidos el archivo JSON.
      getProducts = async () => {
            try {
                  const productsDB = await fs.readFile(this.path, "UTF-8")
                  return JSON.parse(productsDB)
            } catch (error) {
                  console.log(`Error al consultar el stock de productos.`, error)
            }
      }
      // Función que agrega los objetos de productos al archivo JSON, validando previamente el cumplimiento de las condiciones del desafío.
      addProduct = async (product) => {
            try {
                  const productsDB = await fs.readFile(this.path, "utf-8")
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
                  const repeatedCode = productsDB.find(prod => prod.code === product.code)
                  if (repeatedCode) {
                        return `Error. El producto: "${product.title}" no pudo ser agregado porque ya existe un producto con el código ingresado.`
                  }
                  // Validación 3: Creación de un id autoincremental en cada producto agregado.
                  if (productsDB.length === 0) {
                        product.id = 1
                  } else {
                        product.id = this.products.length + 1
                  }
                  const response = await fs.writeFile(this.path, JSON.stringify(productsDB, null, 2))
                  return response
            } catch (error) {
                  console.log(`Error al agregar el producto: ${product.title}.`, error)
            }
      }
}

const manager = new ProductManager();

//Producto de prueba original agregado con éxito.
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