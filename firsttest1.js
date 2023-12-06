const fs=require("fs"),{Builder:e,By:a,until:t,WebDriverWait:i}=require("selenium-webdriver"),moment=require("moment"),os=require("os"),path=require("path"),userHome=os.homedir(),downloadsPath=path.join(userHome,"Downloads"),folderName="SurveyTraces",folderPath=path.join(downloadsPath,"SurveyTraces");let returnData=[],returnDataElement={user:"",SurveyResults:[]};async function typeInUsername(e,i){return await e.wait(t.elementLocated(a.id("username")),2e4),await e.findElement(a.id("username")).sendKeys(i)}async function typeInPassword(e,i){return await e.wait(t.elementLocated(a.id("password")),2e4),await e.findElement(a.id("password")).sendKeys(i)}async function clickSignIn(e){return await e.findElement(a.id("chklgnbtn")).click()}async function clickSubmit(e){return await e.wait(t.elementLocated(a.className("blk-btn btn-fill survey-submit-btn")),2e4),await e.findElement(a.className("blk-btn btn-fill survey-submit-btn")).click()}async function clickClose(e){return await e.wait(t.elementLocated(a.className("btn-out survey-scs-cls")),2e4),await e.findElement(a.className("btn-out survey-scs-cls")).click()}async function waitLoadingToStop(e){return await e.wait(t.stalenessOf(e.findElement(a.css(".loader-text"))),2e4)}async function waitSurveyLoadingToStop(e){return await e.wait(async function(){return await e.executeScript('return window.getComputedStyle(arguments[0]).getPropertyValue("display") === "none"',element=await e.findElement(a.className("bg-blur")))},2e4,"Element did not become invisible within 10 seconds")}async function clickTakeSurvey(e){return await e.wait(t.elementLocated(a.className("card info-card survey-card")),2e4),await e.findElement(a.className("card info-card survey-card")).click()}async function logoutUser(e){return await e.wait(t.elementLocated(a.className("user")),2e4),await e.findElement(a.className("user")).click(),await e.wait(t.elementLocated(a.className("logout-btn")),2e4),await e.findElement(a.className("logout-btn")).click(),await e.wait(t.elementLocated(a.className("blk-btn btn-fill")),2e4),await e.findElement(a.className("blk-btn btn-fill")).click()}async function giveSurvey(e,i){var n=!1;try{let r=await e.findElement(a.className("nosurd"));n=await r.isDisplayed()}catch(s){}if(n){returnDataElement.SurveyResults.push(`Survey ${i} was already done.`);return}await e.wait(t.elementsLocated(a.css(".lisq")),2e4);let l=await e.findElements(a.css(".lisq"));for(let c of l){await e.executeScript("arguments[0].scrollIntoView(true)",c);let o=await c.findElements(a.css(".survey-option .radiobtn")),u=o[Math.floor(Math.random()*o.length)];await e.executeScript("arguments[0].scrollIntoView(true)",u),await u.click()}await clickSubmit(e),await e.sleep(1e3),await clickClose(e),returnDataElement.SurveyResults.push(`Survey ${i} done.`)}let cc=0;async function Work(i){let n;(n=await new e().forBrowser("chrome").build()).manage().window().maximize(),await n.get("https://curativesurvey.com/Userf/UserLogin"),await n.sleep(5e3);for(let r=0;r<i.length;r++){(returnDataElement={user:"",SurveyResults:[]}).user=i[r][0];try{await typeInUsername(n,i[r][0]),await typeInPassword(n,i[r][1]),await clickSignIn(n),await waitLoadingToStop(n),await n.sleep(2e3),await clickTakeSurvey(n),await n.wait(t.elementsLocated(a.css("a[data-cid]")),2e4);let s=await n.findElements(a.css("a[data-cid]")),l=n.actions({async:!0});await n.executeScript("arguments[0].scrollIntoView();",s[0]),await l.move({origin:s[0]}).perform(),await s[0].click(),await waitSurveyLoadingToStop(n),await giveSurvey(n,1),await n.sleep(500),await n.executeScript("arguments[0].scrollIntoView();",s[1]),await l.move({origin:s[1]}).perform(),await s[1].click(),await waitSurveyLoadingToStop(n),await giveSurvey(n,2),await n.sleep(500),await n.executeScript("arguments[0].scrollIntoView();",s[2]),await l.move({origin:s[2]}).perform(),await s[2].click(),await waitSurveyLoadingToStop(n),await giveSurvey(n,3),await n.sleep(500),await n.executeScript("arguments[0].scrollIntoView();",s[3]),await l.move({origin:s[3]}).perform(),await s[3].click(),await waitSurveyLoadingToStop(n),await giveSurvey(n,4),await n.sleep(500),await n.executeScript("arguments[0].scrollIntoView();",s[4]),await l.move({origin:s[4]}).perform(),await s[4].click(),await waitSurveyLoadingToStop(n),await giveSurvey(n,5),await n.sleep(500),returnData.push(returnDataElement),await logoutUser(n)}catch(c){cc++;for(let o=returnDataElement.SurveyResults.length;o<5;o++)returnDataElement.SurveyResults.push(`Survey ${o+1} failed , restart survey or do manually!!`);returnData.push(returnDataElement),await n.quit(),(n=await new e().forBrowser("chrome").build()).manage().window().maximize(),await n.get("https://curativesurvey.com/Userf/UserLogin"),await n.sleep(2500)}}await n.quit()}process.on("message",async e=>{await Work(e),process.send(returnData),process.exit()});