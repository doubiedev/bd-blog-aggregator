import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { getFeed, getFeeds, createFeed } from "src/lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed-name> <feed-url>`);
    }

    const userName = readConfig().currentUserName;
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }
    const userId = existingUser.id;

    const feedName = args[0];
    const feedURL = args[1];

    const feed = await createFeed(feedName, feedURL, userId);
    console.log("Feed created successfully!");
    await printFeed(feed, existingUser);
}

async function printFeed(feed: Feed, user: User) {
    console.log(
        `Feed:
id - ${feed.id}
createdAt - ${feed.createdAt}
updatedAt - ${feed.updatedAt}
name - ${feed.name}
url - ${feed.url}
userId - ${feed.userId}
`,
    );
    console.log(
        `User:
id - ${user.id}
createdAt - ${user.createdAt}
updatedAt - ${user.updatedAt}
name - ${user.name}
`,
    );
}
