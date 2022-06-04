import React, { useState, useEffect, useRef } from "react"

const Canvas = () => {
  // const [counter, setCounter] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

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
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
      }
    }

    class Pacman {
      constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
      }

      update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
      }
    }

    const keys = {
      w: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    }

    let lastKey = ''

    const map = [
      ['-', '-', '-', '-', '-', '-',],
      ['-', ' ', ' ', ' ', ' ', '-',],
      ['-', ' ', '-', '-', ' ', '-',],
      ['-', ' ', ' ', ' ', ' ', '-',],
      ['-', '-', '-', '-', '-', '-',],
    ]

    const boundaries = []
    const pacman = new Pacman({
      position: {
        x: Boundary.width + (Boundary.width / 2),
        y: Boundary.height + (Boundary.height / 2)
      },
      velocity: {
        x: 0,
        y: 0
      }
    })

    map.forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch (symbol) {
          case '-':
            boundaries.push(new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              }
            }))
            break
          default:
            break
        }
      })
    })

    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0,0,canvas.width, canvas.height)
      boundaries.forEach((boundary) => {
        boundary.draw()
      })

      pacman.update()
      pacman.velocity.y = 0
      pacman.velocity.x = 0

      switch(true) {
        case keys.w.pressed && lastKey === 'w':
          pacman.velocity.y = -5
          break
        case keys.a.pressed && lastKey === 'a':
          pacman.velocity.x = -5
          break
        case keys.s.pressed && lastKey === 's':
          pacman.velocity.y = 5
          break
        case keys.d.pressed && lastKey === 'd':
          pacman.velocity.x = 5
          break
        default:
          break
      }

    }

    animate()
   
    window.addEventListener('keydown', ({ key }) => {
      switch (key) {
        case 'w':
          keys.w.pressed = true
          lastKey = 'w'
          break
        case 'a':
          keys.a.pressed = true
          lastKey = 'a'
          break
        case 's':
          keys.s.pressed = true
          lastKey = 's'
          break
        case 'd':
          keys.d.pressed = true
          lastKey = 'd'
          break
        default:
          break
      }
    })

    window.addEventListener('keyup', ({ key }) => {
      switch (key) {
        case 'w':
          keys.w.pressed = false
          break
        case 'a':
          keys.a.pressed = false
          break
        case 's':
          keys.s.pressed = false
          break
        case 'd':
          keys.d.pressed = false
          break
        default:
          break
      }
    })

  }, [])

  return (
    <canvas ref={canvasRef} />
  )
}

export default Canvas