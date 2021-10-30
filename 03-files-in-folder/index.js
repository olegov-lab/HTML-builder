const fs = require("fs");
const { stat } = fs;
const path = require("path");

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  (err, files) => {
    console.log("\nФайлы папки Secret-folder:\n");

    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(
            path.join(__dirname, "secret-folder", file.name),
            (err, stats) => {
              const nameFile = path.parse(file.name).name;
              const extFile = path.extname(file.name).slice(1);
              const sizeFile = stats.size * 0.001;

              console.log(`${nameFile} - ${extFile} - ${sizeFile}kb`);
            }
          );
        }
      });
    }
  }
);
