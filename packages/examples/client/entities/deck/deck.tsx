import React, { FunctionComponent } from "react"
import "./deck.scss"
import { EntityWrapper, EntityProps } from "../entityWrapper/entityWrapper"
import {
  ParentWrapper,
  ParentWrapperProps
} from "../parentWrapper/parentWrapper"

interface DeckProps extends ParentWrapperProps, EntityProps {}

const Deck: FunctionComponent<DeckProps> = props => {
  return (
    <EntityWrapper className="deck entity--container" {...props}>
      <ParentWrapper data={props} />
    </EntityWrapper>
  )
}

export { Deck }