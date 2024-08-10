"use client";

import Header from '@/components/header'
import { useEffect, useState } from "react";
import useQuiz from "../store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Player } from "@lottiefiles/react-lottie-player";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: string[];
}


export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const config = useQuiz((state) => state.config);
  const addScore = useQuiz((state) => state.addScore);


  useEffect(() => {
    async function getQuestions() {
      try {

        setLoading(true);

        const response = await fetch(`https://opentdb.com/api.php?amount=${config.numberOfQuestions}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`);

        console.log(response,"resppppppponseeeeeeeeeeeeeeeee")

        const { results } = await response.json();

        const shuffledResults = results.map((e) => {
          let answers = [...e.incorrect_answers, e.correct_answer];

          answers = answers.map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

          return {
            ...e,
            answers: answers
          };
        });


        console.log(shuffledResults, "shuffled");
        setQuestions([...shuffledResults]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getQuestions();
  }, [config.numberOfQuestions, config.category.id, config.level, config.type]);

  const handleNext = () => {
    let remainingQuestions = [...questions];
    remainingQuestions.shift();

    setQuestions([...remainingQuestions]);
    setAnswer("")
  }

  const checkAnswer = (answer: string) => {
    if (answer === questions[0].correct_answer) {
      addScore(0);
    }

    setAnswer(questions[0].correct_answer);
  };

  return (
    <>
    <Header/>
    {questions.length && !loading && (
      <div className="max-w-screen-xl flex-wrap items-center mx-auto p-4 pb-0 flex justify-center mt-10">
      <h1 className="mb-4 mt-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
        <span className="text-transparent bg-clip-text bg-black">Question Number</span>
      </h1>
    </div>
    )}

<div className="max-w-screen-xl flex-wrap items-center mx-auto px-4 flex justify-center">
        {questions.length ? (
          <h1 className="mb-4 mt-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-800">
              {`${config.numberOfQuestions - questions.length + 1}/${config.numberOfQuestions}`}
            </span>
          </h1>
        ) : null}
      </div>

      <div className="max-w-screen-xl mx-auto p-4 flex justify-center">
        <div className="p-10 my-10 rounded-lg shadow-xl w-[65%]">

          {questions.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-5 pt-3 pb-5 text-black">{questions[0].question}</h2>

              <div className="grid grid-cols-2 gap-4">
                {questions[0].answers.map((Answer, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(Answer)}
                    className={cn(
                      "w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-md shadow-md hover:bg-slate-600 hover:text-white transition duration-300",
                      {
                        "bg-red-700 hover:bg-red-700": answer && Answer !== answer,
                        "bg-green-600 hover:bg-green-600": answer && Answer === answer,
                        "text-gray-100": answer,
                      }
                    )}
                  >
                    {Answer}
                  </button>
                ))}
              </div>

              <div className="flex justify-center w-full pt-10">
                <button
                  onClick={() => handleNext()}
                  type="button"
                  className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-80"
                >
                  Next
                </button>
              </div>
            </>
          )}


          {!questions.length && loading && (
            <div className="w-full">
              <Skeleton className="h-[30px] mt-3 rounded-full w-full" />
              <Skeleton className="h-[30px] mt-3 rounded-full w-full" />
              <Skeleton className="h-[30px] mt-3 rounded-full w-56" />
            </div>
          )}



          {!questions?.length && !loading && (
            <div className="flex flex-col justify-center items-center">
              <Player
                src="https://assets6.lottiefiles.com/packages/lf20_touohxv0.json"
                className="player"
                loop
                autoplay
                style={{ height: "400px", width: "400px" }}
              />
              <h1 className="mt-10 text-center font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                YOUR SCORE {" "}
                <span className="font-extrabold text-transparent text-10xl bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {config.score}
                </span>
              </h1>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="bg-white hover:bg-gray-100 my-10 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
              >
                Start Over
              </button>
            </div>
          )}


        </div>
      </div>
    </>
    
  );
}
