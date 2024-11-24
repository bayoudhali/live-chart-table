export type RandomEvent = {
  index: number;
  value1: number;
  value2: number;
  comment: string;
};

export function createRandomEvent(index: number): RandomEvent {
  return {
    index,
    value1: Math.round(Math.random() * 10000),
    value2: Math.round(Math.random() * 10000),
    comment: `Random comment ${index}`,
  };
}
