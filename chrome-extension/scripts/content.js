(async () => {
  let user = await chrome.storage.local.get(["user"])
  if (user) {
    user = {user: await getUser(user.user.username)}
  }
  const url = new URL(window.location.href)

  if (user?.user && user.user.restricted_domains[url.host] && (!user?.user.restriction_date || user.user.restriction_date < Date.now())) {
    window.location.href = `http://localhost:3000/${user.user.username}?site=${url.href}`
    //quizzPage(await getQuestions(user.user.username))
  }
})()

