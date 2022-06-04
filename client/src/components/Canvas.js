import React, { useState, useEffect, useRef } from "react"

const Canvas = () => {
  // const [counter, setCounter] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const cxt = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Boundary {
      static width = 40
      static height = 40

      constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
      }

      draw() {
        cxt.fillStyle = 'blue'
        cxt.fillRect(this.position.x, this.position.y, this.width, this.height)
      }
    }

    const map = [
      ['-', '-', '-', '-', '-', '-',],
      ['-', ' ', ' ', ' ', ' ', '-',],
      ['-', ' ', '-', '-', ' ', '-',],
      ['-', ' ', ' ', ' ', ' ', '-',],
      ['-', '-', '-', '-', '-', '-',],
    ]

    const boundaries = []

    map.forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch(symbol) {
          case '-':
            boundaries.push(new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              }
            }))
            break
        }
      })
    })

    boundaries.forEach((boundary) => {
      boundary.draw()
    })
  }, [])

  return (
    <canvas ref={canvasRef} />
  )
}

export default Canvas