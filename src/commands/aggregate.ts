import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed, RSSFeed } from "../lib/rss";
import { Feed } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    // const feedURL = "https://www.wagslane.dev/index.xml";
    //
    // const feedData = await fetchFeed(feedURL);
    // const feedDataStr = JSON.stringify(feedData, null, 2);
    // console.log(feedDataStr);

    if (!args[0]) {
        throw new Error(`usage: ${cmdName} <duration><unit (ms, s, m, h)>`);
    }
    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);

    await scrapeFeeds();

    const interval = setInterval(() => {
        scrapeFeeds().catch(console.error);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(
            `invalid time_between_reqs format, use: <duration><unit (ms, s, m, h)>`,
        );
    }
    const amount = Number(match[1]);
    const unit = match[2]; // "ms" | "s" | "m" | "h"
    switch (unit) {
        case "ms":
            return amount;
        case "s":
            return amount * 1000;
        case "m":
            return amount * 1000 * 60;
        case "h":
            return amount * 1000 * 60 * 60;
        default:
            throw new Error("unsupported time unit");
    }
}

async function scrapeFeeds() {
    const nextFeed: Feed | undefined = await getNextFeedToFetch();
    if (!nextFeed) {
        console.log("No feeds found to fetch");
        return;
    }
    await markFeedFetched(nextFeed.id);

    try {
        const feed: RSSFeed = await fetchFeed(nextFeed.url);
        for (let i = 0; i < feed.channel.item.length; i++) {
            console.log(feed.channel.item[i].title);
        }
    } catch (err) {
        console.error(err);
    }
}
