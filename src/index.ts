import { setUser, readConfig } from "./config.js";
import { createUser, getUser } from "./lib/db/queries/users.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
type CommandsRegistry = Record<string, CommandHandler>;

async function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);

    let args = process.argv.slice(2);
    if (args.length <= 0) {
        console.log("expected at least one argument");
        process.exit(1);
    }

    const cmdName = args[0];
    args = args.slice(1);
    await runCommand(registry, cmdName, ...args);

    process.exit(0);
}

main();

function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) {
    registry[cmdName] = handler;
}

async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) {
    const handler = registry[cmdName];
    if (!handler) {
        console.log(`Unknown command: ${cmdName}`);
        process.exit(1);
    }
    await handler(cmdName, ...args);
}

async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length <= 0) {
        console.log("expected at least one argument (username)");
        process.exit(1);
    }

    const username = args[0];
    const user = await getUser(username);
    if (!user) {
        throw new Error("user doesn't exist");
    }

    setUser(username);
    console.log(`user ${username} has been set`);
}

async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length <= 0) {
        console.log("expected at least one argument (username)");
        process.exit(1);
    }

    const username = args[0];
    const user = await getUser(username);
    if (user !== undefined) {
        throw new Error("user already exists");
    }

    try {
        await createUser(username);
        console.log(`user ${username} successfully created`);
        console.log(await getUser(username));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    console.log("setting user here");
    setUser(username);
    console.log(readConfig());
    process.exit(0);
}
