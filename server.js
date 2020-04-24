const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const shortid = require("shortid");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "./views");

db.defaults({ todo: [] }).write();
const todos = db.get("todo").value();
app.get("/", (req, res) => {
  db.get("todo")
    .forEach((item, index) => {
      item.id = shortid.generate();
      item.stt = index + 1;
    })
    .write();
  res.render("index.pug", {
    todos
  });
});

app.get("/update/:id", (req, res) => {
  let id = req.params.id;
  let isBook = db
    .get("todo")
    .find({ id: id })
    .value();
  res.render("book/update", {
    id,
    title: isBook.title,
    description: isBook.description
  });
});

app.post("/update/:id/done", (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let description = req.body.description;
  db.get("todo")
    .find({ id: id })
    .assign({ title, description })
    .write();
  res.redirect("/");
});

app.get("/post", (req, res) => {
  res.render("book/post", {});
});

app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  res.render("book/delete", {
    id
  });
});

app.get("/delete/:id/oke", (req, res) => {
  var id = req.params.id;
  db.get("todo")
    .remove({ id: id })
    .write();
  res.redirect("/");
});
app.post("/post", (req, res) => {
  req.body.stt = db.get("todo").value().length + 1;
  db.get("todo")
    .push(req.body)
    .write();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Service running on PORT:" + PORT);
});
