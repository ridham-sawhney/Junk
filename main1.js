const express=require("express"),{fork:fork}=require("child_process"),axios=require("axios"),fs=require("fs").promises,{Builder:Builder,By:By,until:until,WebDriverWait:WebDriverWait}=require("selenium-webdriver"),moment=require("moment"),os=require("os"),path=require("path"),port=process.env.port||5002,app=express();app.set("view engine","ejs"),app.use(express.json()),app.use(express.urlencoded({extended:!0})),app.use(express.static("public")),app.use("/css",express.static(__dirname+"p"));let jsonData=[],TraceData=[];async function loadData(e){try{
    // const filePath = 'data.json';
    const s=await fs.readFile(e,"utf8");
    // console.log('Loaded data:', jsonData);
    return JSON.parse(s)}catch(e){throw console.error(`Error: ${e}`),new Error(e)}}app.get("/",((e,s)=>{
    // res.sendFile(__dirname + '/pages/form.html');
    s.render("form",{jsonData:jsonData,TraceData:TraceData})})),
    // Handle form submission
    app.post("/",(async(e,s)=>{try{jsonData=[],TraceData=[];var a=e.body.path;a=a.replace(/^"|"$/g,"");
    // res.send(`Form submitted with Path: ${path}`);
    const r=await loadData(a);jsonData=r,console.log(jsonData),s.redirect("/")}catch(e){s.redirect("/")}})),app.post("/runScript",(async(e,s)=>{TraceData=[];
    // var data = req.body 
    var a=[];jsonData.forEach((e=>{var s=[];s.push(e.id),s.push(e.password),a.push(s)}));var r=a;try{var t=await axios.get("http://ridhamsawhney.com/SurveyAccess//data.json")}catch(e){s.send("Something went wrong.")}if(t=t.data[0].access,console.log(t),"Granted"!=t)console.log("***********"),s.send("Access Denied : Contact Ridham.");else if(r.length<1)s.send("Load some ids..");else{const e=fork("firsttest1.js");let a="";e.send(r),e.on("message",(e=>{console.log("Received message from child process:",e),e&&(console.log("message"),a=e)})),e.on("exit",(e=>{console.log(`Child Process Exited with Code ${e}`),s.send(a)}))}})),app.post("/refresh",(async(e,s)=>{jsonData=[],TraceData=[],s.redirect("/")}
    // res.render('form', { jsonData ,TraceData});
    )),app.listen(port,(()=>{console.log(`Server is running at http://localhost:${port}`)}));