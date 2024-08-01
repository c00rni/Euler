"use client";
import {useEffect, useState} from "react"
import Option from "./option"

export default function Question({index, questions, question, setQuestions}) {
  const [selection, setSelection] = useState(question.selection);
  const labels = ["A", "B", "C"]
  useEffect(() => {
    question.selection = selection
    for (let i = 0; i < questions.length; i++) {
      if (questions[i]._id == question._id) {
        questions[i] = question
      }
    }
    setQuestions(questions)
  },[selection, questions, question, setQuestions])
  return (
    <>
      <h2 className={`text-2xl mb-2 font`}>Question {index}</h2>
      <div className={`px-5`}>
        <p className={`font-semibold`}>{question.statement}</p>
        <div className={`my-4`}>
          {question.options.map((option, index) => {
            return <Option
              key={index}
              label={labels[index]}
              selection={selection}
              setSelection={setSelection}
              option={option}
              answer={question.answer}/>
          })}
        </div>
      </div>
    </>
  )
}
