import { db } from "..";
import { feedFollows, users, feeds } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({ userId, feedId })
        .returning();

    const [result] = await db
        .select({
            feedFollow: feedFollows,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .where(eq(feedFollows.id, newFeedFollow.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));

    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db
        .select({
            feedFollow: feedFollows,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .where(eq(feedFollows.userId, userId))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));

    return result;
}
