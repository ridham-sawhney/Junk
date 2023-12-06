const fs = require('fs');
const { Builder, By, until,WebDriverWait } = require('selenium-webdriver');
const moment = require('moment');
const os = require('os');
const path = require('path');

// Get the user's home directory
const userHome = os.homedir();

// Specify the path for the "Downloads" folder
const downloadsPath = path.join(userHome, 'Downloads');
// Specify the folder name you want to create
const folderName = 'SurveyTraces';

// Specify the full path for the new folder
const folderPath = path.join(downloadsPath, folderName);

// Create the folder
fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating folder:', err);
    } else {
      console.log(`Folder ${folderName} created successfully in the Downloads directory.`);
    }
  });



let returnData=[];
let returnDataElement={
    "user":"",
    "SurveyResults":[]
};

async function typeInUsername(driver, username) {
    await driver.wait(until.elementLocated(By.id('username')), 20000);
    return await driver.findElement(By.id('username')).sendKeys(username);
}
async function typeInPassword(driver, password) {
    await driver.wait(until.elementLocated(By.id('password')), 20000);
    return await driver.findElement(By.id('password')).sendKeys(password);
}
async function clickSignIn(driver) {
    return await driver.findElement(By.id("chklgnbtn")).click();
}
async function clickSubmit(driver) {
    await driver.wait(until.elementLocated(By.className("blk-btn btn-fill survey-submit-btn")), 20000);
    return await driver.findElement(By.className("blk-btn btn-fill survey-submit-btn")).click();
}
async function clickClose(driver) {
    await driver.wait(until.elementLocated(By.className("btn-out survey-scs-cls")), 20000);
    return await driver.findElement(By.className("btn-out survey-scs-cls")).click();
}
async function waitLoadingToStop(driver) {
    return await driver.wait(until.stalenessOf(driver.findElement(By.css('.loader-text'))), 20000);
}
async function waitSurveyLoadingToStop(driver) {
   // return await driver.wait(until.elementLocated(By.css('.bg-blur:not(:visible)')), 20000);
    element = await driver.findElement(By.className("bg-blur"))
    return await driver.wait(async function () {
        return await driver.executeScript('return window.getComputedStyle(arguments[0]).getPropertyValue("display") === "none"', element);
    }, 20000, 'Element did not become invisible within 10 seconds');
}
async function clickTakeSurvey(driver) {
    await driver.wait(until.elementLocated(By.className("card info-card survey-card")), 20000);
    return await driver.findElement(By.className("card info-card survey-card")).click();
}
async function logoutUser(driver) {
    await driver.wait(until.elementLocated(By.className('user')), 20000);
    await driver.findElement(By.className("user")).click();

    await driver.wait(until.elementLocated(By.className('logout-btn')), 20000);
    await driver.findElement(By.className("logout-btn")).click();

    await driver.wait(until.elementLocated(By.className('blk-btn btn-fill')), 20000);
   return await driver.findElement(By.className("blk-btn btn-fill")).click();
   // return await driver.sleep(2000);
}
async function giveSurvey(driver,count) {
    var isSurveyDone=false;
    try{
    const element = await driver.findElement(By.className('nosurd'));
    isSurveyDone = await element.isDisplayed();
    }
    catch(err){
    }
   

    if(isSurveyDone){
        log(`\tSurvey ${count} was already done.`)
        returnDataElement.SurveyResults.push(`Survey ${count} was already done.`);
        return;
    }


    await driver.wait(until.elementsLocated(By.css('.lisq')), 20000);

    const divisions = await driver.findElements(By.css('.lisq'));

    for (const division of divisions) {
        // Scroll to the division if necessary
        await driver.executeScript('arguments[0].scrollIntoView(true)', division);

        // Find all inputs inside the current division
        const inputs = await division.findElements(By.css('.survey-option .radiobtn'));

        // Select one of the inputs
         //const input = inputs[count%4];
        // count++;
        const input = inputs[Math.floor(Math.random() * inputs.length)];
        await driver.executeScript('arguments[0].scrollIntoView(true)', input);

        // Click on the selected input
        await input.click();
        //await driver.sleep(1000);

        // Perform any other desired actions here
    }
    await clickSubmit(driver);
    await driver.sleep(1000);
    await clickClose(driver);
    returnDataElement.SurveyResults.push(`Survey ${count} done.`);

   log(`\tSurvey ${count} done.`)


}

function log(message,overwrite = false) {
    const logMessage = `${message}\n`;
    const fileFlag = overwrite ? 'w' : 'a';
    fs.writeFileSync(`${folderPath}/${moment().format('YYYY-MM-DD')}_Survey.txt`, logMessage, { flag: fileFlag });
    console["info"](message);
}
let cc=0;

async function Work(Users) {
    console.log("Survey Started")
    let driver ;
    driver = await new Builder().forBrowser('chrome').build();
    driver.manage().window().maximize();

    await driver.get('https://curativesurvey.com/Userf/UserLogin');
    await driver.sleep(5000);
    log(`\n\n[${moment().format('YYYY-MM-DD HH:mm:ss')}]\n########################\n`,true)


    for (let i = 0; i < Users.length; i++) {
        log(`-----------------------------\n`);
        log(`[User : ${Users[i][0]}]\n`);
        returnDataElement={
            "user":"",
            "SurveyResults":[]
        };
        returnDataElement.user=Users[i][0];
        try{
        await typeInUsername(driver, Users[i][0]);
        await typeInPassword(driver, Users[i][1]);
        await clickSignIn(driver);
        await waitLoadingToStop(driver);
        await driver.sleep(2000);
        
        await clickTakeSurvey(driver);
        //await driver.sleep(2000);
        await driver.wait(until.elementsLocated(By.css('a[data-cid]')), 20000);
        
        const elements = await driver.findElements(By.css('a[data-cid]'));
        
        const actions = driver.actions({ async: true });
        await driver.executeScript("arguments[0].scrollIntoView();", elements[0]);
        await actions.move({ origin: elements[0] }).perform();
        
        await elements[0].click();
        await waitSurveyLoadingToStop(driver);
        //await driver.sleep(5000);
        await giveSurvey(driver,1);
        //await clickSubmit(driver);
        // await driver.sleep(1000);
        //await clickClose(driver);
        await driver.sleep(500);
        
        
        await driver.executeScript("arguments[0].scrollIntoView();", elements[1]);
        await actions.move({ origin: elements[1] }).perform();
        await elements[1].click();
        await waitSurveyLoadingToStop(driver);
        //await driver.sleep(5000);
        await giveSurvey(driver,2);
        //await clickSubmit(driver);
        //await driver.sleep(1000);
        //await clickClose(driver);
        await driver.sleep(500);
        
        await driver.executeScript("arguments[0].scrollIntoView();", elements[2]);
        await actions.move({ origin: elements[2] }).perform();
        await elements[2].click();
        await waitSurveyLoadingToStop(driver);
        // await driver.sleep(5000);
        await giveSurvey(driver,3);
        //await clickSubmit(driver);
        //await driver.sleep(1000);
        //await clickClose(driver);
        await driver.sleep(500);
        
        await driver.executeScript("arguments[0].scrollIntoView();", elements[3]);
        await actions.move({ origin: elements[3] }).perform();
        await elements[3].click();
        await waitSurveyLoadingToStop(driver);
        // await driver.sleep(5000);
        await giveSurvey(driver,4);
        //await clickSubmit(driver);
        //await driver.sleep(1000);
        //await clickClose(driver);
        await driver.sleep(500);
        
        await driver.executeScript("arguments[0].scrollIntoView();", elements[4]);
        await actions.move({ origin: elements[4] }).perform();
        await elements[4].click();
        await waitSurveyLoadingToStop(driver);
       // await driver.sleep(5000);
        await giveSurvey(driver,5);
        //await clickSubmit(driver);
        //await driver.sleep(1000);
        //await clickClose(driver);
        await driver.sleep(500);
         
        returnData.push(returnDataElement);
        await logoutUser(driver);
        }
        catch(error){
            cc++;
            log("\n==================================\n")
            log("#Error:\n")
            log(error);
            log("\n==================================\n")
            for(let i=returnDataElement.SurveyResults.length;i<5;i++)
            {
              returnDataElement.SurveyResults.push(`Survey ${i+1} failed , restart survey or do manually!!`)
            }
            returnData.push(returnDataElement);
            await driver.quit();
            driver = await new Builder().forBrowser('chrome').build();
            driver.manage().window().maximize();

            await driver.get('https://curativesurvey.com/Userf/UserLogin');
            await driver.sleep(2500);
        }
        

        
    }

    await driver.quit();
};

process.on('message', async (message) => {
    console.log(message)
    await Work(message);
  
    // Use the data in the child process (modify or process it)
    // const responseData = `Received your data: ${JSON.stringify(message)}`;
  
    // Send a response back to the parent process
    process.send(returnData);
  
    // Exit the child process
    process.exit();
  });