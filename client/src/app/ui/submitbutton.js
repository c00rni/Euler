"use client";
import { useState } from 'react';

async function expendTime(question) {
  const space = question?.timeSpace ? question.timeSpace : 1000*60*60*6
  try {
    const options = {
	headers: {"Content-Type": "application/json"},
	method: "PUT",
    }
    const response = await fetch(`http://localhost:3000/question/${question._id}/${space}`, options)
    console.log(await response.json())
  } catch(error) {
    console.log(error.message) 
  }
}

async function resetSpaceRepetition(question) {
  try {
    const options = {
	headers: {"Content-Type": "application/json"},
	method: "PUT",
    }
    const response = await fetch(`http://localhost:3000/reset/${question._id}`, options)
    console.log(await response.json())
  } catch(error) {
    console.log(error.message) 
  }
}


async function removeLimitation(username) {
  try {
    const options = {
	headers: {"Content-Type": "application/json"},
	method: "GET",
    }
    const response = await fetch(`http://localhost:3000/unrestrict/${username}`, options)
    console.log(await response.json())
  } catch(error) {
    console.log(error.message) 
  }
}

export default function SubmitButton({questions, setQuestions}) {
  const [state, setState] = useState("quizz")

  async function submit() {
    if (state === "quizz") {
      let badIds = 0

      for (const question of questions) {
        if (question.selection == question.answer) {
          await expendTime(question, true)
        } else {
          badIds += 1
          await resetSpaceRepetition(question)
          for (const option of question.options) {
            if (option.value === question.selection) {
              option.error = true
            }
          }
        }
      }

      if (badIds > 0) {
        setState("retake")
      } else {
        await removeLimitation(questions[0].username)
        setState("end")
      }
      setQuestions(questions)
    } else if (state === "retake") {
      location.reload();
    } else {
      const url = new URL(window.location.href)
      const targetSite = url.searchParams.get('site')
      if (targetSite) {
        window.location.href = targetSite
      }

    } 
  }

  return (
    <>
     <div onClick={async () => await submit()} className={`py-3 px-5 rounded-lg min-w-24 text-center font-bold text-white ${ state === "quizz" ? "hover:bg-blue-500 bg-blue-300" : "hover:bg-red-500 bg-red-300"} ease-in duration-100`}>
        {state == "quizz" ? "Submit" : state == "retake" ? "Retake" : "Go to website.com"}
     </div>
    </>
  );
}
