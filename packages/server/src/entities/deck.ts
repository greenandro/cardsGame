import { IEntity, IEntityOptions, EntityConstructor } from "../traits/entity"
import { Schema, type } from "@colyseus/schema"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"

@canBeChild
@containsChildren(false)
export class Deck extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isParent(): this is IParent {
    return true
  }

  @type("string")
  ownerID: string

  @type("boolean")
  isInOwnersView: boolean

  @type("uint8")
  idx: number

  @type("string")
  type = "deck"
  @type("string")
  name = "Deck"

  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = true

  // ================

  @type("uint16")
  childCount: number = 0

  // TODO: deck may display its topmost card, if it's `faceUp`

  onChildAdded(child: IEntity) {
    this.childCount++
  }
  onChildRemoved(idx: number) {
    this.childCount--
  }

  constructor(options: IEntityOptions) {
    super()
    ParentConstructor(this)
    EntityConstructor(this, options)
  }
}
