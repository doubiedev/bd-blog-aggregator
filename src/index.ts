import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Nick");

    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    let args = process.argv.slice(2);
    if (args.length <= 0) {
        console.log("expected at least one argument");
        process.exit(1);
    }

    const cmdName = args[0];
    args = args.slice(1);
    runCommand(registry, cmdName, ...args);
}

main();

type CommandHandler = (cmdName: string, ...args: string[]) => void;
type CommandsRegistry = Record<string, CommandHandler>;

function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length <= 0) {
        console.log("expected at least one argument (username)");
        process.exit(1);
    }

    setUser(args[0]);
    console.log(`user ${args[0]} has been set`);
}

function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) {
    registry[cmdName] = handler;
}

function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) {
    const handler = registry[cmdName];
    if (!handler) {
        console.log(`Unknown command: ${cmdName}`);
        process.exit(1);
    }
    handler(cmdName, ...args);
}
