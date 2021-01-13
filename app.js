const fs = require("fs");

const express = require("express");
const upload = require("express-fileupload");
const hbs = require("hbs");
const fileConverter = require("./converter");

const app = express();
const port = 3000;

//Converted file counter
let counter = fs.readdir(
  "./downloads",
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
    forDownload
  ) {
    this.counter = counter;
    this.title = title;
    this.heading = heading;
    this.paragraph = paragraph;
    this.sectionText = sectionText;
    forDownload;
    this.show = show || false;
    this.forDownload = forDownload || false;
  }
}

app.use(upload());
app.use(express.static("./public"));

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
  console.log(req.files || "Lol nope");

  if (req.files) {
    const file = req.files.wordfile;
    const name = file.name;
    const type = file.mimetype;
    console.log(type);
    const uploadpath = __dirname + "/uploads/" + name;
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword"
    )
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
              "Conversion was successfull, you can now download you converted pdf file by pressing Download button down bellow.",
              ["The rest is simple!", "Press the download button and done"],
              true,
              true,
            ];
        const options = new hbsOptions(...values);
        res.render("upload.hbs", options);
        if (err) console.log("File Upload Failed", name, err);
        else {
          console.log("File Uploaded: ", name);
          fileConverter(name, counter);
          hbs.registerHelper(
            "download",
            () =>
              res.download(
                __dirname + "/downloads/" + name.split(".")[0] + ".pdf"
              ),
            (err) => console.log(err)
          );
        }
      });
    else {
      const options = new hbsOptions(
        counter,
        "be carefull",
        "Wrong file type selected!",
        "File that you want to convert needs to have an extension of .doc or .docx in order for this to work, return to home page (by pressing app icon) and try again.",
        [],
        false
      );
      res.render("upload.hbs", options);
    }
  } else {
    const options = new hbsOptions(
      counter,
      "be carefull",
      "No file selected!",
      "In order for this to work, you need to upload word file to get converted pdf file. Press app icon to go back to home page",
      [],
      false
    );
    res.render("upload.hbs", options);
  }
});

//Starting server
app.listen(port, () => console.log(`Server is running on the port ${port}`));
