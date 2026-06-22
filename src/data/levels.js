const makeQuestionIds = (levelNumber) => {
  const start = (levelNumber - 1) * 10 + 1;
  return Array.from({ length: 10 }, (_, index) => `q-${String(start + index).padStart(3, "0")}`);
};

export const levels = [
  { id: "level-01", order: 1, title: "桃园结义", description: "从桃园开始你的三国知识冒险。", unlockWarriorId: "liubei", questions: makeQuestionIds(1) },
  { id: "level-02", order: 2, title: "黄巾初战", description: "小将军第一次出战，试试基础知识。", unlockWarriorId: "guanyu", questions: makeQuestionIds(2) },
  { id: "level-03", order: 3, title: "虎牢关前", description: "来到雄关之前，继续积累本领。", unlockWarriorId: "zhangfei", questions: makeQuestionIds(3) },
  { id: "level-04", order: 4, title: "三英战吕布", description: "勇气和知识都要准备好。", unlockWarriorId: "zhaoyun", questions: makeQuestionIds(4) },
  { id: "level-05", order: 5, title: "官渡风云", description: "用细心判断赢得挑战。", unlockWarriorId: "caocao", questions: makeQuestionIds(5) },
  { id: "level-06", order: 6, title: "三顾茅庐", description: "带着诚意去寻找智慧。", unlockWarriorId: "zhugeliang", questions: makeQuestionIds(6) },
  { id: "level-07", order: 7, title: "草船借箭", description: "观察天气，也观察题目。", unlockWarriorId: "huangyueying", questions: makeQuestionIds(7) },
  { id: "level-08", order: 8, title: "赤壁之战", description: "合作和知识都能带来胜利。", unlockWarriorId: "zhouyu", questions: makeQuestionIds(8) },
  { id: "level-09", order: 9, title: "华容道", description: "在岔路中选出正确答案。", unlockWarriorId: "sunquan", questions: makeQuestionIds(9) },
  { id: "level-10", order: 10, title: "取西川", description: "保持专注，向新的城池前进。", unlockWarriorId: "huangzhong", questions: makeQuestionIds(10) },
  { id: "level-11", order: 11, title: "七擒孟获", description: "用耐心解决连续挑战。", unlockWarriorId: "machao", questions: makeQuestionIds(11) },
  { id: "level-12", order: 12, title: "五丈原", description: "完成最后的知识远征。", unlockWarriorId: "jiangwei", questions: makeQuestionIds(12) }
];
