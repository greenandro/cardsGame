import {
  ActionTemplate,
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  logs
} from "@cardsgame/server"

import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const PickCard: ActionTemplate = {
  name: "PickCard",
  interaction: {
    type: ["classicCard", "deck", "pile"]
  },
  conditions: [con.NOT(isCardPicked)],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
    const targetEntity = event.target.isContainer
      ? event.target.top
      : event.target

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(
        targetEntity,
        targetEntity.parentEntity,
        state.entities.findByName("middle")
      ),
      new ChangeCardPickedState(true)
    ])
  }
}
