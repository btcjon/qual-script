// ssh jon@45.33.9.86
/*
IP address  server type   VNC IP and port   VNC password  user name   password  operating system
207.180.222.229   VPS M SSD   144.91.83.233:63024   T8M5xK5f  root  mW89PeFitbD3kfEh  Ubuntu 18.04 (64 Bit)
ssh dev@207.180.222.229
*/
"use strict";
import puppeteer    from 'puppeteer';
import path         from 'path'
import dayjs        from 'dayjs';
import fs           from 'fs';
import csv          from 'csv-parser';
import axios        from 'axios';
import { GoogleSpreadsheet }  from 'google-spreadsheet';
import { JWT }               from 'google-auth-library';

const delay     = ms => new Promise(res => setTimeout(res, ms));

const params    = {waitLoad: true, timeout: 70000, waitNetworkIdle: true},
      creds     = {
        "type": "service_account",
        "project_id": "jonproject-322614",
        "private_key_id": "da33b7bc1bb90cf284658c812b755656832780b9",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmZnggfWDUYP4P\nbc9KSAFgOyqfdMSz4TNL3rXEKD33uH4SiE84oW3N2VlOtVpH5GgFtWXYCFBcZjLv\nmvx8iles/OjhDExZyTfpLKYhAwL5mEd9XqujW1w6aLFe+WLoNVC0UmecWpb631OZ\nQIrSbXFVHXbZOr1UAR5WIqevSuLzoEa4hG++hPzLIpTplzMaaMkzFR2ldI0SDtWH\nG6ySEIk+CTUu99Al2zO74haJdj9551/QSu1tujFgICNjGbfIgrjEtzUyts3NqErm\nQjqAdF6aQ0PQWKt53lfYLe4HZteKmXFpo0C+R3DAEF5L+YjdVsK/BYA+4YMAfOIj\nG61uRpinAgMBAAECggEAAkQYbcHnVf8xNGD71u/8fM91uO6SvueM7AMb7rKCqUEk\nY7RaB9RC8auvt5ckge10zw1+EcFlXJ/1y1iVkRmsH1Dhk8gNKMn8XWWpH+XT3jXe\ndxd3Jfc2d7Z9qsr3BHHXBdhIGdv6wSqi3FasVdIwprWcNXPlZEXMKPYf/HUNNkex\n2VFSBpAAeagiZznOsgVtS0vPc8aFXzRx+JR6K+w81kJ9WqYgJiEQC9e+NVyklr6s\nlhpiD9cPKIH0sInWBh514/uLaZH87r/HfZ6nc7m4CqV8g3YgvogaCTZpr73/ltmB\n3OqcgNkNKkpA4Bb9dHX3cquWLsvMGFWexPMrsVlBQQKBgQDWxrHafxH3nIUzhyn6\n+n+4IIj0OBLahBe/igFY74/8vwYzg7PyQ0YL6ZVF3Orh3Edo/zIDh6/Hu76bw9mU\nzZ0zWPi+AsDA1Q4eHIwqWEM3nfi12aPbwKCoZ8+z+ltwh8zZy+Arrbf4zwTyVK4l\nqhBoHUhp987PFa3TnUuiJSAFYQKBgQDGVsNDOXmbW4gxqjE72G6DKdQZLUAruGAK\nPWs7I16d8lg74MSCCmS5VizxBOqTAr+dBYW28r3ryKmzbM5icXRKfY58wehxnVCn\nk8MG7SrjrrEG+FbIJyWeYvywpVDlYZpEMd4ivWNi3Zw7Mw3nWE9ZUiN+p/S/xiLS\n9oqAIahTBwKBgE5krewzr2oyvkfFkSQjpNSfQ33orbEGv+hQxhchMewuCWRqMRc/\nSOT2OF8MuMsB7Sq84xN4xkdgFr2iKdvvhO6GDhzEwnhgC8wf3WVjW/2D8pDlxLJk\nR//QDHcD7bZQSwxAJy2qNdliLssI75udzGlELvdG1TyvDAiOhFnFtT9hAoGAC0hE\nMz7BvCSoyqpzwoO9RZjLh+MbE2GZlPuJbgPFDhcLDdzrULpmoGRWih9NeK9fVv9J\na+7C/vabMKmv08nAY7xgrpgZMN1SCTZOkcZL+kelqk/WH+yaJzhaR3If9+xlahus\nFy3OyYDxsixlThOn79zMSBglxALxWC7OEhvYB2ECgYAQ6qmP56yT2jzejmgLusAR\n4BBPOznZc9qkDvy7wrAdSX4T9PkDixznin8L1XBMDMTKOK9FsM5UFuu4qcFTK4iq\nSiHfds3aBB+nbffKoE+2dkrv/KFQv8ApHQNdRNIJ4e22FMJsFW0sykL0EHAJSksA\nRnJdSYn1oqrLSq9UnI3Odw==\n-----END PRIVATE KEY-----\n",
        "client_email": "worksheet-access@jonproject-322614.iam.gserviceaccount.com",
        "client_id": "111149546501706560900",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/worksheet-access%40jonproject-322614.iam.gserviceaccount.com"
      },
      downloadPath = `./qualification_download_files`,
      headers      = {
                          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                          "Accept-Encoding": "gzip, deflate, br",
                          "Accept-Language": "en-US,en;q=0.5",
                          "DNT": "1",
                          //"Host": "tools.securefreedom.com",
                          "Upgrade-Insecure-Requests": "1",
                          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0"
                        },
      SHEET_KEY    = {
                      khalid: {
                          sheetKey: "1zCRdFTHlJQX4T2PDiU063javYlDOU-FTYI6NL3vaTNU",
                          sheetPublishLink: "https://script.google.com/macros/s/AKfycbw7BkzWteab8wZUhm1ZlZvdjbwd1zIo1vX7tr4K27EGKbCNk3M/exec"
                      },jon: {
                          sheetKey: "168DK5e-3nmpCmve7hHWpH0wYY-APA1QPxbZsKfRM_Ww",
                          sheetPublishLinkOld: "https://script.google.com/macros/s/AKfycbyiAsibWJDEnkId7euuOPtaVeBBwnl3xockplxHDF6TE31ewNg/exec",
                          sheetPublishLink:    "https://script.google.com/macros/s/AKfycbzBhhjL9Nz4pnfzTndNyRYsnChRPbC207i3S1pQmo8wD_zpkhh22nCtYSeJesqHEdMl/exec"
                      }
                    }

async function runQualificationScript(sheetKeys) {
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  const doc = new GoogleSpreadsheet(sheetKeys.sheetKey, serviceAccountAuth);
  await doc.loadInfo();
  const sheetCount = doc.sheetCount
  for (var i = 2; i < sheetCount; i++) {
    await doc.sheetsByIndex[2].delete();
  }
  const dashboardSheet = doc.sheetsByIndex[0];
  await dashboardSheet.loadCells('A1:H40'); // loads a range of cells
  const startRow = await dashboardSheet.getCellByA1('H2');
  const endRow = await dashboardSheet.getCellByA1('H4');
  const startRowValue = startRow.value;
  const endRowValue   = endRow.value;
  const statusCell = await dashboardSheet.getCellByA1('H6');
  statusCell.value = "script running ...";
  await dashboardSheet.saveUpdatedCells();
  const dashboardCells = await dashboardSheet.getCellsInRange(`A${startRowValue}:C${endRowValue}`)
  runMultiAccounts(sheetKeys, doc, dashboardSheet, dashboardCells, statusCell)
}
const headless   = true // process.env.NODE_ENV == "production"
const currentDay = parseInt(dayjs().format("D"))
const subtract   = currentDay < 9 ? 1 : 0
const lastMonthStartDate  = dayjs().subtract(1, 'month').startOf('month').format("M/D/YYYY")
const lastMonthEndDate    = dayjs().subtract(1, 'month').endOf('month').format("M/D/YYYY")
const thisMonthStartDate  = dayjs().startOf('month').format("M/D/YYYY")
const thisMonthEndDate    = dayjs().endOf('month').format("M/D/YYYY")
let accountNames          = {}
async function runMultiAccounts(sheetKeys, doc, dashboardSheet, dashboardCells, statusCell) {
  console.log("getting qualification data")
  const browser = await puppeteer.launch({headless, args: ['--no-sandbox']});
  var page  = await browser.newPage();
  const client = await page.target().createCDPSession()
  await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.resolve(downloadPath) });
  page.setExtraHTTPHeaders(headers);
  let dashboardCellSet  = new Set(dashboardCells.map(JSON.stringify));
  dashboardCells = Array.from(dashboardCellSet).map(JSON.parse);
  console.log(dashboardCells)
  for (var i = 0; i < dashboardCells.length; i++) {
    fs.readdir(downloadPath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(downloadPath, file), err => {
          if (err) throw err;
        });
      }
    });
    var accountName  = dashboardCells[i][0];
    var login        = dashboardCells[i][1];
    var password     = dashboardCells[i][2];

    // FIX #3: Add debug logging
    console.log(`\n=== Processing account: ${accountName} ===`);
    console.log(`Login: ${login}`);

    statusCell.value = accountName+" .."
    await dashboardSheet.saveUpdatedCells();
    console.log(login)
    console.log(password)
    await page.goto("https://extranet.securefreedom.com/Youngevity/Login.aspx", params);
    await page.evaluate((login, password) => {
      document.querySelector("input#ctl00_BodyContentPlaceHolder_UserTextBox").value = login
      document.querySelector("input#ctl00_BodyContentPlaceHolder_PasswordTextBox").value = password
    }, login, password)
    await delay(2000);
    await Promise.all([page.click("input#ctl00_BodyContentPlaceHolder_LoginButton", params), page.waitForNavigation({waitUntil:'networkidle2'})])

    // FIX #3: Add debug logging after login
    console.log("DEBUG: Login completed, current URL:", page.url());

    // FIX #3: Add debug logging before goto
    console.log("DEBUG: Navigating to genealogy page...");
    await page.goto('https://extranet.securefreedom.com/Youngevity/Personal/Genealogy/cs_AdvGenealogyReport3.aspx', params);

    // FIX #3: Add debug logging after goto
    console.log("DEBUG: Arrived at genealogy page, URL:", page.url());

    // FIX #2: Properly formatted selector timeout with debug code
    var validCredentials = false;
    try {
      console.log("DEBUG: Attempting to find selector...");
      console.log("DEBUG: Current URL:", page.url());
      await page.screenshot({path: `/app/debug_${accountName}.png`});

      await page.waitForSelector('input#ctl00_ctl00_BodyContentPlaceHolder_MainContentPlaceHolder_txtLevelsToDisplay', {
        visible: true,
        timeout: 70000
      });

      validCredentials = true;
      console.log("DEBUG: Selector found successfully!");

    } catch(err) {
      console.log("DEBUG: Selector NOT found");
      console.log("DEBUG: Error:", err.message);
      console.log("DEBUG: Current URL:", page.url());

      // Save debug files
      const html = await page.content();
      import('fs').then(fs => {
      fs.writeFileSync(`/app/debug_${accountName}_page.html`, html);
        fs.writeFileSync(`/app/debug_${accountName}_page.html`, html);
      });
      await page.screenshot({path: `/app/debug_${accountName}_failure.png`});

      validCredentials = false;
    }

    await delay(4000);

    // FIX #3: Add debug logging when checking valid credentials
    console.log(`DEBUG: Valid credentials check: ${validCredentials}`);

    if(validCredentials == false) {
      statusCell.value = `Invalid credentials for ${accountName}`
      await dashboardSheet.saveUpdatedCells();
      console.log('Skipping to next account...');
      continue;
    }
    if(validCredentials == true){
      console.log("valid credentials")
      await page.evaluate(() => { document.querySelector('input#ctl00_ctl00_BodyContentPlaceHolder_MainContentPlaceHolder_txtLevelsToDisplay').value = '3'; });
      await delay(3000);
      await Promise.all([page.click("input#ctl00_ctl00_BodyContentPlaceHolder_MainContentPlaceHolder_btnGo", params), page.waitForNavigation({waitUntil:'networkidle2', timeout: 0})])
      await delay(2000);
      var gotData = true
      var cleanedResults = []
      for (var j = 2; j < 40; j++) {
        cleanedResults.push(['', ''])
      }
      cleanedResults.push(["Level", "ID#||Name||Title||QV"])
      try{
        await page.waitForSelector('span.Grid_Caption_Title').then(() => validCredentials = true );
        console.log('found Selector span.Grid_Caption_Title')
        await delay(1000);
        var response = await page.evaluate(x => {
          WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00$ctl00$BodyContentPlaceHolder$MainContentPlaceHolder$GridTitleBar$gridMenu", "ctl00$ctl00$BodyContentPlaceHolder$MainContentPlaceHolder$GridTitleBar$gridMenu$m0$m1", true, "", "", false, true))
        }, 7);
        console.log('Downloading...');
        var fileName = null
        while (fileName == null) {
          fs.readdir(downloadPath, (err, files) => {
            var csvFile = files.filter(f=>f.endsWith('.csv'))
            if(csvFile[0]) fileName = files[0]
          })
          await delay(2000);
          console.log('Still Downloading...');
        }
        console.log('Finished Downloading');
      }catch(e){
        console.log(e)
        gotData = false
        console.log("no data found")
      }
      if(gotData){
        var validLevels = ['0', '0.1', '.1', '..2']

        // Sanitize account name for sheet title (remove spaces and special chars)
        var sanitizedAccountName = accountName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

        console.log(`DEBUG: Processing account: ${accountName} -> ${sanitizedAccountName}`);

        fs.createReadStream(downloadPath+'/'+fileName).pipe(csv()).on('data', (row) => {
          if(validLevels.includes(row.Level.trim())) cleanedResults.push([row.Level, row["ID#"]+"||"+row.Name+"||"+row.Title+"||"+row.QV.trim()])
        }).on('end', async () => {
          try {
            // Try to find existing sheet (check both sanitized and original names)
            var targetSheet = doc.sheetsByTitle[sanitizedAccountName] || doc.sheetsByTitle[accountName];

            if (targetSheet) {
              console.log(`DEBUG: Found existing sheet: ${targetSheet.title}`);

              // Clear existing data (keep headers)
              await targetSheet.clear();
              await delay(1000);

              // Add headers back
              await targetSheet.setHeaderRow(['A', 'B']);
              await delay(1000);

            } else {
              console.log(`DEBUG: Creating new sheet: ${sanitizedAccountName}`);

              // Create new sheet with sanitized name
              targetSheet = await doc.addSheet({
                title: sanitizedAccountName,
                headerValues: ['A', 'B']
              });
              await delay(3000);
            }

            // Add data to sheet
            console.log(`DEBUG: Adding ${cleanedResults.length} rows to sheet`);
            await targetSheet.addRows(cleanedResults, {raw: true, insert: true});
            console.log(`DEBUG: Successfully updated sheet: ${targetSheet.title}`);

          } catch(err) {
            console.log(`ERROR: Failed to update sheet for ${accountName}:`, err.message);
          }
        })
      }
    }
    await delay(3000);
    await page.goto('https://tools.securefreedom.com/Youngevity/Account/LogOff', params);
    await delay(2000);
  }
  statusCell.value = "Last run: " + dayjs().format('LLL')
  statusCell.save()
  await axios(sheetKeys.sheetPublishLink)
  console.log("all Finished")
  /*
  request(sheetKeys.sheetPublishLink, function (error, response, body) {
    console.log("all Finished")
  })
  */
}
runQualificationScript(SHEET_KEY.jon)

/*
1 - Go under jons account and do a search like in the picture Picture : Desktop/Screenshot from 2019-10-22 18-38-02.png
2 - for each ID in : https://docs.google.com/spreadsheets/d/1eaCEJizkWOrkBJvuECEUFtvDu8SqcVBOCJqH2NHa_WI/edit#gid=2038276417
    Do a search and pick latest order id, then put in Order # column
    https://extranet.securefreedom.com/Youngevity/Personal/Downline/DownlineLeft.aspx?GenealogyTypeID=0&DownlineRepID=101315805
*/
