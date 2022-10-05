//1- Invocamos express
const express = require("express");
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');



app.use(express.static(path.join(__dirname, 'public2')))

const router = require('./routes/router')
app.use(router.routes)

//2-seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//3- invocamos a dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//4- invocamos directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

//5- motor de plantillas
app.set("view engine", "ejs");

//6- invocamos a bcryptjs
const bcryptjs = require("bcryptjs");
const session = require("express-session");

//7-Var. de session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//8-invocamos al modulo de conexion de la bd
const connection = require("./database/db");
const { application } = require("express");

//9-estableciendo rutas


app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

//10-Registracion
app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO users Set ?",
    { user: user, name: name, rol: rol, pass: passwordHaash },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Bienvenido!",
          alertMessage: "Registrado con exito. Sera redirigido al Login para iniciar session con su nuevo usuario.",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 3500,
          ruta: "/login",
        });
      }
    }
  );
});

//11 autenticacion
app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o password incorrectas!",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: 'login',
          });
        } else {
            req.session.loggedin = true;
            req.session.name = results[0].name
          res.render("login",{
            alert: true,
            alertTitle: "Conexion exitosa",
            alertMessage: "LOGIN CORRECTO!",
            alertIcon:'success',
            showConfirmButton: false,
            timer: 1500,
            ruta: ''
          });
        }
      }
    );
  }else{
    res.render("login",{
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Por favor ingrese un usuario y/o password!",
        alertIcon:'warning',
        showConfirmButton: true,
        timer: false,
        ruta: 'login'
      });
    }
  });

  //12 auth pages
  app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index',{
            login: false,
            name: 'Debe iniciar sesion'
        })
    }
  })

//13 logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('login')
    })
})

app.listen(3001, (req, res) => {
  console.log("Server running on https://localhost:3001");
});
