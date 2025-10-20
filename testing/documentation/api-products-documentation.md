# Testing API Documentation - Products

URL: http://localhost:3001/api

---

Verificar que el backend este corriendo, despues de ejecutar

```
`docker-compose up -d

C:\Users\guerr\Desktop\NuevoCLon\CapyGaming-CarpinchosProgramando>curl http://localhost:3001/api/health
{"message":"Backend de CapyGaming funcionando correctamente"}
```

## Endpoints

**1. GET /productos**

Listado de todos los productos

**Ejemplos:**

```bash
# Todos los productos
GET /api/productos

# Filtrar por categoría con parametros
GET /api/productos?categoria=Notebooks

# Filtrar por categoría y subcategoría con parametros
GET /api/productos?categoria=Notebooks&subcategoria=ACER
```

**Respuesta Exitosa (200):**

```json
[
  {
    "id_producto": 1,
    "nombre": "Notebook Acer Aspire 3 15.6 AMD Ryzen 5 7520U 8GB DDR5 SSD 512GB",
    "precio": "850000.00",
    "stock": 30,
    "marca": "ACER",
    "categoria": "Notebooks",
    "subcategoria": "ACER",
    "imagenes": [
      "https://imgur.com/Eyh2lUh.jpg",
      "https://imgur.com/S7HTO9I.jpg"
    ]
  }
]
```

**Errores:**

- `500`: Error en el servidor


---

### 2. GET /productos/:id

Obtiene el detalle de un producto específico por su ID.

**URL:** `/productos/:id`

**Método:** `GET, se debe pasar por parámetro el id del producto.`

**Ejemplo:**

```bash
GET /api/productos/1
```

**Respuesta Exitosa (200):**

```json
{
  "id_producto": 1,
  "nombre": "Notebook Acer Aspire 3 15.6 AMD Ryzen 5 7520U 8GB DDR5 SSD 512GB",
  "precio": "850000.00",
  "stock": 30,
  "marca": "ACER",
  "categoria": "Notebooks",
  "subcategoria": "ACER",
  "imagenes": [
    "https://imgur.com/Eyh2lUh.jpg",
    "https://imgur.com/S7HTO9I.jpg"
  ]
}
```


**Errores:**

- `404`: Producto no encontrado

```json
{
  "error": "Producto no encontrado"
}
```

- `500`: Error en el servidor

### 3. GET /productos/buscar

Busca productos por nombre usando búsqueda parcial.

**URL:** `/productos/buscar`

**Método:** `GET`

**Ejemplo:**

```bash
GET /api/productos/buscar?nombre=Monitor
```

**Respuesta Exitosa (200):**

```json
[
  {
    "id_producto": 56,
    "nombre": "Monitor Gamer AsRock Phantom PG27QFT2A 27 pulgadas...",
    "precio": "410000.00",
    "stock": 50,
    "marca": "AsRock",
    "categoria": "Monitores",
    "subcategoria": "AsRock",
    "imagenes": ["https://imgur.com/ogJU422.jpg"]
  }
]
```


**Errores:**

- `400`: Parámetro nombre no proporcionado

```json
{
  "error": "Debe proporcionar un nombre para buscar"
}
```

- `500`: Error en el servidor

### 4. GET /categorias/:nombre/subcategorias

Obtiene todas las subcategorías de una categoría específica.

**URL:** `/categorias/:nombre/subcategorias`

**Método:** `GET`

**Ejemplo:**

```bash
GET /api/categorias/Notebooks/subcategorias
```

**Respuesta Exitosa (200):**

```json
["ACER", "ASUS", "Lenovo"]
```


**Errores:**

- `500`: Error en el servidor

---

## Testing

**Script de testing:**

```bash
cd testing/scripts
npm run test:products
```

**Tests incluidos:**

- GET todos los productos
- GET producto por ID
- Búsqueda por nombre
- Filtros por categoría/subcategoría
- GET subcategorías
- Manejo de errores 404/400

---

## Ejemplos de Uso

### Curl envia peticiones al backend desde la terminal

```bash
# Obtener todos los productos
curl -X GET "http://localhost:3001/api/productos"

# Filtrar por categoría
curl -X GET "http://localhost:3001/api/productos?categoria=Notebooks"

# Buscar por nombre
curl -X GET "http://localhost:3001/api/productos/buscar?nombre=Monitor"
```



## Obtener todos los productos

*curl -X GET "http://localhost:3001/api/productos"*

## Filtrar por categoría

*curl -X GET "http://localhost:3001/api/productos?categoria=Notebooks"*


## Buscar por nombre

*curl -X GET "http://localhost:3001/api/productos/buscar?nombre=Monitor"*


---

**Última actualización:** 2025-10-20
**Versión:** 1.0.0
**Mantenedor:** Maria Mercedes Atim - Testing & Documentation
