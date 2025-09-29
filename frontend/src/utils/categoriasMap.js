// Este archivo define el mapa de categorías y subcategorías utilizadas en el catálogo.
// Se usa para estructurar la navegación y filtrado de productos en el componente CatalogoCategoria.vue.
// Cada clave representa una categoría principal, y su valor es un array con las subcategorías asociadas.

export const categoriasMap = {
  Hardware: [
    "Refrigeracion",
    "Memorias RAM",
    "Almacenamiento",
    "Placas de Video",
    "Fuentes",
    "Motherboard",
    "Energia",
    "Procesadores",
    "Gabinetes",
    "Kit Actualizacion"
  ],

  Gaming: [
    "Consolas",
    "Silla"
  ],

  Conectividad: [
    "Adaptador WiFi",
    "Placas de Red"
  ],

  Impresoras: [
    "Laser",
    "Tinta"
  ],

  Perifericos: [
    "Joystick",
    "StreamDeck",
    "Teclado",
    "Mouse Pad",
    "Combo",
    "Auriculares",
    "Parlante",
    "Webcam",
    "Mouse",
    "Microfono",
    "Volante"
  ],

  Monitores: [
    "LG",
    "Samsung",
    "AsRock"
  ],

  Notebooks: [
    "ASUS",
    "Lenovo",
    "ACER"
  ]
};
