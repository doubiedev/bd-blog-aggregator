import { getFeedFollowsForUser } from "src/lib/db/queries/feedsUsers";
import { readConfig, setUser } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(existingUser.name);
    console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(user.name);
    console.log("User created successfully!");
}

export async function handlerListUsers(_: string) {
    const users = await getUsers();
    const config = readConfig();

    for (let user of users) {
        if (user.name === config.currentUserName) {
            console.log(`* ${user.name} (current)`);
            continue;
        }
        console.log(`* ${user.name}`);
    }
}

export async function getLoggedInUser() {
    const userName = readConfig().currentUserName;
    const user = await getUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }
    return user;
}

export async function handlerListFollowedFeeds(_: string) {
    const user = await getLoggedInUser();
    const feedFollows = await getFeedFollowsForUser(user.id);

    console.log(`${user.name} is currently following:`);
    for (let feedFollow of feedFollows) {
        console.log(`* ${feedFollow.feedName}`);
    }
}
