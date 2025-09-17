import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const userName = readConfig().currentUserName;
    const user = await getUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    const feedName = args[0];
    const feedURL = args[1];

    const feed = await createFeed(feedName, feedURL, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

export async function handlerPrintFeeds(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }

    const feeds = await getFeeds();

    for (let feed of feeds) {
        console.log(`* name:          ${feed.name}`);
        console.log(`* URL:           ${feed.url}`);
        console.log(`* User:          ${feed.userName}`);
    }
}
