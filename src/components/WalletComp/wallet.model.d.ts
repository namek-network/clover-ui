  export interface CloudQuestionStarDTO {
    id: number;
    questionHash: string;
    note: string;
    createTime: number;
    createUser?: number;
    star: boolean;
  }
  
  export interface CloudQuestionStatDTO {
    id: number;
    hash: string;
    answerCount: number;
    correctCount: number;
    wrongCount: number;
    correctRatio: number;
    lastUpdateTime: number;
  }