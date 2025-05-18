import ChatInput from "@/components/chat-input";
import { ChatArea } from "@/components/chat/chat-area";
import { ChatHeader } from "@/components/chat/chat-header";
import { getActions } from "@/lib/gemini/askActions";
import { askInitialQuestions } from "@/lib/gemini/askInitialQuestions";
import { findInitialPage } from "@/lib/gemini/findInitialPage";
import { structureGoal } from "@/lib/gemini/goalStructure";
import type {
  GoalMsgType,
  InitMsgType,
  QuestionMsgType,
} from "@/types/message";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

export type HistoryType = {
  page: {
    html: string;
    description?: string;
  };
  action?: {
    description: string;
    type: "click" | "input" | "submit";
    locatorType: "id" | "css";
    locator: string;
    value?: string;
  }[];
};

function RouteComponent() {
  const [initialMsg, setInitialMsg] = useState<InitMsgType | null>(null);
  const [questionMsg, setQuestionMsg] = useState<QuestionMsgType | null>(null);
  const [isQuestionAllAnswered, setIsQuestionAllAnswered] =
    useState<boolean>(false);
  const [goalMsg, setGoalMsg] = useState<GoalMsgType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialQuery, setInitialSiteName] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryType[]>([]);

  const [actionIdx, setActionIdx] = useState<number>(-1);

  useEffect(() => {
    console.log("history", history);
    if (history.length == 0) return;
    const last = history[history.length - 1];

    (async () => {
      if (last.action) {
        for (let i = 0; i < last.action.length; i++) {
          setActionIdx(i);
          const { type, locatorType, locator, value } = last.action[i];
          await window.api.seleniumInteract({
            type,
            locatorType,
            locator,
            value,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        setActionIdx(-1);

        const pageHtml = await window.api.seleniumGetPageHtml();
        setHistory((prev) => [...prev, { page: { html: pageHtml.data! } }]);
      } else {
        const { description, actions } = await getActions(
          goalMsg!.goal,
          history,
          last.page.html
        );
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].page.description = description;
          newHistory[newHistory.length - 1].action = actions;
          return newHistory;
        });
      }
    })();
  }, [history]);

  useEffect(() => {
    if (questionMsg && !isQuestionAllAnswered) {
      if (questionMsg.questions.every((question) => !!question.answer)) {
        setIsQuestionAllAnswered(true);

        (async () => {
          setIsLoading(true);
          const result = await structureGoal(
            initialMsg!.text,
            questionMsg.questions
              .map((question) => question.question + ": " + question.answer)
              .join("\n")
          );
          setGoalMsg({
            type: "goal",
            goal: result.structuredResult,
            time: new Date(),
          });
          setIsLoading(false);
        })();
      }
    }
  }, [questionMsg, isQuestionAllAnswered, initialMsg]);

  useEffect(() => {
    if (goalMsg && !initialQuery) {
      (async () => {
        setInitialSiteName("");
        const result = await findInitialPage(goalMsg.goal);
        setInitialSiteName(result.siteName);
        await window.api.seleniumOpenUrl(result.url);
        const pageHtml = await window.api.seleniumGetPageHtml();
        console.log("pageHtml", pageHtml);

        // 히스토리 초기화
        setHistory([
          {
            page: {
              html: pageHtml.data!,
            },
          },
        ]);
        setActionIdx(-1);
      })();
    }
  }, [goalMsg, initialQuery]);

  const handleNewMessage = async (text: string) => {
    setIsLoading(true);
    setError(null);

    if (!initialMsg) {
      setInitialMsg({
        type: "init",
        text,
        time: new Date(),
      });

      try {
        const result = await askInitialQuestions(text);
        setQuestionMsg({
          type: "question",
          questions: result.questions,
          time: new Date(),
        });
        // 히스토리 초기화
        setHistory([]);
        setActionIdx(-1);
      } catch {
        setError("알 수 없는 오류가 발생했습니다.");
        setInitialMsg(null);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(false);
  };

  function handleAnswer(index: number, answer: string) {
    if (questionMsg) {
      const newQuestionMsg = { ...questionMsg };
      newQuestionMsg.questions[index].answer = answer;
      setQuestionMsg(newQuestionMsg);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <ChatHeader />
        <div className="flex-1 flex flex-col mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ChatArea
              initialMsg={initialMsg}
              questionMsg={questionMsg}
              goalMsg={goalMsg}
              initialQuery={initialQuery}
              isLoading={isLoading}
              error={error}
              onAnswer={handleAnswer}
              history={history}
              actionIdx={actionIdx}
            />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <ChatInput
              placeholder="무엇을 하고 싶으신가요?"
              onNewMessage={handleNewMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
