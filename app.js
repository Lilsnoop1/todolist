import express from "express";
import bodyParser from "body-parser";
const app = express();
import mongoose from "mongoose";
mongoose.connect("mongodb+srv://ammar:ammar@cluster0.vuzjvhx.mongodb.net/CapstoneDB");

const normalListSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})
const workListSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})
const normalListItem = mongoose.model("NormalItem",normalListSchema);
const workListItem = mongoose.model("WorkItem",workListSchema);
const defautItems = [];
normalListItem.find()
.then(function (itemting){
    for(let i =0;i<itemting.length;i++){
        defautItems.push(itemting[i].item)
        console.log(itemting[i].item);
    }
})
.catch(err=>{
    console.log(err)
})
const defautItems2 = [];
workListItem.find()
.then(function (workting){
    for(let z =0;z<workting.length;z++){
        defautItems2.push(workting[z].item)
        console.log(workting[z].item);
    }
})
.catch(err=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get('/',(req,res)=>{
    const d = new Date();
    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    var day = week[d.getDay()];
    const e = new Date();
    let date = e.getDate();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const f = new Date();
    let name = month[f.getMonth()];
    var final = `${day}, ${name} ${date}`;
    var comparison = 1;
    res.render("index.ejs",{
        Day: final,
        Comparer: comparison,
        array: defautItems

    });
})
app.get('/work',(req,res) =>{
    const workList = "Work List"
    res.render("index.ejs",{
        Day: workList,
        arrayTwo: defautItems2
    })
})
// Listen you faggot you have to fix the bug that resides in app.post  
// everytime we submit it bascially crashes because Day is not defined, fix it
app.post("/submit",(req,res) =>{
    const d = new Date();
    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    var day = week[d.getDay()];
    const e = new Date();
    let date = e.getDate();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const listItem1 = new normalListItem({
        item: req.body.listItem + " "
    })
    defautItems.push(listItem1.item);
    normalListItem.insertMany(listItem1)
        .then(result =>{
            console.log(result);
        })
        .catch(err =>{
            console.log(err);
        })
    const f = new Date();
    let name = month[f.getMonth()];
    var final = `${day}, ${name} ${date}`
    var comparison = 1;
    res.render("index.ejs",{
        Day: final,
        Comparer: comparison,
        array: defautItems
    })
})
app.post("/work-submit",(req,res)=>{
    const listItem2 = new workListItem({
        item: req.body.listItem + " "
    })
    defautItems2.push(listItem2.item)
    workListItem.insertMany(listItem2)
        .then(result =>{
            console.log(result);
        })
        .catch(err =>{
            console.log(err);
        })

    const workList = "Work List";
    res.render("index.ejs",{
        Day: workList,
        arrayTwo: defautItems2
    })
})
app.post("/delete-normal",(req,res) =>{
    const d = new Date();
    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    var day = week[d.getDay()];
    const e = new Date();
    let date = e.getDate();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const f = new Date();
    let name = month[f.getMonth()];
    var final = `${day}, ${name} ${date}`;
    normalListItem.deleteOne({item: req.body.taskList})
        .then(data => {
            console.log(data);
        })
        .catch(err=>{
            console.log(err);
        })
    for (let a =0; a<defautItems.length; a++){
        if ( defautItems[a] === req.body.taskList){
            defautItems.splice(a,1);
        }
    }
    res.render("index.ejs",{
        array: defautItems,
        Day:final,
    })
})
app.post("/delete-work",(req,res) =>{
        workListItem.deleteOne({item: req.body.taskList})
        .then(data => {
            console.log(data);
        })
        .catch(err=>{
            console.log(err);
        })
    for (let a =0; a<defautItems2.length; a++){
        if ( defautItems2[a] === req.body.taskList){
            defautItems2.splice(a,1);
        }
    }
    const haiKuch = "Work List"
    res.render("index.ejs",{
        arrayTwo: defautItems2,
        Day: haiKuch
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})