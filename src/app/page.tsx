"use client"

import { useEffect, useState } from "react";
import { CITIES, City } from "../../constants/cities";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Question = {
  answer: City;
  options: City[];
}

type LastChoice = {
  wasTrue: boolean;
  city: City;
  gameStarted?: boolean;
}

export default function Home() {
  const [ loading, setLoading ] = useState(true);
  const [ question, setQuestion ] = useState<Question>({
    answer: CITIES[0],
    options: []
  });
  const [ combo, setCombo ] = useState(0);
  const [ lastChoice, setLastChoice ] = useState<LastChoice>({
    wasTrue: false,
    city: CITIES[0],
    gameStarted: false
  });

  useEffect(() => {
    setupNewQuestion(CITIES[0]);
    setLoading(false);
  }, []);

  const setupNewQuestion = (latestAnswer: City) => {
    const withoutLatest = CITIES.filter(city => city.plate_number !== latestAnswer.plate_number);
    const newAnswer = withoutLatest[Math.floor(Math.random() * withoutLatest.length)];
    const answerIndex = CITIES.findIndex(city => city.plate_number === newAnswer.plate_number);
    const selectionWindow = withoutLatest.slice(answerIndex - 3 <= 0 ? undefined : answerIndex, answerIndex + 3).sort(() => 0.5 - Math.random());
    const newOptions = [newAnswer, ...selectionWindow.slice(0, 3)];
    console.log({
      answerIndex,
      newAnswer,
      selectionWindow,
      newOptions
    })
    newOptions.sort(() => 0.5 - Math.random());
    setQuestion({
      answer: newAnswer,
      options: newOptions
    });
  }

  const onOptionSelect = (option: City) => {
    const didWin = option.plate_number === question.answer.plate_number;
    setCombo((combo) => didWin ? combo + 1 : 0);
    setLastChoice({ wasTrue: didWin, city: question.answer, gameStarted: true});
    setupNewQuestion(question.answer);
  }

  return (
    <main className="w-screen h-[100svh] flex flex-col p-4">
      <section>
        <h1 className="text-3xl font-semibold p-4 text-right">
          {combo} Combo
        </h1>
      </section>
      {
        loading 
        ? <section className="flex-1 flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </section>
        : <section id="game" className="flex-1 flex flex-col justify-center items-center">
            <div id="options" className="max-w-md w-full flex flex-col">
              <h1 className="text-6xl font-semibold text-center p-8">
                {question.answer.plate_number}
              </h1>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Card 
                    key={index}
                    onClick={() => onOptionSelect(option)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out p-0"
                  >
                    <CardContent className="flex justify-center items-center p-4">
                      <Label className="text-md">
                        {option.name}
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
      }
      <section className="flex justify-center">
        <h1 className="text-xl font-semibold p-4 text-center">
          {!lastChoice.gameStarted ? "Başlamak için seç" : lastChoice.wasTrue ? "✅" : "❌, cevap " + lastChoice.city.name + " olacaktı!'"}
        </h1>
      </section>
    </main>
  );
}
