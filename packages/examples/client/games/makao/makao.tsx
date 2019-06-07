import React, { FunctionComponent, useState, useEffect, Fragment } from "react"
import { Game } from "@cardsgame/client"
import { RankPicker } from "../rankPicker"
import { Button } from "../../components/button/button"
import { SuitPicker } from "../suitPicker"
import { IGameState } from "../../app"

interface MakaoGameUIProps {
  gameRef: Game
  gameState: IMakaoGameState
}

export const MakaoGameUI: FunctionComponent<MakaoGameUIProps> = props => {
  const gameState = props.gameState
  const game = props.gameRef

  // const [rankPickerActive, setRankPickerActive] = useState(false)
  // const [suitPickerActive, setSuitPickerActive] = useState(false)

  useEffect(() => {
    // game.client.id
  }, [])

  const children = []

  // if (gameState.ui.rankPicker === game.client.id) {
  //   children.push(
  //     <RankPicker
  //       key="RankPicker"
  //       handleRankChosen={value => {
  //         props.gameRef.send({ data: { type: "UI.button" } })
  //       }}
  //     />
  //   )
  // }
  if (gameState) {
    if (gameState.ui && gameState.ui.suitPicker === game.client.id) {
      children.push(
        <SuitPicker
          key="SuitPicker"
          handleSuitChosen={value => {
            props.gameRef.send({ command: "requestSuit", data: value })
          }}
        />
      )
    }
    if (gameState.skipPoints > 0 && gameState) {
      const sendPass = () => {
        props.gameRef.send({})
      }
      children.push(
        <Button key="PassButton" onClick={sendPass}>
          PASS
        </Button>
      )
    }
    if (gameState.requestedSuit) {
      children.push(
        <p key="requestedSuit">
          Requested suit is now {gameState.requestedSuit}!
        </p>
      )
    }
    if (gameState.requestedRank) {
      children.push(
        <p key="requestedRank">
          Requested rank is now {gameState.requestedRank}!
        </p>
      )
    }
  }
  return (
    <div className="gameUI">
      <p>MakaoUI</p>
      {...children}
    </div>
  )
}

export interface IMakaoGameState extends IGameState {
  atackPoints?: number
  skipPoints?: number
  requestedSuit?: string
  requestedRank?: string
  turnSkips?: {
    [key: string]: number
  }
  ui?: {
    [key: string]: string
    suitPicker?: string
    rankPicker?: string
  }
}