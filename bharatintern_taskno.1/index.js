const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Registration = require("./models/registration.js");
// const { access } = require("fs/promises");
const Login = require("./models/login.js");
main().then(() => {
    console.log("Connection Successful")
})
    .catch((err) => {
        console.log(err)
    })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/College");
}
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
var error;
app.get("/", (req, res) => {
    res.render("home.ejs")
})
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
app.get("/login", (req, res) => {
    res.render("login.ejs");
})
app.get("/error", (req, res) => {
    res.render("error.ejs", { error });
})
app.post("/signup_submit", ((req, res) => {
    let credential = req.body;
    Login.findOne({ username: credential.username }).then((result) => {
        if (result == null) {
            let newLogin = new Login({
                username: credential.username,
                password: credential.password,
            });
            newLogin.save().then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err.errors);
            })
            res.redirect("/");
        }
        else {
            error = { message: "Duplicate Username" };
            res.redirect("/error");
        }
    }).catch((err) => {
        res.send(err.errors);
    });
}))
app.get("/login/:id/home", ((req, res) => {
    let id = req.params;
    res.render("login_home.ejs", { id });
}))
app.get("/login/:id/registration", ((req, res) => {
    let id = req.params;
    Registration.findById({ _id: id.id }).then((detail) => {
        if (detail == null) {
            console.log(detail)
            res.render("index.ejs", { id });
        }
        else {
            console.log(detail);
            // let detail = res;
            res.render("registered.ejs", { detail })
        }
    })
}))
app.post("/login_submit", (req, res) => {
    let credential = req.body;
    var url;
    Login.findOne({ username: credential.username, password: credential.password }).then((result) => {
        if (result != null) {
            url = "/login/" + result["_id"] + "/home";
            res.redirect(url);
        }
        else {
            res.redirect("/login");
        }
    }).catch((err) => {
        console.log(err);
        res.send("error");
    });
})
app.post("/login/:id/registration/submit", ((req, res) => {
    let id = req.params;
    let detail = req.body;
    Registration.findOne({ email: detail.email }).then((result) => {
        if (result == null) {
            Registration.findOne({ mobile: detail.mobile }).then((result) => {
                if (result == null) {
                    let newRegistration = new Registration({
                        sName: detail.sName,
                        fName: detail.fName,
                        mName: detail.mName,
                        email: detail.email,
                        dob: detail.dob,
                        mobile: detail.mobile,
                        aadhar: detail.aadhar,
                        gender: detail.gender,
                        address: detail.address,
                        religion: detail.religion,
                        state: detail.state,
                        courses: detail.courses,
                        image: detail.image,
                        hobby: detail.hobby,
                        boardName: detail.boardName,
                        boardPercentage: detail.boardPercentage,
                        boardYear: detail.boardYear,
                        intermediateName: detail.intermediateName,
                        intermediatePercentage: detail.intermediatePercentage,
                        intermediateYear: detail.intermediateYear,
                        graduationName: detail.graduationName,
                        graduationPercentage: detail.graduationPercentage,
                        graduationYear: detail.graduationYear,
                        masterName: detail.masterName,
                        masterPercentage: detail.masterPercentage,
                        masterYear: detail.masterYear,
                        applyDate: date(),
                        _id: id.id,
                    });
                    newRegistration.save().then(() => {
                    }).catch((err) => {
                        console.log(err.errors);
                    });
                    let url = "/login/" + id.id + "/home";
                    res.redirect(url)
                }
                else {
                    error = { message: "Duplicate Mobile Number" };
                    res.render("error.ejs",{error});
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        else {
            error = { message: "Duplicate Email Id" };
            res.render("error.ejs",{error});
            // res.redirect("/error");
        }
    }).catch((err) => {
        console.log(err)
    })
}))
function date() {
    let newDate = new Date();
    newDate = newDate.toString().split(" ").slice(0, 5).join(" ");
    return newDate;
}


