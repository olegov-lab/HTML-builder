const fs = require("fs");
const path = require("path");

const output = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name).slice(1) === "css") {
          fs.readFile(
            path.join(__dirname, "styles", file.name),
            "utf8",
            function (error, data) {
              console.log("Асинхронное чтение файла");
              if (error) throw error; // если возникла ошибка

              let dataString = data.toString();

              output.write(dataString);
            }
          );
        }
      });
    }
  }
);
