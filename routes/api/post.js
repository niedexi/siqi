const express = require("express");
const router = express.Router();

const { google } = require("googleapis");
const drive = google.drive("v3");
const sheets = google.sheets("v4");
const key = require("../../key.json");

//Google authentication
const cred = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
  null
);

//Get current Date
function getDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

// @route   POST /upload
// @desc    Upload data to google sheets
router.post("/", async (req, res) => {
  const fileName = req.body.name;
  const values = req.body.data;
  const category = req.body.category;
  const folder = req.body.folderID;

  try {
    await cred.authorize();

    //Create new sheet file
    const file = await drive.files.create({
      auth: cred,
      resource: {
        parents: [folder],
        name: category + "_" + fileName + "_" + getDate(),
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    });
    console.log(file.data.id);

    //Change file permission
    const permission = await drive.permissions.create({
      auth: cred,
      resource: {
        role: "owner",
        type: "user",
        emailAddress: "siqiproject@gmail.com",
      },
      fileId: file.data.id,
      fields: "id",
      transferOwnership: "true",
    });
    console.log(permission.status);

    //Insert data to spreadsheet
    const data = await sheets.spreadsheets.values.update({
      auth: cred,
      spreadsheetId: file.data.id,
      range: "A1",
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });
    console.log(data.status);
    res.status(200).send("Success");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
