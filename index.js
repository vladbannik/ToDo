const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const TodoCategory = require("./models/TodoCategory");


dotenv.config();


app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to database!");
    app.listen(3000, () => console.log("Server started on http://localhost:3000"));
});


app.set("view engine", "ejs");

app.get("/", async (req, res) => {///стартовая страница 
    try {
        const tasks = await TodoTask.find({});
        const categories = await TodoCategory.find({});
        res.render("todo.ejs", { todoTasks: tasks, todoCategory: categories });
    }
    catch {
        res.redirect("/");
    }
});

app.post('/', async (req, res) => {///добавление заметки
    try {
        await TodoTask.create({ title: req.body.title, description: req.body.description, date: req.body.datatime, category: req.body.select });
        res.redirect("/");
    }
    catch {
        res.redirect("/");
    }
});


app.route("/edit/:id").get(async (req, res) => {//страница редактирования заметки
    try {
        const id = req.params.id;
        const task = await TodoTask.findOne({ _id: id });
        const categories = await TodoCategory.find({});
        res.render("todoEdit.ejs", { todoTask: task, todoCategory: categories });
    }
    catch {
        res.redirect("/");
    }
}).post(async (req, res) => {///изменение заметки
    try {
        const id = req.params.id;
        await TodoTask.findByIdAndUpdate(id, { title: req.body.title, description: req.body.description, date: req.body.datatime, category: req.body.select })
        res.redirect("/");
    }
    catch (err) {
        return res.send(500, err);
    }
});


app.route("/remove/:id").get(async (req, res) => {//удаление заметки 
    try {
        const id = req.params.id;
        await TodoTask.findByIdAndRemove(id);
        res.redirect("/");

    }
    catch (err) {
        return res.send(500, err);

    }
});

app.route("/categoryAdd/").get(async (req, res) => {//страница добавления заметки
    try {
        res.render("categoryAdd.ejs");
    }
    catch {
        res.redirect("/");
    }
}).post(async (req, res) => {// добавления заметки
    try {
        await TodoCategory.create({ title: req.body.category });
        res.redirect("/");
    }
    catch {
        res.redirect("/");
    }
});

app.route("/categories/").get(async (req, res) => {//страница категорий
    try {
        const categories = await TodoCategory.find({});
        res.render("categories.ejs", { categories: categories });
    }
    catch {
        res.redirect("/");
    }

});

app.route("/todocategory/:id").get(async (req, res) => {//заметки по категориям
    try {
        const id = req.params.id;
        const tasks = await TodoTask.find({ category: id });
        const categories = await TodoCategory.find({});
        res.render("todoCategory.ejs", { todoTasks: tasks, todoCategory: categories });
    }
    catch {
        res.redirect("/");
    }
});