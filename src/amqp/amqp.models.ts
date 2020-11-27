type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const bindings = {
  someExchange: [{ someQueue: ["someExchange.someQueue.someTopic"] }],
} as const;

export type Bindings = typeof bindings;
export type Exchange = keyof Bindings;
export type Queue = keyof UnionToIntersection<Bindings[Exchange][number]>;
export type Topic = UnionToIntersection<Bindings[Exchange][number]>[Queue][number];

export type CustomMessage = {
  type: string;
  body: Record<string, unknown>;
};
