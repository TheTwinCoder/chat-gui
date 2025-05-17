export default function FeatureList() {
  const features = [
    {
      title: "일반 질문",
      description:
        "챗봇에게 일반적인 질문을 할 수 있습니다. (예: '날씨 알려줘', '시간 알려줘')",
    },
    {
      title: "조회하기 질문",
      description: "특정 정보를 검색하거나 조회할 수 있습니다.",
    },
    {
      title: "단계적 조회하기 질문",
      description:
        "단계 정해에서 원하는 정보를 선택합니다. 시간, 개념, 인물 등에 따라 원하는 정보를 조회할 수 있습니다. 예: '지난 7일 동안의 매출', '이번 달의 인기 상품은 무엇인가 알려 주세요.'",
    },
    {
      title: "도움말 보기",
      description:
        "언제든 도움말을 보려면 '도움말'이라고 입력하세요. 또한 특정 기능에 대한 도움말을 보려면 '기능 도움말'이라고 입력하세요. 질문 카테고리에 도움을 주어 매우 편리합니다.",
    },
  ];

  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="space-y-1">
          <h3 className="font-medium text-sm">
            **{index + 1}. {feature.title}**
          </h3>
          <p className="text-xs text-gray-600 pl-4">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
