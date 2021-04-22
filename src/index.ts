import { spawn } from "child_process";
import { writeFile } from "fs";
import { ChildProcess } from "node:child_process";
import { dirname } from "node:path";
import * as os from "os";
import * as chalk from "chalk";

const log = console.log;

// firebase login --no-localhost

const isWindows: boolean = os.platform() == "win32";

const npmCmd: string = isWindows ? "npm.cmd" : "npm";
const firebaseCmd: string = isWindows ? "firebase.cmd" : "firebase";

const getFirebaseCLIToken = () => {
  let stringData: string = "";

  const firebaseCLIProcess: ChildProcess = spawn(
    firebaseCmd,
    ["login:ci", "--interactive"],
    {
      cwd: __dirname,
      shell: true,
    }
  );

  firebaseCLIProcess.stdout?.on("data", (chunk) => {
    console.log(chunk.toString());

    stringData = stringData + chunk.toString();
  });

  firebaseCLIProcess.on("exit", (code) => {
    log(`${chalk.bgHex("#00ff81").white("EXIT CODE")}: ${code}`);

    if (code == 0) {
      let firebaseCLIToken: string = stringData
        .split("Use this token to login on a CI server:")[1]
        .split("\n")[2];

      log(chalk.bgWhite.black(firebaseCLIToken));
    }
  });
};

getFirebaseCLIToken();
