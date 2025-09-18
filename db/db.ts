import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import serviceAccount from "./key.json" assert { type: "json" };
//const serviceAccount = JSON.parse(fs.readFileSync('/etc/secrets/key.json', 'utf-8'));
import cors from "cors";
import  express from "express"
import dotenv from "dotenv"
dotenv.config()

const app= express();
const port = 3000

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../src/dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../src/dist/index.html'));
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: process.env.DATABASE_URL2
});

const rtdb = admin.database()


app.get("/messages",(req,res)=>{
  const messageRef = rtdb.ref(`chatrooms/general/messages`)
  messageRef.once("value").then((snapshot)=>{
    const data = snapshot.val()
        const messages = Object.values(data);
    res.status(200).json({messages});
  }).catch(error =>{
    console.log("Error obteniendo mensajes", error);
    res.status(500).json({error: error});
  });
})


app.post("/messages", (req, res) => {
  console.log("Mensaje recibido:", req.body); 
  const newMessage = req.body;

  const roomRef = rtdb.ref(`chatrooms/general/messages`);
  roomRef.push(newMessage).then(() => {
    res.status(201).json({ message: newMessage });
  }).catch(error => {
    res.status(500).json({ error: "Error al crear el Mensaje", details: error });
  });
});



app.listen(port, () =>{
  console.log(`App escuchando en el puerto: ${port}`)
})