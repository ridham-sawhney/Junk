const fs=require("fs"),{Builder:Builder,By:By,until:until,WebDriverWait:WebDriverWait}=require("selenium-webdriver"),moment=require("moment"),os=require("os"),path=require("path"),userHome=os.homedir(),downloadsPath=path.join(userHome,"Downloads"),folderName="SurveyTraces",folderPath=path.join(downloadsPath,folderName);
// Create the folder
fs.mkdir(folderPath,{recursive:!0},(e=>{e?console.error("Error creating folder:",e):console.log(`Folder "${folderName}" created successfully in the Downloads directory.`)}));let returnData=[],returnDataElement={user:"",SurveyResults:[]};async function typeInUsername(e,t){return await e.wait(until.elementLocated(By.id("username")),2e4),await e.findElement(By.id("username")).sendKeys(t)}async function typeInPassword(e,t){return await e.wait(until.elementLocated(By.id("password")),2e4),await e.findElement(By.id("password")).sendKeys(t)}async function clickSignIn(e){return await e.findElement(By.id("chklgnbtn")).click()}async function clickSubmit(e){return await e.wait(until.elementLocated(By.className("blk-btn btn-fill survey-submit-btn")),2e4),await e.findElement(By.className("blk-btn btn-fill survey-submit-btn")).click()}async function clickClose(e){return await e.wait(until.elementLocated(By.className("btn-out survey-scs-cls")),2e4),await e.findElement(By.className("btn-out survey-scs-cls")).click()}async function waitLoadingToStop(e){return await e.wait(until.stalenessOf(e.findElement(By.css(".loader-text"))),2e4)}async function waitSurveyLoadingToStop(e){
// return await driver.wait(until.elementLocated(By.css('.bg-blur:not(:visible)')), 20000);
return element=await e.findElement(By.className("bg-blur")),await e.wait((async function(){return await e.executeScript('return window.getComputedStyle(arguments[0]).getPropertyValue("display") === "none"',element)}),2e4,"Element did not become invisible within 10 seconds")}async function clickTakeSurvey(e){return await e.wait(until.elementLocated(By.className("card info-card survey-card")),2e4),await e.findElement(By.className("card info-card survey-card")).click()}async function logoutUser(e){return await e.wait(until.elementLocated(By.className("user")),2e4),await e.findElement(By.className("user")).click(),await e.wait(until.elementLocated(By.className("logout-btn")),2e4),await e.findElement(By.className("logout-btn")).click(),await e.wait(until.elementLocated(By.className("blk-btn btn-fill")),2e4),await e.findElement(By.className("blk-btn btn-fill")).click();
// return await driver.sleep(2000);
}async function giveSurvey(e,t){var a=!1;try{const t=await e.findElement(By.className("nosurd"));a=await t.isDisplayed()}catch(e){}if(a)return log(`\tSurvey ${t} was already done.`),void returnDataElement.SurveyResults.push(`Survey ${t} was already done.`);await e.wait(until.elementsLocated(By.css(".lisq")),2e4);const i=await e.findElements(By.css(".lisq"));for(const t of i){
// Scroll to the division if necessary
await e.executeScript("arguments[0].scrollIntoView(true)",t);
// Find all inputs inside the current division
const a=await t.findElements(By.css(".survey-option .radiobtn")),i=a[Math.floor(Math.random()*a.length)];
// Select one of the inputs
//const input = inputs[count%4];
// count++;
await e.executeScript("arguments[0].scrollIntoView(true)",i),
// Click on the selected input
await i.click()}await clickSubmit(e),await e.sleep(1e3),await clickClose(e),returnDataElement.SurveyResults.push(`Survey ${t} done.`),log(`\tSurvey ${t} done.`)}function log(e,t=!1){const a=`${e}\n`,i=t?"w":"a";fs.writeFileSync(`${folderPath}/${moment().format("YYYY-MM-DD")}_Survey.txt`,a,{flag:i}),console.info(e)}let cc=0;async function Work(e){let t;console.log("Survey Started"),t=await(new Builder).forBrowser("chrome").build(),t.manage().window().maximize(),await t.get("https://curativesurvey.com/Userf/UserLogin"),await t.sleep(5e3),log(`\n\n[${moment().format("YYYY-MM-DD HH:mm:ss")}]\n########################\n`,!0);for(let a=0;a<e.length;a++){log("-----------------------------\n"),log(`[User : ${e[a][0]}]\n`),returnDataElement={user:"",SurveyResults:[]},returnDataElement.user=e[a][0];try{await typeInUsername(t,e[a][0]),await typeInPassword(t,e[a][1]),await clickSignIn(t),await waitLoadingToStop(t),await t.sleep(2e3),await clickTakeSurvey(t),
//await driver.sleep(2000);
await t.wait(until.elementsLocated(By.css("a[data-cid]")),2e4);const i=await t.findElements(By.css("a[data-cid]")),n=t.actions({async:!0});await t.executeScript("arguments[0].scrollIntoView();",i[0]),await n.move({origin:i[0]}).perform(),await i[0].click(),await waitSurveyLoadingToStop(t),
//await driver.sleep(5000);
await giveSurvey(t,1),
//await clickSubmit(driver);
// await driver.sleep(1000);
//await clickClose(driver);
await t.sleep(500),await t.executeScript("arguments[0].scrollIntoView();",i[1]),await n.move({origin:i[1]}).perform(),await i[1].click(),await waitSurveyLoadingToStop(t),
//await driver.sleep(5000);
await giveSurvey(t,2),
//await clickSubmit(driver);
//await driver.sleep(1000);
//await clickClose(driver);
await t.sleep(500),await t.executeScript("arguments[0].scrollIntoView();",i[2]),await n.move({origin:i[2]}).perform(),await i[2].click(),await waitSurveyLoadingToStop(t),
// await driver.sleep(5000);
await giveSurvey(t,3),
//await clickSubmit(driver);
//await driver.sleep(1000);
//await clickClose(driver);
await t.sleep(500),await t.executeScript("arguments[0].scrollIntoView();",i[3]),await n.move({origin:i[3]}).perform(),await i[3].click(),await waitSurveyLoadingToStop(t),
// await driver.sleep(5000);
await giveSurvey(t,4),
//await clickSubmit(driver);
//await driver.sleep(1000);
//await clickClose(driver);
await t.sleep(500),await t.executeScript("arguments[0].scrollIntoView();",i[4]),await n.move({origin:i[4]}).perform(),await i[4].click(),await waitSurveyLoadingToStop(t),
// await driver.sleep(5000);
await giveSurvey(t,5),
//await clickSubmit(driver);
//await driver.sleep(1000);
//await clickClose(driver);
await t.sleep(500),returnData.push(returnDataElement),await logoutUser(t)}catch(e){cc++,log("\n==================================\n"),log("#Error:\n"),log(e),log("\n==================================\n");for(let e=returnDataElement.SurveyResults.length;e<5;e++)returnDataElement.SurveyResults.push(`Survey ${e+1} failed , restart survey or do manually!!`);returnData.push(returnDataElement),await t.quit(),t=await(new Builder).forBrowser("chrome").build(),t.manage().window().maximize(),await t.get("https://curativesurvey.com/Userf/UserLogin"),await t.sleep(2500)}}await t.quit()}process.on("message",(async e=>{console.log(e),await Work(e),
// Use the data in the child process (modify or process it)
// const responseData = `Received your data: ${JSON.stringify(message)}`;
// Send a response back to the parent process
process.send(returnData),
// Exit the child process
process.exit()}));