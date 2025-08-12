import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Nick");
    const cfg = readConfig();
    console.log(cfg);
}

main();
