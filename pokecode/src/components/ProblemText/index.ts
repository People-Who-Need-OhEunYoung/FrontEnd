export { default as ProblemText } from './ProblemText';

export interface SampleInOutPut {
  input: string;
  output: string;
}

export interface Problem {
  step: string | null;
  id: string;
  title: string;
}

export interface ProblemDetails {
  title: string;
  description: string;
  input: string;
  output: string;
  samples: Array<SampleInOutPut>;
  imgs: Array<string>;
}

export interface CreateProblemsResult {
  created: { solution: number; txt: number; img: number };
  success: number;
  fail: number;
  errorList: Array<{ problemData: Problem | null; error: any }>;
}

export interface ResizableTabsProps {
  id: string;
  isshowheader: string;
  size: string;
  tabwidth: number;
}

export interface TimeDetails {
  elapsed_time: number;
  limit_time: number;
}