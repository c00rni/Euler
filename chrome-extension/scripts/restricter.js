
function printQuestion(questionIndex, question) {
  let displayedOptions = ""
  question.options.forEach((elem, index) => displayedOptions += `
    <div>
      <input type="radio" id="${index}-${question._id}" name="radio-${question._id}" value="${index}"/>
      <label>${elem}</label>
    </div>`
  );
  return `
  <fieldset>
    <legend>Quesiton n°${questionIndex}</legend>
    <h2>${question.statement}<h2/>
    ${displayedOptions}
  </fieldset>`;
}


function quizzPage(questions) {
  let displayedQuestions = ""
  questions.forEach((question, index) => displayedQuestions += printQuestion(index + 1, question))


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
      <form id="quizzForm">
	${displayedQuestions}
	<button type="submit">Submit</button>
      </form>
    </body>
    </html>`
  document.body.innerHTML = quizzHTML;
  const inputs = document.querySelectorAll("input");
  const awnserMap = {}
  for (const question of quesitons) {
    awnserMap[question._id] = quesiton.findIndex(options => options === question.awnser)
  }
  document.getElementById('quizzForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    for (const input of inputs) {
      console.log(input)
    }
  })

}

