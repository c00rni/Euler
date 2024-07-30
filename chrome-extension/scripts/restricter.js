function quizzPage(data) {
	const quizzHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Blocked</title>
    </head>
    <body>
      <h1>Site Blocked</h1>
      <p>${data}</p>
    </body>
    </html>`
	document.body.innerHTML = quizzHTML
}

