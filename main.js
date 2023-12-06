const express = require('express');
const { fork } = require('child_process');
const axios = require('axios');
const fs = require('fs').promises;

const { Builder, By, until, WebDriverWait } = require('selenium-webdriver');
const moment = require('moment');
const os = require('os');
const path = require('path');

const port = process.env.port || 5002;

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/css", express.static(__dirname + "p"))

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

    var username = req.body.key;
    try {
      var users = await axios.get(`http://ridhamsawhney.com/SurveyAccess//users.json`);
    }
    catch (error) {
      alert("Something went wrong.");
      res.redirect('/');
    }

    users = users.data[0].Users;
    var found = false;
    for(var i = 0; i < users.length;i++)
    {
       if(username==users[i])
       {
        found=true;
       }
    }
    if(found){
      var path = req.body.path;
      path = path.replace(/^"|"$/g, '');
      const data = await loadData(path);
      jsonData = data;
      console.log(jsonData);
    }

    
    res.redirect('/');
  }
  catch (err) {
    res.redirect('/');
  }

});


function createPromise(data){
  return new Promise((resolve, reject) => {
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
      resolve(childOutput);
    });
  });
}

app.post('/runScript', async (req, res) => {
  TraceData = [];
  // var data = req.body 
  var parentArray = [];
  jsonData.forEach((jsonElement) => {
    var childArray = [];
    childArray.push(jsonElement.id)
    childArray.push(jsonElement.password);
    parentArray.push(childArray);
  })
  var data = parentArray;

  try {
    var access = await axios.get(`http://ridhamsawhney.com/SurveyAccess//data.json`);
  }
  catch (error) {
    res.send("Something went wrong.")
  }
  access = access.data[0].access;
  console.log(access);
  if (access != "Granted") {
    console.log("***********");
    res.send("Access Denied : Contact Ridham.");
  }

  else if (data.length < 1) {

    res.send("Load some ids..");

  }
  else {

    var chunkSize = Math.max(Math.ceil(data.length / 5), 1) ;
    var childProcessPromises = [];
    for(let i=0;i<data.length;i+=chunkSize)
    {
      childProcessPromises.push(createPromise(data.slice(i, i + chunkSize)))
    }

    Promise.all(childProcessPromises).then((response) => {
      console.log(response)
      var finalResponse = [];
      for(let i=0;i<response.length;i++)
      {
        finalResponse.push(...response[i])
      }
      console.log(finalResponse);
      res.send(finalResponse)
    })

    // if (data.length > 1) {
    //   var midPoint = Math.ceil(data.length / 2)
    //   var childProcess1RequestData = data.slice(0, midPoint);
    //   var childProcess2RequestData = data.slice(midPoint);

    //   const childProcess1Promise = new Promise((resolve, reject) => {
    //     const childProcess1 = fork('firsttest.js');
    //     let childOutput1 = '';

    //     childProcess1.send(childProcess1RequestData)

    //     childProcess1.on('message', (message) => {
    //       console.log('Received message from child process:', message);
    //       if (message) {
    //         console.log("message")
    //         childOutput1 = message;
    //       }
    //     });

    //     childProcess1.on('exit', (code) => {
    //       console.log(`Child Process Exited with Code ${code}`);
    //       resolve(childOutput1);
    //     });
    //   });

    //   const childProcess2Promise = new Promise((resolve, reject) => {
    //     const childProcess2 = fork('firsttest.js');
    //     let childOutput2 = '';

    //     childProcess2.send(childProcess2RequestData);

    //     childProcess2.on('message', (message) => {
    //       console.log('Received message from child process:', message);
    //       if (message) {
    //         console.log("message")
    //         childOutput2 = message;
    //       }
    //     });

    //     childProcess2.on('exit', (code) => {
    //       console.log(`Child Process Exited with Code ${code}`);
    //       resolve(childOutput2);
    //     });
    //   });

    //   Promise.all([childProcess1Promise, childProcess2Promise]).then((response) => {
    //     var childProcess1Response = response[0];
    //     var childProcess2Response = response[1];
    //     console.log([...childProcess1Response, ...childProcess2Response])
    //     res.send([...childProcess1Response, ...childProcess2Response])
    //   })
    //  }
    

  }
});



app.post('/runScriptSingleElement', async (req, res) => {
  TraceData = [];

  var parentArray = [];
  req.body.forEach((jsonElement) => {
    var childArray = [];
    childArray.push(jsonElement.id)
    childArray.push(jsonElement.password);
    parentArray.push(childArray);
  })
  var data = parentArray;

  try {
    var access = await axios.get(`http://ridhamsawhney.com/SurveyAccess//data.json`);
  }
  catch (error) {
    res.send("Something went wrong.")
  }
  access = access.data[0].access;
  console.log(access);
  if (access != "Granted") {
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

app.post('/refresh', async (req, res) => {
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