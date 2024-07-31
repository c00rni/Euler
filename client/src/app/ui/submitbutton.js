import { useState } from 'react';


export default function SubmitButton({questions, setQuestions}) {
  const [state, setState] = useState("quizz")

  function submit() {
    const goodIds = {}
    const badIds = {}

    for (const question of questions) {
      if (question.selection == question.answer) {
        goodIds[question._id] = true
      } else {
        badIds[question._id] = true
        for (const option of question.options) {
          if (option.value === question.selection) {
            option.error = true
          }
        }
      }
    }
    console.log(goodIds)
    console.log(badIds)
    setQuestions(questions)
  }

  return (
    <>
     <div onClick={() => submit()} className={`py-3 px-5 rounded-lg min-w-24 text-center font-bold text-white ${ state === "quizz" ? "hover:bg-blue-500 bg-blue-300" : "hover:bg-red-500 bg-red-300"} ease-in duration-100`}>
        {state == "quizz" ? "Submit" : state == "retake" ? "Retake" : "Go to website.com"}
     </div>
    </>
  );
}
