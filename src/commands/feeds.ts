import { createFeed, getFeedByURL, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feedsUsers";
import { getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { getLoggedInUser } from "./users";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const user = await getLoggedInUser();

    const feedName = args[0];
    const feedURL = args[1];

    const feed = await createFeed(feedName, feedURL, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    if (!feedFollow) {
        throw new Error(`Failed to create feedFollow`);
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

export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    console.log(`Found ${feeds.length} feeds:\n`);
    for (let feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed: ${feed.id}`);
        }

        printFeed(feed, user);
        console.log(`=====================================`);
    }
}

export async function handlerFollowFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedByURL(url);
    const user = await getLoggedInUser();

    const feedFollow = await createFeedFollow(user.id, feed.id);
    if (!feedFollow) {
        throw new Error(`Failed to follow feed`);
    }

    console.log(
        `Feed ${feedFollow.feedName} followed successfully by ${feedFollow.userName}`,
    );
}
