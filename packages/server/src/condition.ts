import { State } from "./state"
import { ServerPlayerEvent } from "./player"

export interface ICondition {
  (state: State, event: ServerPlayerEvent): boolean
}
export type IConditionFactory = (...args: any) => ICondition