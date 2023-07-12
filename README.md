# public-mastodon-data.js
Simple JS functions for interacting with the public (i.e. no Auth) Mastodon data APIs. No API key is needed to use these functions - just import the module, and call the functions like this:

```js
import * as m from "https://cdn.jsdelivr.net/gh/josephrocca/public-mastodon-data.js@0.0.1/mod.js";

// see mod.js for all available parameters

await m.getPostsByUser({userHandle:"arstechnica@mastodon.social", maxItems:100});
await m.getFollowersOfUser({userHandle:"arstechnica@mastodon.social", maxItems:100}); // users that follow this user
await m.getFolloweesOfUser({userHandle:"arstechnica@mastodon.social", maxItems:100); // users that this user follows
await m.getTimelinePosts({instanceDomain:"mastodon.social", maxItems:100});
await m.getTimelinePostsByTag({instanceDomain:"mastodon.social", tag:"cat", maxItems:100});
await m.getUsersWhoFavoritedPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"});
await m.getUsersWhoBoostedPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"});
await m.getParentsAndChildrenOfPost({instanceDomain:"mastodon.social", statusId:"110697449558194709"});
await m.getPost({instanceDomain:"mastodon.social", statusId:"110697430691266528"});
await m.getUsersKnownToInstance({instanceDomain:"mastodon.social", maxItems:10});
```

Note: `userHandle` can be of the form `arstechnica@mastodon.social` or `@arstechnica@mastodon.social`.
