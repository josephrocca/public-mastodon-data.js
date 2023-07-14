# public-mastodon-data.js
Simple JS functions for interacting with the public Mastodon data APIs. No API key is needed to use these functions - just import the module, and call the functions like this:

```js
import * as m from "https://cdn.jsdelivr.net/gh/josephrocca/public-mastodon-data.js@0.0.4/mod.js";

// see mod.js for all available parameters

await m.getPostsByUser({userHandle:"arstechnica@mastodon.social"});
await m.getFollowersOfUser({userHandle:"arstechnica@mastodon.social"}); // users that follow this user
await m.getFolloweesOfUser({userHandle:"arstechnica@mastodon.social"); // users that this user follows
await m.getTimelinePosts({instanceDomain:"mastodon.social"});
await m.getTimelinePostsByTag({instanceDomain:"mastodon.social", tag:"cat"});
await m.getUsersWhoFavoritedPost({instanceDomain:"mastodon.social", postId:"110697430691266528"});
await m.getUsersWhoBoostedPost({instanceDomain:"mastodon.social", postId:"110697430691266528"});
await m.getParentsAndChildrenOfPost({instanceDomain:"mastodon.social", postId:"110697449558194709"});
await m.getPost({instanceDomain:"mastodon.social", postId:"110697430691266528"});
await m.getUsersKnownToInstance({instanceDomain:"mastodon.social"});
```

**Note:**
  * `userHandle` can be of the form `arstechnica@mastodon.social` or `@arstechnica@mastodon.social`
  * all functions return a maximum 200 items by default, and you can increase that with the `maxItems` parameter

## Demos:

 * See a breakdown of your followers by Mastodon instance/server: https://josephrocca.github.io/public-mastodon-data.js/demos/followers-by-instance.html




https://github.com/josephrocca/public-mastodon-data.js/assets/1167575/fbe35a6a-c41b-4ff5-a2a8-ee8c29de0a85



