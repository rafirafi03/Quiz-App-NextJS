"use client";

import Header from "@/components/header";
import DropOptions from "@/components/DropOptions";
import { Input } from "@/components/ui/input";
import useQuiz from "./store";

export default function Home() {
  const quizConfig = useQuiz((state) => state.config);
  const addNumberOfQuestions = useQuiz((state) => state.addNumberOfQuestions);
  const addStatus = useQuiz((state) => state.addStatus);

  return (
    <>
      <Header />
      <div className="max-w-screen-xl flex-wrap items-center mx-auto p-4 flex justify-center mt-10">
        <h1 className="mb-4 mt-4 text-3xl font-extrabold text-black dark:text-black md:text-5xl lg:text-5xl ">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-green-600">
            Quiz Fest
          </span>
        </h1>
      </div>
      <div className="max-w-screen-xl flex-wrap items-center mx-auto p-4 flex justify-center ">
        <div className="p-10 my-10 rounded-lg shadow-xl w-[65%] bg-white">
          <div className="pt-5 bg-white">
            <Input
              placeholder="number of questions"
              className="mt-5 "
              type="number"
              defaultValue={10}
              min={0}
              max={15}
              onChange={(e) => addNumberOfQuestions(parseInt(e.target.value))}
            />
          </div>
          <div className="pt-5 w-full ">
            <DropOptions />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => addStatus("start")}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-bold text-white focus:outline-none bg-gray-500 rounded-full border hover:bg-black hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-300 dark:focus:ring-green-700 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-green-500 w-80"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
