import { cn } from "@/lib/utils";
import type { QuestionMsgType } from "@/types/message";

type QuestionType = QuestionMsgType["questions"][number];

interface QuestionItemProps {
  question: QuestionType;
  index: number;
  onAnswer: (index: number, answer: string) => void;
  disabled: boolean;
}

export function QuestionItem({
  question,
  index,
  onAnswer,
  disabled,
}: QuestionItemProps) {
  const {
    question: questionText,
    answerCandidate,
    answerUnit,
    answer,
  } = question;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-lg transition-all duration-200",
        "border border-gray-200 dark:border-gray-700",
        "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        answer && "bg-gray-50 dark:bg-gray-800/50 shadow-sm"
      )}
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium">
          {index + 1}
        </span>
        <span className="text-gray-900 dark:text-gray-100">{questionText}</span>
      </div>

      <div className="flex flex-col gap-2 pl-8">
        {answer ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">답변:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {answer}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {answerCandidate.map((label: string, idx: number) => (
              <label
                key={idx}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md cursor-pointer",
                  "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                  "transition-colors duration-150"
                )}
              >
                <input
                  type="radio"
                  name={`question-${index}-${idx}`}
                  value={label}
                  checked={label === answer}
                  disabled={disabled}
                  onChange={() => onAnswer(index, label)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}

        {answerUnit && !answer && (
          <div className="mt-2">
            <input
              type="text"
              disabled={disabled}
              placeholder={`답변을 입력하세요 (단위: ${answerUnit})`}
              onChange={(e) => onAnswer(index, e.target.value)}
              className={cn(
                "w-full px-3 py-2 rounded-md",
                "border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-400 dark:placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
