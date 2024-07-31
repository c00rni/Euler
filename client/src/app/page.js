"use client";

import Image from "next/image";
import Question from "./ui/question";
import SubmitButton from "./ui/submitbutton"
import { useEffect, useState, useReducer } from "react";

function shuffle(arr) {
  return arr.map(value => ({sort: Math.random(), value}))
    .sort((a,b) => a.sort - b.sort)
    .map(({value}) => value)
}

export default function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const username = window.location.pathname
      try {
        const response = await fetch(`http://localhost:3000/questions/corni`, {
          headers:{"Content-Type": "application/json"},
          method: "GET",
        })
       
        let questionArray = await response.json()
        questionArray = questionArray.map(question => {
          question.options = question.options.map(value => ({value, error: false}))
          question.options = shuffle(question.options)
          question.selection = null
          return question
        })
        setQuestions(questionArray)
      } catch(err) {
        console.log(err.message)
      }
    })()
  }, [])

  return (
    <main className="flex flex-col min-h-[100vh] w-[1024px] m-auto p-4">
      {questions.map((question, index) => {
        return (
          <Question
            key={question._id}
            index={index + 1}
            question={question}
            questions={questions}
            setQuestions={setQuestions}/>
        )
      })}
      
      <SubmitButton questions={questions} setQuestions={setQuestions} /> 
    </main>
  );
}
