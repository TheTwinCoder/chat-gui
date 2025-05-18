import type { GoalMsgType } from "@/types/message";
import { CheckCircle2, Target } from "lucide-react";

interface GoalMsgProps {
  data: GoalMsgType;
}

export function GoalMsg({ data }: GoalMsgProps) {
  const { goal, time } = data;
  const { goal: goalText, constraints } = goal;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50">
      {/* 헤더 */}
      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
        <Target className="w-5 h-5" />
        <span className="font-semibold">목표 설정</span>
        <span className="text-xs text-blue-500 dark:text-blue-400 ml-auto">
          {new Date(time).toLocaleTimeString()}
        </span>
      </div>

      {/* 목표 섹션 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
              G
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
              목표
            </h3>
            <p className="text-gray-800 dark:text-gray-200">{goalText}</p>
          </div>
        </div>

        {/* 요구사항 섹션 */}
        {constraints.length > 0 && (
          <div className="flex items-start gap-2 mt-2">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                R
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-1">
                요구사항
              </h3>
              <ul className="flex flex-col gap-1.5 pl-1">
                {constraints.map(
                  (
                    constraint: { title: string; detail: string },
                    index: number
                  ) => (
                    <li key={index} className="flex flex-col gap-0.5 text-sm">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
                        <span className="font-medium text-indigo-900 dark:text-indigo-200">
                          {constraint.title}
                        </span>
                      </div>
                      <p className="pl-5 text-gray-600 dark:text-gray-400">
                        {constraint.detail}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
