import { IEntity } from "./entities/entity"
import { def } from "@cardsgame/utils"
import { type, Schema } from "@colyseus/schema"
import { State } from "./state"

// TODO: Player shouldn't be on the scene, he's not an object of play
//       Player's pawns could be placed on the board, outside of his domain...
export class Player extends Schema {
  @type("string")
  clientID: string
  @type("string")
  name: string

  @type("number")
  score: number = 0

  @type("number")
  timeLeft: number = -1

  _state: State

  // _selectedEntities = new Set<IEntity>()

  // @type("int8")
  // selectedEntitiesCount: number

  constructor(options: IPlayerOptions) {
    super()
    this._state = options.state
    this.clientID = options.clientID
    this.name = def(options.name, getRandomName())
  }
}

export interface IPlayerOptions {
  state: State
  clientID: string
  name: string
}

// Event from client, with stuff auto filled when comming to server
export type ServerPlayerEvent = PlayerEvent & {
  player?: Player
  entity?: IEntity
  entities?: IEntity[]
}

const randomPlayerNames = [
  "Bob",
  "Alicja",
  "Darek",
  "Pablo",
  "Witeck",
  "Pauline",
  "Karen",
  "Sandra",
  "Mat",
  "Gordon"
]
const getRandomName = (): string => {
  randomPlayerNames.sort(() => {
    return Math.floor(Math.random() * 3) - 1
  })
  return randomPlayerNames.pop()
}
