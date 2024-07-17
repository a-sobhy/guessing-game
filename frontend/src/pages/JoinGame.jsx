import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { joinGame } from "../redux/features/playerSlice"

export const JoinGame = () => {
  const dispatch = useDispatch()
  const { gameStart } = useSelector((state) => state.player)
  const [name, setName] = useState("")

  useEffect(() => {
    console.log("gamestart", gameStart)
  }, [gameStart])

  const handleSubmitJoinGame = () => {
    dispatch(joinGame({ name }))
  }
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmitJoinGame}>Join</button>
    </>
  )
}
