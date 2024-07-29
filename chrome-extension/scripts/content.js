(async () => {
  const user = await chrome.storage.local.get(["user"])
  const domain = window.location.host
  if (user && user.user.restricted_domains[domain]) {
      quizzPage(JSON.stringify(user))
  }
})()

