import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(
    feedName: string,
    url: string,
    userId: string,
) {
    const result = await db
        .insert(feeds)
        .values({ name: feedName, url, userId })
        .returning();
    return firstOrUndefined(result);
}

export type FeedWithUser = { name: string; url: string; userName: string };
export async function getFeeds(): Promise<FeedWithUser[]> {
    return await db
        .select({
            name: feeds.name,
            url: feeds.url,
            userName: users.name,
        })
        .from(feeds)
        .innerJoin(users, eq(feeds.userId, users.id));
}
