const fs = require("fs");

const express = require("express");
const upload = require("express-fileupload");
const hbs = require("hbs");

const fileConverter = require("./converter");
const sendEmail = require("./send-email");

const app = express();
const PORT = process.env.PORT || 3000;

//Converted file counter
let counter = fs.readdir(
  "./public/downloads",
  (err, files) => (counter = files.length - 1)
);

// This class is used for creating istances of options for hbs components
class hbsOptions {
  constructor(
    counter,
    title,
    heading,
    paragraph,
    sectionText,
    show,
    downloadPath
  ) {
    this.counter = counter;
    this.title = title;
    this.heading = heading;
    this.paragraph = paragraph;
    this.sectionText = sectionText;
    this.show = show || false;
    this.downloadPath = downloadPath || "";
  }
}

app.use(upload());
app.use(express.static("public"));

hbs.registerPartials(__dirname + "/views/partials");

//Set root(home) route
app.get("/", (req, res) => {
  const options = new hbsOptions(
    counter,
    "conversion",
    "Easy way to convert your files",
    "Using our WordToPdf Converter you will be able to easily and for free convert any of your .docx to .pdf file at any time.",
    ["What to do? It's easy!", "Just select word file to convert"]
  );
  res.render("home.hbs", options);
});

//Set upload route
app.post("/upload", (req, res) => {
  if (req.files) {
    const file = req.files.wordfile;
    const name = file.name;
    const filename = name
      .split(".")
      .slice(0, name.split(".").length - 1)
      .join("."); //In case if filename have dots, this will always return filename propertly
    const ext = `.${name.split(".").pop()}`;
    const uploadpath = `${__dirname}/public/uploads/${name}`;
    if (ext === ".doc" || ext === ".docx")
      file.mv(uploadpath, (err) => {
        const values = err
          ? [
              counter,
              "error",
              "Something went wrong",
              "Fatal error happened while file conversion. We are terribly sorry, we will fix this issue very soon.",
              [],
              false,
            ]
          : [
              counter,
              "success",
              "You did it, excellent work!",
              "Conversion was successfull, your word file is now converted to new pdf file, the only thing left is to download it.",
              ["The rest is simple!", "Press the download button and done"],
              true,
              "downloads/" + filename + ".pdf",
            ];
        const options = new hbsOptions(...values);
        res.render("upload.hbs", options);
        if (err) console.log("File Upload Failed", name, err);
        else {
          console.log("File Uploaded: ", name);
          fileConverter(filename, ext, counter);
        }
      });
    else {
      const options = new hbsOptions(
        counter,
        "be carefull",
        "Wrong file type selected!",
        "File that you want to convert needs to have an extension of .doc or .docx in order for this to work, return to home page (by pressing app logo) and try again.",
        [],
        false
      );
      res.render("upload.hbs", options);
    }

    app.post("/send", (req, res) => {
      const options = new hbsOptions(
        counter,
        "thank you",
        "We really appreciate this!",
        "File is successfully send to your gmail account. We really appretiate this and we are hoping that you liked our services. To convert new file, press the app logo and repeat the process."
      );
      res.render("send.hbs", options);
      /*       sendEmail(req.body.email, filename);
       */ console.log(req.body.email);
    });
  } else {
    const options = new hbsOptions(
      counter,
      "be carefull",
      "No file selected!",
      "In order for this to work, you need to upload word file to get converted pdf file. Press app logo to go back to home page.",
      [],
      false
    );
    res.render("upload.hbs", options);
  }
});

//Starting server
app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));
