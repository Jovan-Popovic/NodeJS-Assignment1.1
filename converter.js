const path = require("path");
const fs = require("fs");

const libre = require("libreoffice-convert");

const fileConverter = (name, filename, counter) => {
  const ext = ".pdf";
  const enterPath = path.join(__dirname, `/public/uploads/${name}`);
  const outputPath = path.join(
    __dirname,
    `/public/downloads/${filename + ext}`
  );

  const file = fs.readFileSync(enterPath);
  libre.convert(file, ext, undefined, (err, done) => {
    if (err) console.log(`Error converting file: ${err}`);
    fs.writeFileSync(outputPath, done);
    counter++;
  });
};

module.exports = fileConverter;
