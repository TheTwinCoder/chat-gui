import type { QuestionMsgType } from "@/types/message";
import { QuestionItem } from "./questions/question-item";

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
    <div className="flex flex-col gap-4">
      {visibleQuestions.map((question, index) => (
        <QuestionItem
          key={index}
          question={question}
          index={index}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
