(async () => {
  const user = await chrome.storage.local.get(["user"])
  const domain = window.location.host
  if (user?.user && user.user.restricted_domains[domain] && (!user?.user.restriction_date || user.user.restriction_date < Date.now())) {
    window.location.href = `http://localhost:3000/${user.user.username}`
    //quizzPage(await getQuestions(user.user.username))
  }
})()

