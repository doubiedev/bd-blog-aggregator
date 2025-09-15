import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db
        .insert(feeds)
        .values({ name: name, url: url, userId: userId })
        .returning();
    return result;
}

export async function getFeed(name: string) {
    const result = await db.select().from(feeds).where(eq(feeds.name, name));
    return firstOrUndefined(result);
}

export async function deleteFeeds() {
    await db.delete(feeds);
}

export async function getFeeds() {
    return await db.select().from(feeds);
}
