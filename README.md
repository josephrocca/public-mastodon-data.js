# public-mastodon-data.js
Simple JS functions for interacting with the public (i.e. no Auth) Mastodon data APIs

## Usage:
```js
import { getPostsByUser, getFollowersOfUser, getFolloweesOfUser, getTimelinePosts, getTimelinePostsByTag, getUsersWhoFavoritedPost, getUsersWhoBoostedPost, getParentsAndChildrenOfPost, getPost, getUsersKnownToInstance } from "./mod.js";
await getPostsByUser({userHandle:"arstechnica@mastodon.social", maxItems:100})
await getFollowersOfUser({userHandle:"arstechnica@mastodon.social", maxItems:100})
await getFolloweesOfUser({userHandle:"arstechnica@mastodon.social", maxItems:100)
await getTimelinePosts({instanceDomain:"mastodon.social", maxItems:100})
await getTimelinePostsByTag({instanceDomain:"mastodon.social", tag:"cat", maxItems:100})
await getUsersWhoFavoritedPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"})
await getUsersWhoBoostedPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"})
await getParentsAndChildrenOfPost({instanceDomain:"mastodon.social", statusId:"110697449558194709"})
await getPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"})
await getUsersKnownToInstance({instanceDomain:"mastodon.social", maxItems:10})
```
