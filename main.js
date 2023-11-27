const express = require('express');
const { fork } = require('child_process');
const axios = require('axios');
const fs = require('fs').promises;

const port =process.env.port || 5002;

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let jsonData = [];
let TraceData = [];
app.get("/", (req, res) => {
  //  res.sendFile(__dirname + '/pages/form.html');
  res.render('form', { jsonData, TraceData });
});

// Handle form submission
app.post('/', async (req, res) => {
  try {
    jsonData = [];
    TraceData = [];

    var path = req.body.path;
    path = path.replace(/^"|"$/g, '');

    // res.send(`Form submitted with Path: ${path}`);
    const data = await loadData(path);
    jsonData = data;
    console.log(jsonData);
    res.redirect('/');
  }
  catch (err) {
    res.redirect('/');
  }

});

app.post('/runScript',async (req, res) => {
  TraceData=[];
  var data = req.body;
  try{
    var access = await axios.get(`http://ridhamsawhney.com/SurveyAccess//data.json`);
  }
  catch(error){
    res.send("Something went wrong.")
  }
  access=access.data[0].access;
  console.log(access);
  if(access!="Granted"){
    console.log("***********");
   res.send("Access Denied : Contact Ridham.");
  }

  else if (data.length < 1) {
    
   res.send("Load some ids..");
    
  }
  else {
    const childProcess = fork('firsttest.js');
    let childOutput = '';


    childProcess.send(data)

    childProcess.on('message', (message) => {
      console.log('Received message from child process:', message);
      if (message) {
        console.log("message")
        childOutput = message;
      }
    });

    childProcess.on('exit', (code) => {
      console.log(`Child Process Exited with Code ${code}`);
      res.send(childOutput);
    });
  }
});

app.post('/refresh', (req, res) => {
  jsonData = [];
  TraceData = [];
  res.redirect('/');
  // res.render('form', { jsonData ,TraceData});
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function loadData(filePath) {

  try {
    // const filePath = 'data.json';
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    //  console.log('Loaded data:', jsonData);
    return jsonData;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw new Error(error);
  }
}