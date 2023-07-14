export async function getPostsByUser({userHandle, excludeReplies=null, excludeBoosts=null, isTaggedWith=null, isPinned=null, onlyPostsWithMedia=null, maxItems=200, progressCallback=null}={}) {
  let userId = await userHandleToId({userHandle});
  
  if(userHandle.startsWith("@")) userHandle = userHandle.slice(1);
  let instanceDomain = userHandle.split("@")[1];

  let url = `https://${instanceDomain}/api/v1/accounts/${userId}/statuses?limit=80`;
  if(isTaggedWith !== null) url += `&tagged=${isTaggedWith}`;
  if(excludeReplies !== null) url += `&exclude_replies=${excludeReplies}`;
  if(excludeBoosts !== null) url += `&exclude_reblogs=${excludeBoosts}`;
  if(isPinned !== null) url += `&pinned=${isPinned}`;
  if(onlyPostsWithMedia !== null) url += `&only_media=${onlyPostsWithMedia}`;

  return _getPaginatedItems({url, maxItems, progressCallback});
}

export async function getFollowersOfUser({userHandle, maxItems=200, progressCallback=null}={}) {
  let userId = await userHandleToId({userHandle});
  
  if(userHandle.startsWith("@")) userHandle = userHandle.slice(1);
  let instanceDomain = userHandle.split("@")[1];
  
  let url = `https://${instanceDomain}/api/v1/accounts/${userId}/followers?limit=80`;
  return _getPaginatedItems({url, maxItems, progressCallback});
}

export async function getFolloweesOfUser({userHandle, maxItems=200, progressCallback=null}={}) {
  let userId = await userHandleToId({userHandle});

  if(userHandle.startsWith("@")) userHandle = userHandle.slice(1);
  let instanceDomain = userHandle.split("@")[1];
  
  let url = `https://${instanceDomain}/api/v1/accounts/${userId}/following?limit=80`;
  return _getPaginatedItems({url, maxItems, progressCallback});
}

export async function getTimelinePosts({instanceDomain, onlyLocalPosts=null, onlyRemotePosts=null, onlyPostsWithMedia=null, maxItems=200, startFromId=null, idDirection="descending", progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/timelines/public?limit=80`;
  if(onlyLocalPosts !== null) url += `&local=${onlyLocalPosts}`;
  if(onlyRemotePosts !== null) url += `&remote=${onlyRemotePosts}`;
  if(onlyPostsWithMedia !== null) url += `&only_media=${onlyPostsWithMedia}`;
  return _getPaginatedItems({url, maxItems, startFromId, idDirection, progressCallback});
}

export async function getTimelinePostsByTag({instanceDomain, tag, hasAnyOfTheseTags=null, hasAllOfTheseTags=null, hasNoneOfTheseTags=null, onlyLocalPosts=null, onlyRemotePosts=null, onlyPostsWithMedia=null, maxItems=200, startFromId=null, idDirection="descending", progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/timelines/tag/${tag}?limit=80`;
  if(hasAnyOfTheseTags !== null) url += `&any=${hasAnyOfTheseTags}`;
  if(hasAllOfTheseTags !== null) url += `&all=${hasAllOfTheseTags}`;
  if(hasNoneOfTheseTags !== null) url += `&none=${hasNoneOfTheseTags}`;
  if(onlyLocalPosts !== null) url += `&local=${onlyLocalPosts}`;
  if(onlyRemotePosts !== null) url += `&remote=${onlyRemotePosts}`;
  if(onlyPostsWithMedia !== null) url += `&only_media=${onlyPostsWithMedia}`;
  return _getPaginatedItems({url, maxItems, startFromId, idDirection, progressCallback});
}

export async function getUsersWhoFavoritedPost({instanceDomain, postId, maxItems=200, progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/statuses/${postId}/favourited_by?limit=80`;
  return _getPaginatedItems({url, maxItems, progressCallback});
}

export async function getUsersWhoBoostedPost({instanceDomain, postId, maxItems=200, progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/statuses/${postId}/reblogged_by?limit=80`;
  return _getPaginatedItems({url, maxItems, progressCallback});
}

export async function getParentsAndChildrenOfPost({instanceDomain, postId, maxItems=200, progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/statuses/${postId}/context`;
  let response = await fetch(url);
  let data = await response.json();
  let parents = data.ancestors;
  let children = data.descendants;
  return {parents, children};
}

export async function getPost({instanceDomain, postId}) {
  let url = `https://${instanceDomain}/api/v1/statuses/${postId}`;
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

export async function getUsersKnownToInstance({instanceDomain, localUsersOnly=false, maxItems=200, order=null, progressCallback=null}={}) {
  let url = `https://${instanceDomain}/api/v1/directory?limit=80`;
  if(localUsersOnly) url += "&local=1";
  if(order) url += `&order=${order}`; // order can be 'active' (default - recently active users first) or 'new' (new users first)
  return _getPaginatedItems({url, maxItems, progressCallback});
}

let userHandleToIdCache = new Map();
export async function userHandleToId({userHandle}) {
  if(userHandle.startsWith("@")) userHandle = userHandle.slice(1);
  if(userHandleToIdCache.has(userHandle)) return userHandleToIdCache.get(userHandle);
  let {instanceDomain, username} = _userHandleToUsernameAndDomain({userHandle});
  let userData = await fetch(`https://${instanceDomain}/api/v1/accounts/lookup?acct=${username}`).then(r => r.json());
  if(userData.error) throw new Error(userData.error);
  userHandleToIdCache.set(userHandle, userData.id);
  return userData.id;
}






//////////////////////////
//   PRIVATE FUNCTIONS  //
//////////////////////////

async function _getPaginatedItems({url, maxItems, startFromId=null, idDirection="descending", progressCallback}={}) {
  let items = [];
  let i = 0;
  let requestUrl = url;
  
  if(startFromId) {
    if(idDirection === "descending") {
      requestUrl = `${url}?max_id=${startFromId}`;
    } else if(idDirection === "ascending") {
      requestUrl = `${url}?min_id=${startFromId}`;
    } else {
      throw new Error("invalid idDirection");
    }
  }
  
  let gotItemIds = new Set();
  while(1) {
    let response = await fetch(requestUrl);
    let newItems = await response.json();
    let finished = false;
    for(let item of newItems) {
      // Link header pagination urls seem to loop? so if we get a duplicate we stop
      if(gotItemIds.has(item.id) || items.length >= maxItems) {
        finished = true;
        break;
      }
      gotItemIds.add(item.id);
      items.push(item);
    }
    if(finished) break;
    if(newItems.length === 0) break;
    if(response.headers.get("Link")?.includes(`rel="next"`)) {
      requestUrl = response.headers.get("Link").split(";")[0].slice(1, -1); // pagination urls are in Link header for some endpoints
    } else if(idDirection === "descending") {
      requestUrl = `${url}?max_id=${items.at(-1).id}`;
    } else if(idDirection === "ascending") {
      requestUrl = `${url}?min_id=${items.at(-1).id}`;
    } else {
      throw new Error("invalid idDirection");
    }
    if(progressCallback) progressCallback({message:`got ${items.length} items (batch ${i})`});
    i++;
  }
  return items;
}

function _userHandleToUsernameAndDomain({userHandle}) {
  if(userHandle.startsWith("@")) userHandle = userHandle.slice(1);
  let instanceDomain = userHandle.split("@")[1];
  let username = userHandle.split("@")[0];
  return {username, instanceDomain};
}

