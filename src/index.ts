import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Nick");
    console.log(readConfig());
}

main();
