const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Login = require("./models/login.js");
const Post = require("./models/content.js");
const methodOverride = require("method-override");

main().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Blog")
};
app.listen(3000, () => {
    console.log("Server is Listening on 3000.");
})
const path = require("path");
const { title } = require("process");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//to get the home page without login id
app.get("/", ((req, res) => {
    console.log("Hello");
    Post.find().then((posts) => {
        console.log(posts);
        if (posts == null) {
            res.render("home.ejs");
        }
        else {
            res.render("home.ejs", { posts });
        }
    }).catch((err) => {
        console.log("Error exist");
    })
}))
//to get the login page
app.get("/login", ((req, res) => {
    res.render("login.ejs");
}))
//identify login credentials
app.post("/login_submit", ((req, res) => {
    let credential = req.body;
    Login.findOne({ username: credential.username, password: credential.password }).then((result) => {
        if (result != null) {
            let url = "/login/id=" + result["_id"] + "/home";
            res.redirect(url);
        }
        else {
            res.redirect("/login");
        }
    }).catch((err) => {
        console.log(err);
        res.send(err);
    })
}))
//to view a post without login id
app.get("/post_id=:id", ((req, res) => {
    let { id } = req.params;
    Post.findOne({ _id: id }).then((post) => {
        console.log(post);
        res.render("viewPost.ejs", { post });
    }).catch((err) => {
        console.log(err);
    })
}))
//to get the signup page
app.get("/signup", ((req, res) => {
    res.render("signup.ejs");
}))
//to create a new user
app.post("/signup_submit", ((req, res) => {
    let credential = req.body;
    Login.findOne({ username: credential.username }).then((result) => {
        if (result == null) {
            let login = new Login({
                username: credential.username,
                password: credential.password,
            });
            login.save().then(() => {
                console.log("Data inserted");
            }).catch((err) => {
                console.log(err)
            })
            res.redirect("/login");
        }
        else {
            let error = { message: "Duplicate Username" };
            res.render("error.ejs", { error });
        }
    }).catch((err) => {
        console.log(err);
    })
}))
//to move at the home page with login id
app.get("/login/id=:id/home", ((req, res) => {
    let id = req.params;
    Post.find({ user_id: id.id }).then((Posts) => {
        if (Posts == null) {
            res.render("login_home.ejs",);
        }
        else {
            res.render("login_home.ejs", { Posts, id });
        }
    })
}))
//to get the new post page
app.get("/login/id=:id/newPost", ((req, res) => {
    let id = req.params;
    res.render("newPost.ejs", { id });
}))
//to get the view page with login id
app.get("/login/id=:user_id/View/post.id=:post_id", ((req, res) => {
    let { user_id, post_id } = req.params;
    Post.findOne({ _id: post_id,user_id:user_id }).then((post) => {
        res.render("loginViewPost", { post });
    }).catch((err) => {
        console.log(err);
    })
}));
//to get the edit page
app.get("/login/id=:user_id/Edit/post.id=:post_id", ((req, res) => {
    let { user_id, post_id } = req.params;
    Post.findOne({ _id: post_id,user_id:user_id }).then((post) => {
        res.render("editPost", { post });
    }).catch((err) => {
        console.log(err);
    })
}));
//to edit a post
app.patch("/login/id=:user_id/Edit/post.id=:post_id/submit",((req,res)=>{
    let {user_id,post_id} = req.params;
    let updatedPost = req.body;
    console.log(updatedPost.content);
    Post.updateOne({_id:post_id},{content:updatedPost.content},{runValidators:true}).then(()=>{
        res.redirect("/login/id="+user_id+"/home");
    }).catch((err)=>{
        console.log(err.errors);
    })
}))
//to get the delete page
app.get("/login/id=:user_id/Delete/post.id=:post_id", ((req, res) => {
    let { user_id, post_id } = req.params;
    Post.findOne({ _id: post_id,user_id:user_id }).then((post) => {
        res.render("deletePost", { post });
    }).catch((err) => {
        console.log(err);
    })
}));
//To delete a post
app.delete("/login/id=:user_id/Delete/post.id=:post_id/submit",((req,res)=>{
    let {user_id,post_id} = req.params;
    Post.deleteOne({_id:post_id}).then(()=>{
        res.redirect("/login/id="+user_id+"/home");
    }).catch((err)=>{
        console.log(err.errors);
    })
}))
//create new post
app.post("/login/id=:id/newPost_submit", ((req, res) => {
    let id = req.params;
    let contents = req.body;
    Post.findOne({ user_id: id.id, title: contents.title }).then((result) => {
        console.log("Hello");
        if (result == null) {
            Login.findOne({ _id: id.id }).then((result1) => {
                let newPost = new Post({
                    username: result1.username,
                    postDate: date(),
                    title: contents.title,
                    content: contents.content,
                    user_id: id.id,
                })
                newPost.save().then(() => {
                    console.log("data inserted");
                }).catch((err) => {
                    console.log("Error in save");
                })
                res.redirect("/login/id=" + id.id + "/home");
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            console.log("Hello");
            res.redirect("/login/id=" + id.id + "/newPost")
        }
    }).catch((err) => {
        console.log("Error in findone");
    })
}))
//To find the current Date
function date() {
    let newDate = new Date();
    newDate = newDate.toString().split(" ").slice(0, 4).join(" ");
    return newDate;
}