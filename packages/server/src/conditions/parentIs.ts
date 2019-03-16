import { ICondition, IConditionFactory } from "../condition"
import { ServerPlayerEvent } from "../player"
import { EntityProps } from "../room"

export const parentIs: IConditionFactory = (props: EntityProps): ICondition => {
  const cond: ICondition = (_, event: ServerPlayerEvent) => {
    return Object.keys(props).every(
      key => event.target.parentEntity[key] === props[key]
    )
  }
  cond._name = "parentIs"
  return cond
}