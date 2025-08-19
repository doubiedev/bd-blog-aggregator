import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function handlerAggregate() {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed, null, 2));
}

async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const res = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
        },
    });

    const data = await res.text();
    const parser = new XMLParser();
    const feed = parser.parse(data);

    if (!feed.rss?.channel) {
        throw new Error("Invalid RSS feed: missing channel");
    }
    if (!feed.rss?.channel.title) {
        throw new Error("Invalid RSS feed: missing title");
    } else if (typeof feed.rss.channel.title !== "string") {
        throw new Error("Invalid RSS feed: title must be a string");
    }
    if (!feed.rss?.channel.link) {
        throw new Error("Invalid RSS feed: missing link");
    } else if (typeof feed.rss.channel.link !== "string") {
        throw new Error("Invalid RSS feed: link must be a string");
    }
    if (!feed.rss?.channel.description) {
        throw new Error("Invalid RSS feed: missing description");
    } else if (typeof feed.rss.channel.description !== "string") {
        throw new Error("Invalid RSS feed: description must be a string");
    }

    let channelItems = feed.rss.channel.item;
    if (!channelItems) {
        channelItems = [];
    } else if (!Array.isArray(channelItems)) {
        channelItems = [channelItems];
    }

    const items: RSSItem[] = [];
    for (let item of channelItems) {
        if (
            !item.title ||
            !item.link ||
            !item.description ||
            !item.pubDate ||
            typeof item.title !== "string" ||
            typeof item.link !== "string" ||
            typeof item.description !== "string" ||
            typeof item.pubDate !== "string"
        ) {
            continue;
        }

        const newItem: RSSItem = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        };

        items.push(newItem);
    }

    const out: RSSFeed = {
        channel: {
            title: feed.rss.channel.title,
            link: feed.rss.channel.link,
            description: feed.rss.channel.description,
            item: items,
        },
    };

    return out;
}
