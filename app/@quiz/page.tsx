"use client";

import { useEffect, useState } from "react";
import useQuiz from "../store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Quiz() {
  const [questions, setQuestions] = useState<any>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const config = useQuiz((state) => state.config);
  const addScore = useQuiz((state) => state.addScore);

  console.log(config.category, config.numberOfQuestions, "2323");

  useEffect(() => {
    async function getQuestions() {
      setLoading(true);
      const { results } = await (
        await fetch(
          `https://opentdb.com/api.php?amount=${config.numberOfQuestions}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`
        )
      ).json();

      // Corrected the property name for incorrect answers
      let shuffledResults = results.map((e) => {
        let shuffledAnswers = [...e.incorrect_answers, e.correct_answer]
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        
        return { ...e, answers: shuffledAnswers };
      });

      setQuestions([...shuffledResults]);
      setLoading(false);
    }
    getQuestions();
  }, [config.numberOfQuestions, config.category.id, config.level, config.type]);

  const handleNext = () => {
    let remainingQuestions = [...questions];
    remainingQuestions.shift();
    console.log(remainingQuestions, "rmques");
    setQuestions([...remainingQuestions]);
    setAnswer("");
  };

  const checkAnswer = (answer: string) => {
    if (answer === questions[0].correct_answer) {
      addScore(0);
    }

    setAnswer(questions[0].correct_answer);
  };

  return (
    <section className="flex flex-col justify-center items-center p-4 mt-10">
      {!!questions.length ? (
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Question Number{" "}
          {questions?.length ? (
            <span className="text-blue-600 dark:text-blue-500">
              {" "}
              #{config.numberOfQuestions - questions?.length + 1}
            </span>
          ) : null}
        </h1>
      ) : null}

      {!loading && !questions.length && (
        <p className="text-2xl">Score: {config.score}</p>
      )}

      <section className="shadow-2xl my-10 p-10 w-[90%] rounded-lg flex flex-col justify-center items-center shadow-blue-200">
        <h4 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-blue-600 dark:text-blue-500 md:text-3xl lg:text-4xl ">
          {questions.length ? questions[0].question : null}
        </h4>
        {loading && (
          <div className="flex flex-col">
            <Skeleton className="w-[600px] h-[60px] my-10 rounded-sm" />
            <Skeleton className="w-[600px] h-[500px] rounded-sm" />
          </div>
        )}

        {!questions.length && !loading && (
          <div className="flex flex-col justify-center items-center">
            <Player
              src="https://lottie.host/123eb824-9807-4791-966f-2b8cd3d8e6c6/kxNukCAhSF.json"
              className="player"
              loop
              autoplay
              style={{ height: "400px", width: "400px" }}
            />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Your Score : {config.score}
        </h1>

        <button
          onClick={() => window.location.reload()}
          type="button"
          className="my-4 py-3.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Next
        </button>

        <div className="flex justify-evenly items-center my-10 flex-wrap w-[90%]">
          {questions.length
            ? questions[0].answers.map((ans) => (
                <button
                  key={ans}
                  onClick={() => checkAnswer(ans)}
                  type="button"
                  className={cn(
                    "w-[33%] my-4 py-3.5 px-5 me-2 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border-0 shadow-blue shadow-2xl hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
                    {
                      "bg-red-900": answer && ans !== answer,
                      "bg-blue-700": answer && ans === answer,
                      "hover:bg-red-900": answer && ans !== answer,
                      "hover:bg-blue-700": answer && ans === answer,
                      "bg-gray-100": answer,
                    }
                  )}
                >
                  {ans}
                </button>
              ))
            : null}
        </div>

        {questions.length ? (
          <button
            onClick={handleNext}
            type="button"
            className="w-[33%] my-4 py-3.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Next
          </button>
        ) : null}
      </section>
    </section>
  );
}
