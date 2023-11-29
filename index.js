// Importar dependencias
const connection = require("./database/connection");
const express = require("express")
const cors = require("cors")

// Mensaje bienvenida
console.log("API NODE para JUNTA DE VECINOS arrancada!!")

// Conexion a bdd
connection();

// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertis los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const UserRoutes = require("./routes/user");
const rutas_articulo = require("./routes/articulo");
const rutas_proyecto = require("./routes/proyecto");
const rutas_inscripcion = require("./routes/inscripcion");
const rutas_actividad = require("./routes/actividad");
const rutas_certificado = require("./routes/certificado");
const rutasRegiones = require("./routes/region");
const rutasComunas = require("./routes/comuna");
const rutasEspacios = require("./routes/espacio");
const rutasReserva = require("./routes/reserva")

// Cargo las rutas
app.use("/api/user", UserRoutes);
app.use("/api", rutas_articulo);
app.use("/api/proyecto", rutas_proyecto);
app.use("/api/inscripcion", rutas_inscripcion);
app.use("/api/actividad", rutas_actividad);
app.use("/api/certificado", rutas_certificado);
app.use("/api/regiones", rutasRegiones);
app.use("/api/comunas", rutasComunas);
app.use("/api/espacio", rutasEspacios);
app.use("api/reserva", rutasReserva);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Martín"
        }
    );

})

// Poner servidos a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});