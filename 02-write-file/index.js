const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, "text.txt"));

stdout.write("Введите текст\n");

stdin.on("data", (data) => {
  const name = data.toString().trim();

  if (name !== "exit") {
    fs.appendFile(path.join(__dirname, "text.txt"), data, (err) => {
      if (err) throw err;
      console.log("Файл был изменен");
    });
  } else if (name == "exit") {
    process.exit();
  }
});

process.on("exit", () => stdout.write("Удачи!"));
process.on("SIGINT", () => {
  process.exit();
});
