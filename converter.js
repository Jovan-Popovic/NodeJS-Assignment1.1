const path = require("path");
const fs = require("fs");

const libre = require("libreoffice-convert");

const fileConverter = (name, counter) => {
  const ext = ".pdf";
  const enterPath = path.join(__dirname, `/uploads/${name}`);
  const outputPath = path.join(
    __dirname,
    `/downloads/${name.split(".")[0] + ext}`
  );

  const file = fs.readFileSync(enterPath);
  libre.convert(file, ext, undefined, (err, done) => {
    if (err) console.log(`Error converting file: ${err}`);
    fs.writeFileSync(outputPath, done);
    counter++;
  });
};

module.exports = fileConverter;
