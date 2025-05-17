import type { QuestionMsgType } from "@/types/message";
import { AiMsg } from "./chat/message";
import { cn } from "@/lib/utils";

export function QuestionMsg({
  data,
  onAnswer,
  disabled,
}: {
  data: QuestionMsgType;
  onAnswer: (index: number, answer: string) => void;
  disabled: boolean;
}) {
  // 현재 보여줄 질문의 인덱스를 찾습니다
  const currentQuestionIndex = data.questions.findIndex((q) => !q.answer);

  // 답변된 질문들과 현재 질문만 보여줍니다
  // 마지막 질문에 답변한 경우(currentQuestionIndex가 -1) 모든 질문을 보여줍니다
  const visibleQuestions =
    currentQuestionIndex === -1
      ? data.questions
      : data.questions.slice(0, currentQuestionIndex + 1);

  return (
    <>
      {visibleQuestions.map(
        ({ question, answerCandidate, answerUnit, answer }, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 p-3 rounded-lg transition-colors shadow-md",
              answer && "bg-gray-50 dark:bg-gray-800"
            )}
          >
            <span>
              <span className="font-bold">Q{index + 1} </span>
              {question}
            </span>
            <div className="flex flex-col gap-2">
              {answer ? (
                <p className="text-sm">{answer}</p>
              ) : (
                answerCandidate.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${index}-${idx}`}
                      value={label}
                      checked={label === answer}
                      disabled={disabled}
                      onChange={() => onAnswer(index, label)}
                    />
                    <label htmlFor={`question-${index}-${idx}`}>{label}</label>
                  </div>
                ))
              )}
            </div>
            {answerUnit && !answer && (
              <input
                type="text"
                disabled={disabled}
                placeholder={`답변을 입력하세요 (단위: ${answerUnit})`}
                onChange={(e) => onAnswer(index, e.target.value)}
                className="px-2 py-1 border rounded-md"
              />
            )}
          </div>
        )
      )}
    </>
  );
}
