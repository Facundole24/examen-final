const express = require("express")
const Database = require("better-sqlite3") 

const app = express()
const puerto = 3000

const db = new Database("productos.db")

db.prepare("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, stock INTEGER, precio REAL)").run()

const total = db.prepare("SELECT COUNT(*) as cantidad FROM productos").get()

if (total.cantidad === 0) {
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES (?,?,?)").run("Teclado", 10, 15000)
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES (?,?,?)").run("Mouse", 20, 8000)
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES (?,?,?)").run("Monitor", 5, 120000)
}

app.get("/", (req, res) => {
    res.send("Servidor funcionando en puerto 3000")
})
app.get("/productos", (req, res) => {
    const datos = db.prepare("SELECT * FROM productos").all()
    res.json(datos)
})
app.get("/productos/:id", (req, res) => {
    const id = req.params.id
    const dato = db.prepare("SELECT * FROM productos WHERE id = ?").get(id)

    if (!dato) {
        res.json({ mensaje: "Producto no encontrado" })
    } else {
        res.json(dato)
    }
})
app.listen(puerto, () => {
    console.log("Servidor funcionando en el puerto 3000")
})