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

    class Player {
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
      ['-', '-', '-', '-', '-', '-', '-',],
      ['-', ' ', ' ', ' ', ' ', ' ', '-',],
      ['-', ' ', '-', ' ', '-', ' ', '-',],
      ['-', ' ', ' ', ' ', ' ', ' ', '-',],
      ['-', ' ', '-', ' ', '-', ' ', '-',],
      ['-', ' ', ' ', ' ', ' ', ' ', '-',],
      ['-', '-', '-', '-', '-', '-', '-',],
    ]

    const boundaries = []
    const pacman = new Player({
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

    function playerCollidesWithBoundary({ player, boundary }) {
      return (
        (player.position.y - player.radius + player.velocity.y <= boundary.position.y + boundary.height)
        && (player.position.x + player.radius + player.velocity.x >= boundary.position.x)
        && (player.position.y + player.radius + player.velocity.y >= boundary.position.y)
        && (player.position.x - player.radius + player.velocity.x <= boundary.position.x + boundary.width)
      )
    }

    function setVelocity(direction) {
      let axis, velocity, xVelocity = 0, yVelocity = 0
      switch (direction) {
        case 'up':
          axis = -1
          velocity = yVelocity = 5 * axis
          break
        case 'left':
          axis = -1
          velocity = xVelocity = 5 * axis
          break
        case 'down':
          axis = 1
          velocity = yVelocity = 5 * axis
          break
        case 'right':
          axis = 1
          velocity = xVelocity = 5 * axis
          break
        default:
          return
      }
      for (let boundary of boundaries) {
        if (playerCollidesWithBoundary({ player: { ...pacman, velocity: { x: xVelocity, y: yVelocity } }, boundary: boundary })) {
          velocity = 0
          break
        }
      }
      return velocity
    }

    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      switch (true) {
        case keys.w.pressed && lastKey === 'w':
          pacman.velocity.y = setVelocity('up')
          break
        case keys.a.pressed && lastKey === 'a':
          pacman.velocity.x = setVelocity('left')
          break
        case keys.s.pressed && lastKey === 's':
          pacman.velocity.y = setVelocity('down')
          break
        case keys.d.pressed && lastKey === 'd':
          pacman.velocity.x = setVelocity('right')
          break
        default:
          break
      }

      boundaries.forEach((boundary) => {
        boundary.draw()

        if (playerCollidesWithBoundary({ player: pacman, boundary: boundary })) {
          console.log('collision with boundary')
          pacman.velocity.x = 0
          pacman.velocity.y = 0
        }
      })

      pacman.update()
      // pacman.velocity.y = 0
      // pacman.velocity.x = 0



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