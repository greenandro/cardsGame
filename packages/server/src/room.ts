import { Client, Room as colRoom } from "colyseus"
import { logs } from "./logs"
import { CommandsManager } from "./commandsManager"
import { State } from "./state"
import { IEntity, isInteractive } from "./traits/entity"
import { map2Array, mapAdd, mapRemoveEntry } from "@cardsgame/utils"
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"
import chalk from "chalk"

export class Room<S extends State> extends colRoom<S> {
  name = "CardsGame test"

  commandsManager: CommandsManager

  possibleActions: ActionsSet

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager(this.possibleActions)

    this.onSetupGame(options)
  }

  requestJoin(options: any, isRoomNew?: boolean): boolean | number {
    // TODO: private rooms?
    // TODO: reject on maxClients reached?
    // TODO: this.state.isGameStarted
    return true
  }

  onJoin(newClient: Client) {
    // If not on the list already
    if (
      map2Array(this.state.clients).every(clientID => newClient.id !== clientID)
    ) {
      mapAdd(this.state.clients, newClient.id)
    }
    logs.log("onJoin", `client "${newClient.id}" joined`)
  }

  onLeave(client: Client, consented: boolean) {
    if (consented) {
      mapRemoveEntry(this.state.clients, client.id)
      logs.log("onLeave", `client "${client.id}" left permamently`)
    } else {
      logs.log("onLeave", `client "${client.id}" disconnected, might be back`)
    }
  }

  onMessage(client: Client, event: PlayerEvent) {
    if (event.data === "start" && !this.state.isGameStarted) {
      Object.keys(this.state.clients).forEach((key, idx) => {
        this.state.players[idx] = new Player({
          state: this.state,
          clientID: this.state.clients[key]
        })
      })
      this.state.currentPlayerIdx = 0
      this.onStartGame(this.state)
      return
    } else if (event.data === "start" && this.state.isGameStarted) {
      logs.log("onMessage", `Game is already started, ignoring...`)
      return
    }

    // Populate event with server-side known data
    const newEvent: ServerPlayerEvent = { ...event }
    if (newEvent.entityPath) {
      // Make sure
      newEvent.entities = this.state
        .getEntitiesAlongPath(newEvent.entityPath)
        .reverse()
        .filter(target => isInteractive(target))
      newEvent.entity = newEvent.entities[0]
    }

    const player = map2Array<Player>(this.state.players).find(
      p => p.clientID === client.id
    )
    if (!player) {
      logs.error("onMessage", `You're not a player, get out!`)
      return
    }
    newEvent.player = player

    debugLogMessage(newEvent)

    this.commandsManager
      .action(this.state, client, newEvent)
      .then(data => logs.log(`action() completed`, data))
      .catch(error => logs.error(`action() failed`, error))
  }

  /**
   * Will be called right after the game room is created.
   * Prepare your play area now.
   * @param state
   */
  onSetupGame(options: any = {}) {
    logs.error("Room", `onSetupGame is not implemented!`)
  }

  /**
   * Will be called when players agree to start the game.
   * Now is the time to for example deal cards to all players.
   * @param state
   */
  onStartGame(state: State) {
    logs.error("Room", `onStartGame is not implemented!`)
  }
}

const debugLogMessage = newEvent => {
  const minifyTarget = (e: IEntity) => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player) => {
    return `${p.name}[${p.clientID}]`
  }
  const logObj = Object.assign(
    { ...newEvent },
    newEvent.entity ? { entity: minifyTarget(newEvent.entity) } : {},
    newEvent.entities ? { entities: newEvent.entities.map(minifyTarget) } : {}
  )

  const entity = minifyTarget(newEvent.entity)
  const entities = newEvent.entities.map(minifyTarget).join(", ")
  const entityPath = chalk.green(newEvent.entityPath.join(", "))

  const { command, event } = newEvent

  logs.info(
    "onMessage",
    [
      `Player: ${minifyPlayer(newEvent.player)} | `,
      chalk.white.bold(command),
      ` "${chalk.yellow(event)}"`,
      `\n\tpath: [${entityPath}], `,
      entity ? ` entity:"${entity}"` : "",
      entities ? ` (${entities})` : ""
    ].join("")
  )
}

export type EntityProps = {
  [key: string]: boolean | string | number | string[] | number[] | EntityProps
  name?: string | string[]
  type?: string | string[]
  value?: number | number[]
  rank?: string | string[]
  suit?: string | string[]
  parent?: EntityProps
}

export type InteractionDefinition = EntityProps & {
  command?: string
  event?: string
}
