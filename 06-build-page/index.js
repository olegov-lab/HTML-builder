const fs = require("fs");
const path = require("path");

let header, articles, footer, dataString;

const filePlace = path.join(__dirname, "assets");
const fileCopy = path.join(__dirname, "project-dist", "assets");

fs.mkdir(fileCopy, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir(path.join(__dirname, "project-dist"), (err) => {
  if (err) console.log(`Папка "Project-dist" уже создана!`);
  console.log(`Папка "Project-dist" успешно создана`);
  copyDir(filePlace, fileCopy);
});

const output = fs.createWriteStream(
  path.join(__dirname, "project-dist", "style.css")
);

//! Получение шаблона
fs.readFile(
  path.join(__dirname, "template.html"),
  "utf8",
  function (error, data) {
    //console.log("Асинхронное чтение файла");
    if (error) throw error; // если возникла ошибка

    dataString = data;
    //console.log(data.match("{{header}}"));

    // dataString = data
    //   .replace("{{header}}", header)
    //   .replace("{{articles}}", articles);

    //console.log(dataString);
  }
);

//! Получение html
fs.readdir(
  path.join(__dirname, "components"),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name).slice(1) === "html") {
          fs.readFile(
            path.join(__dirname, "components", file.name),
            "utf8",
            function (error, data) {
              //console.log(path.parse(file.name).name);
              let parseFile = path.parse(file.name).name;
              const regexp = new RegExp(`{{${parseFile}}}`, "g");
              //console.log("Асинхронное чтение файла");
              if (error) throw error;

              let dataStringBase = data.toString();

              dataString = dataString.replace(regexp, dataStringBase);

              //output.write(dataString);

              fs.writeFile(
                path.join(__dirname, "project-dist", "index.html"),
                dataString,
                (err) => {
                  err ? console.log(err) : null;
                }
              );
            }
          );
        }
      });
    }
  }
);

//! Получение стилей
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
              console.log(`Асинхронное чтение файла ${file.name}`);
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

//! Копирование папки assets
function copyFiles(src, copy) {
  fs.readdir(src, (err, files) => {
    err ? console.log(err) : null;

    for (const file of files) {
      const filePath = path.join(src, file);

      fs.stat(filePath, (err, stats) => {
        err ? console.log(err) : null;

        if (stats.isFile()) {
          fs.copyFile(path.join(src, file), path.join(copy, file), (err) => {
            console.log(
              `Файл: ${file} был скопирован в ${path.join(copy, file)}`
            );
          });
        } else {
          fs.mkdir(path.join(copy, file), { recursive: true }, (err) => {
            err ? console.log(err) : null;
            copyFiles(path.join(src, file), path.join(copy, file));
          });
        }
      });
    }
  });
}

function copyDir(src, copy) {
  fs.access(copy, (err) => {
    if (err) {
      fs.mkdir(copy, { recursive: true }, () => {
        copyFiles(src, copy);
      });
    } else {
      fs.rm(copy, { recursive: true }, (err) => {
        err ? console.log(err) : null;
        fs.mkdir(copy, { recursive: true }, () => {
          copyFiles(src, copy);
        });
      });
    }
  });
}
