const express = require("express");
const app = express();
const Login = require("./models/login.js");
const Transaction = require("./models/transaction.js");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
var id;
var retainId = id;
var error;
app.listen(3000, () => {
    console.log("Port is listening on 3000");
})
main().then(() => {
    console.log("Connection Established");
})
    .catch((err) => {
        console.log("connection not establisehd");
    })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WebApp");
}
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.get("/signin", (req, res) => {
    res.render("signin.ejs");
})
app.post("/signin/submit", async (req, res) => {
    let login = req.body;
    let newLogin = await Login.findOne({ email: login.email, password: login.password });
    if (newLogin == null) {
        res.redirect("/signup");
    }
    else {
        res.redirect("/id=" + newLogin.id + "/" + newLogin.userType + "-login");
    }
})
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
app.post("/signup/submit", async (req, res) => {
    let newLogin = req.body;
    let count = await Login.find({ email: newLogin.email });
    console.log(count);
    if (count == 0) {
        let login = new Login({
            fname: newLogin.fname,
            lname: newLogin.lname,
            email: newLogin.email,
            password: newLogin.password,
            userType: "user",
            createDate: date(),
        })
        login.save().then((result) => {
            console.log(result);
            res.redirect("/signin");
        })
            .catch((err) => {
                console.log(err);
            })
    } else {
        res.redirect("/error");
    }
})
app.get("/id=:id/:user-login", async (req, res) => {
    let { id, user } = req.params;
    let loginData = await Login.findById(id);
    let expenseCount = await Transaction.find({ user_id: id, transactionType: "expense" }).count();
    let incomeCount = await Transaction.find({ user_id: id, transactionType: "income" }).count();
    let expenseMoney = await Transaction.aggregate([{ $match: { transactionType: "expense", user_id: id } }, { $group: { _id: "$transactionType", amount: { $sum: "$amount" } } }])
    let expenseMin = await Transaction.aggregate([{ $match: { transactionType: "expense", user_id: id } }, { $group: { _id: "$transactionType", amount: { $min: "$amount" } } }])
    let expenseMax = await Transaction.aggregate([{ $match: { transactionType: "expense", user_id: id } }, { $group: { _id: "$transactionType", amount: { $max: "$amount" } } }])
    let expenseAvg = await Transaction.aggregate([{ $match: { transactionType: "expense", user_id: id } }, { $group: { _id: "$transactionType", amount: { $avg: "$amount" } } }])
    let incomeMoney = await Transaction.aggregate([{ $match: { transactionType: "income", user_id: id } }, { $group: { _id: "$transactionType", amount: { $sum: "$amount" } } }])
    let incomeMin = await Transaction.aggregate([{ $match: { transactionType: "income", user_id: id } }, { $group: { _id: "$transactionType", amount: { $min: "$amount" } } }])
    let incomeMax = await Transaction.aggregate([{ $match: { transactionType: "income", user_id: id } }, { $group: { _id: "$transactionType", amount: { $max: "$amount" } } }])
    let incomeAvg = await Transaction.aggregate([{ $match: { transactionType: "income", user_id: id } }, { $group: { _id: "$transactionType", amount: { $avg: "$amount" } } }])
    var allData;
    allData = {
        expenseMoney: 0,
        expenseCount: 0,
        expenseMin: 0,
        expenseAvg: 0,
        expenseMax: 0,
        incomeMoney: 0,
        incomeCount: 0,
        incomeMin: 0,
        incomeAvg: 0,
        incomeMax: 0,
    }
    if (expenseCount != 0) {
        allData.expenseMoney = expenseMoney[0].amount;
        allData.expenseCount = expenseCount;
        allData.expenseMax = expenseMin[0].amount;
        allData.expenseAvg = expenseAvg[0].amount;
        allData.expenseMin = expenseMax[0].amount;
    }
    if (incomeCount != 0) {
        allData.incomeMoney = incomeMoney[0].amount;
        allData.incomeCount = incomeCount;
        allData.incomeMax = incomeMin[0].amount;
        allData.incomeAvg = incomeAvg[0].amount;
        allData.incomeMin = incomeMax[0].amount;
    }

    res.render("profile.ejs", { allData, loginData });
})

app.get("/error", (req, res) => {
    res.render("error.ejs");
})
app.get("/id=:id/:user-login/dashboards", async (req, res) => {
    let { id, user } = req.params;
    if (user != 'user') {
        res.redirect("/id=" + id + "/admin-login/dashboard")
    }
    else {
        res.redirect("/id=" + id + "/user-login/no-admin");
    }
})
app.get("/id=:id/admin-login/dashboard", async (req, res) => {
    let { id } = req.params;
    let login = {
        id: id,
        user: "admin",
    }
    let expenseCount = await Transaction.find({ transactionType: "expense" }).count();
    let incomeCount = await Transaction.find({ transactionType: "income" }).count();

    let expenseMoney = await Transaction.aggregate([{ $match: { transactionType: "expense" } }, { $group: { _id: "$transactionType", amount: { $sum: "$amount" } } }])
    let expenseMin = await Transaction.aggregate([{ $match: { transactionType: "expense" } }, { $group: { _id: "$transactionType", amount: { $min: "$amount" } } }])
    let expenseMax = await Transaction.aggregate([{ $match: { transactionType: "expense" } }, { $group: { _id: "$transactionType", amount: { $max: "$amount" } } }])
    let expenseAvg = await Transaction.aggregate([{ $match: { transactionType: "expense" } }, { $group: { _id: "$transactionType", amount: { $avg: "$amount" } } }])
    let incomeMoney = await Transaction.aggregate([{ $match: { transactionType: "income" } }, { $group: { _id: "$transactionType", amount: { $sum: "$amount" } } }])
    let incomeMin = await Transaction.aggregate([{ $match: { transactionType: "income" } }, { $group: { _id: "$transactionType", amount: { $min: "$amount" } } }])
    let incomeMax = await Transaction.aggregate([{ $match: { transactionType: "income" } }, { $group: { _id: "$transactionType", amount: { $max: "$amount" } } }])
    let incomeAvg = await Transaction.aggregate([{ $match: { transactionType: "income" } }, { $group: { _id: "$transactionType", amount: { $avg: "$amount" } } }])
    var allData;
    allData = {
        expenseMoney: 0,
        expenseCount: 0,
        expenseMin: 0,
        expenseAvg: 0,
        expenseMax: 0,
        incomeMoney: 0,
        incomeCount: 0,
        incomeMin: 0,
        incomeAvg: 0,
        incomeMax: 0,
    }
    if (expenseCount != 0) {
        allData.expenseMoney = expenseMoney[0].amount;
        allData.expenseCount = expenseCount;
        allData.expenseMax = expenseMin[0].amount;
        allData.expenseAvg = expenseAvg[0].amount;
        allData.expenseMin = expenseMax[0].amount;
    }
    if (incomeCount != 0) {
        allData.incomeMoney = incomeMoney[0].amount;
        allData.incomeCount = incomeCount;
        allData.incomeMax = incomeMin[0].amount;
        allData.incomeAvg = incomeAvg[0].amount;
        allData.incomeMin = incomeMax[0].amount;
    }
    res.render("dashboard.ejs", { allData, login });
})
app.get("/id=:id/user-login/no-admin", (req, res) => {
    let { id } = req.params;
    let login = { id: id, user: "user" }
    res.render("errorlogin.ejs", { login });
})
app.get("/id=:id/:user-login/expenseList", async (req, res) => {
    let login = req.params;
    if (login.user == 'user') {
        let expenses = await Transaction.find({ transactionType: "expense",user_id:login.id});
        res.render("expenselist.ejs", { expenses,login });
    } else {
        let expenses = await Transaction.find({ transactionType: "expense"});
        var newExpense;
        var newExpenses=[];
        for(let expense of expenses){
            let data = await Login.findById(expense.user_id);
             newExpense = {
                depositedBy: data.fname+" "+data.lname,
                title:expense.title,
                description:expense.description,
                amount:expense.amount,
                date:expense.recordDate,
            }
            newExpenses.push(newExpense);
        }
        console.log(newExpenses);
        res.render("adminExpenseList.ejs", { newExpenses,login });
    }
})

app.get("/id=:id/:user-login/incomeList", async(req, res) => {
    let login = req.params;
    if (login.user == 'user') {
        let incomes = await Transaction.find({ transactionType: "income",user_id:login.id});
        console.log(incomes)
        res.render("incomelist.ejs", { incomes,login });
    } else {
        let incomes = await Transaction.find({ transactionType: "income"});
        var newIncome;
        var newIncomes=[];
        for(let income of incomes){
            let data = await Login.findById(income.user_id);
             newIncome = {
                depositedBy: data.fname+" "+data.lname,
                title:income.title,
                description:income.description,
                amount:income.amount,
                date:income.recordDate,
            }
            newIncomes.push(newIncome);
        }
        console.log(newIncomes);
        res.render("adminIncomeList.ejs", { newIncomes,login });
    }
})

app.get("/id=:id/:user-login/income", (req, res) => {
    let login = req.params;
    res.render("income.ejs", { login });
})
app.post("/id=:id/:user-login/income/submit", (req, res) => {
    let login = req.params;
    let transaction = req.body;
    let newTransaction = new Transaction({
        title: transaction.title,
        description: transaction.description,
        amount: transaction.amount,
        transactionType: "income",
        user_id: login.id,
        recordDate:date(),
    });
    newTransaction.save().then(() => {
        res.redirect("/id=" + login.id + "/" + login.user + "-login");
    }).catch((err) => {
        console.log(err.errors);
    })
})
app.get("/id=:id/:user-login/expense", (req, res) => {
    let login = req.params;
    res.render("expense.ejs", { login });
})
app.post("/id=:id/:user-login/expense/submit", (req, res) => {
    let login = req.params;
    let transaction = req.body;
    let newTransaction = new Transaction({
        title: transaction.title,
        description: transaction.description,
        amount: transaction.amount,
        transactionType: "expense",
        user_id: login.id,
        recordDate:date(),
    });
    newTransaction.save().then(() => {
        res.redirect("/id=" + login.id + "/" + login.user + "-login");
    }).catch((err) => {
        console.log(err.errors);
    })
})
app.get("/id=:id/:user-login/profileUpdate", async (req, res) => {
    let {id,user} = req.params;
    let login = await Login.findById(id);
    res.render("profileUpdate.ejs",{login});
})
app.patch("/id=:id/:user-login/profileUpdate/submit", async (req, res) => {
    let {id,user} = req.params;
    let updated = req.body;
    let login = await Login.updateOne({_id:id},{fname:updated.fname,lname:updated.lname},{runValidators:true,new:true});
    res.redirect("/id="+id+"/"+user+"-login");
})
//To find the current Date
function date() {
    let newDate = new Date();
    newDate = newDate.toString().split(" ").slice(1, 4).join("-");
    return newDate;
}