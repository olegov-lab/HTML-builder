let fs = require("fs");
let { COPYFILE_EXCL } = fs.constants;
const path = require("path");

const filePlace = path.join(__dirname, "files");
const fileCopy = path.join(__dirname, "files-copy");

fs.promises
  .rm(fileCopy, { recursive: true, force: true })
  .then(
    () => {
      return fs.promises.mkdir(fileCopy, { recursive: true });
    },

    (error) => {
      if (error) console.error(error.message);
    }
  )
  .then(
    () => {
      return fs.readdir(filePlace, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            fs.copyFile(
              path.join(filePlace, file.name),
              path.join(fileCopy, file.name),
              // COPYFILE_EXCL,
              (err) => {
                if (err) throw err; // не удалось скопировать файл. Он уже существует?
                console.log("Файл успешно скопирован");
              }
            );
          });
        }
      });
    },

    (error) => {
      if (error) console.error(error.message);
    }
  );

// fs.mkdir(fileCopy, { recursive: true }, (err) => {
//   if (err) throw err;
// });
