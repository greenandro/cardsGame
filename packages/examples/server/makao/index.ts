import chalk from "chalk"
import {
  ActionTemplate,
  Room,
  Player,
  Hand,
  Pile,
  Deck,
  ClassicCard,
  commands,
  logs,
  getTop,
  standardDeckFactory
} from "@cardsgame/server"

import { MakaoState } from "./state"
import {
  DrawCards,
  Atack23,
  AtackKing,
  PlaySkipTurn,
  PlayNormalCards,
  DeselectCard,
  SelectCard,
  PlayAce,
  RequestSuit
} from "./actions"
import { MapSchema } from "@colyseus/schema"
import { map2Array } from "../../../utils/lib"

export class MakaoRoom extends Room<MakaoState> {
  name = "Makao"

  // Order of definition matters.
  possibleActions = new Set<ActionTemplate>([
    // UI related actions
    RequestSuit,

    // Entity-related actions
    SelectCard,
    DeselectCard,
    DrawCards,
    Atack23,
    AtackKing,
    PlaySkipTurn,
    PlayAce,
    PlayNormalCards
  ])

  onSetupGame(options: any = {}) {
    this.setState(
      new MakaoState({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    const { state } = this
    logs.info("Makao", `setting up the game`)
    state.atackPoints = 0
    state.skipPoints = 0
    state.turnSkips = new MapSchema<number>()

    // Prepare deck of cards and main pile
    state.pile = new Pile({
      state,
      name: "mainPile",
      x: -60
    })

    state.deck = new Deck({
      state,
      name: "mainDeck",
      x: 60
    })
    standardDeckFactory().forEach(data => {
      new ClassicCard({
        state,
        parent: state.deck.id,
        suit: data.suit,
        rank: data.rank,
        faceUp: false
      })
    })

    // FIXME: this is probably important
    // state.on(MakaoState.events.playerTurnStarted, () => {
    //   const current = state.currentPlayer.clientID

    //   // [4] Check turn skips, if this player should keep on waiting
    //   if (state.turnSkips[current] > 0) {
    //     state.turnSkips[current]--
    //     this.commandsManager.execute(state, new commands.NextPlayer())
    //   }
    // })
  }

  onStartGame() {
    const { state } = this
    map2Array<Player>(state.players).forEach(
      pd => (state.turnSkips[pd.clientID] = 0)
    )

    const handSorting = (childA: ClassicCard, childB: ClassicCard): number => {
      const suits = {
        S: 400,
        H: 300,
        D: 200,
        C: 100
      }
      const ranks = {
        A: 14,
        K: 13,
        Q: 12,
        J: 11
      }

      const childAScore =
        suits[childA.suit] + (ranks[childA.rank] || Number(childA.rank))
      const childBScore =
        suits[childB.suit] + (ranks[childB.rank] || Number(childB.rank))
      logs.log(
        `\thandSorting`,
        `childA[${chalk.yellow(childA.name)}] =`,
        childAScore,
        `childB[${chalk.yellow(childB.name)}] =`,
        childBScore
      )
      return childAScore - childBScore
    }

    // Temp container for picking/ordering cards.
    map2Array<Player>(state.players)
      // .map(data => state.getEntity(data.entityID))
      .forEach((player: Player) => {
        new Hand({
          state,
          y: -80,
          name: "chosenCards"
          // parent: player.id
        })
      })

    // Hands of each player
    const playersHands = map2Array<Player>(state.players).map(
      (player: Player) =>
        new Hand({
          state,
          autoSort: handSorting,
          name: "playersHand"
          // parent: player.id
        })
    )

    new commands.ShuffleChildren(state.deck).execute(state)
    new commands.DealCards(state.deck, playersHands, 3).execute(state)
    new commands.ChangeParent(
      getTop(state.deck),
      state.deck,
      state.pile
    ).execute(state)
    new commands.Flip(getTop<ClassicCard>(state.pile)).execute(state)

    // debug, all players get aces
    // playersHands
    //   .map(() => [
    //     new ClassicCard({ state, suit: "D", rank: "A", parent: state.deck }),
    //     new ClassicCard({ state, suit: "H", rank: "A", parent: state.deck }),
    //     new ClassicCard({ state, suit: "C", rank: "A", parent: state.deck }),
    //     new ClassicCard({ state, suit: "S", rank: "A", parent: state.deck })
    //   ])
    //   .reduce((prev, next) => {
    //     prev.push(...next)
    //     return prev
    //   }, [])
    // new commands.DealCards(state.deck, playersHands, 1, 4).execute(state)

    logs.info("Final state HELLO")
    state.logTreeState()
  }
}
