{

  let canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pacman: Player,
    scoreBoard: HTMLSpanElement

  const ghosts: Ghost[] = []

  /* Before drawing anything, make sure the DOM (HTML) finished loading to avoid any related errors. */
  function init() {
    canvas = document.getElementById('pac-maze') as HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) return
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    scoreBoard = document.getElementById('score-board') as HTMLSpanElement
    if(!(scoreBoard instanceof HTMLSpanElement)) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    pacman = new Player({
      position: {
        x: Boundary.width + (Boundary.width / 2),
        y: Boundary.height + (Boundary.height / 2)
      },
      velocity: {
        x: 0,
        y: 0
      }
    })

    ghosts.push(
      new Ghost({
        position: {
          x: Boundary.width * 6 + Boundary.width / 2,
          y: Boundary.height + Boundary.height / 2
        },
        velocity: {
          x: Ghost.speed,
          y: 0
        }
      }),
      new Ghost({
        position: {
          x: Boundary.width * 6 + Boundary.width / 2,
          y: Boundary.height * 3 + Boundary.height / 2
        },
        velocity: {
          x: Ghost.speed,
          y: 0
        },
        color: 'pink'
      })
    )

    animate()
  }

  document.addEventListener('DOMContentLoaded', init)

  class Boundary {
    static width = 40
    static height = 40

    constructor({ position: {}, image: {} }) {
      this.position = position
      this.width = 40
      this.height = 40
      this.image = image
    }

    draw() {
      ctx.drawImage(this.image, this.position.x, this.position.y)
    }
  }

  class Player {
    constructor({ position: {}, velocity: {} }) {
      this.position = position
      this.velocity = velocity
      this.radius = 15
      this.radians = 0.75
      this.openRate = 0.12
      this.rotation = 0
    }

    // use of save() and restore() so that the global funtion does not affect everything on the screen
    draw() {
      ctx.save()
      ctx.translate(this.position.x, this.position.y)
      ctx.rotate(this.rotation)

      // after rotating Pacman, move the canvas back into position
      ctx.translate(-this.position.x, -this.position.y)
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
      ctx.lineTo(this.position.x, this.position.y)
      ctx.fillStyle = 'yellow'
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }

    update() {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      if (this.radians < 0 || this.radians > 0.75) {
        this.openRate = -this.openRate
      }

      this.radians += this.openRate
    }
  }

  class Ghost {
    static speed = 2
    constructor({ position: {}, velocity: {}, color = 'red' }) {
      this.position = position
      this.velocity = velocity
      this.radius = 15
      this.color = color
      this.prevCollisions = []
      this.speed = 2
      this.scared = false
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.scared ? 'blue' : this.color
      ctx.fill()
      ctx.closePath()
    }

    update() {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }

  class Pellet {
    constructor({ position: {} }) {
      this.position = position
      this.radius = 3
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.closePath()
    }
  }

  class PowerUp {
    constructor({ position: {} }) {
      this.position = position
      this.radius = 8
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.closePath()
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
  let score = 0


  const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

  const pellets: Pellet[] = []
  const boundaries: Boundary[] = []
  const powerups: PowerUp[] = []

  function createImage(src) {
    const image = new Image()
    image.src = src

    return image
  }


  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('../assets/img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('../assets/img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('../assets/img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('../assets/img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('../assets/img/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
        case 'p':
          powerups.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
      }
    })
  })

  function playerCollidesWithBoundary({ player, boundary }) {
    const padding = Boundary.width / 2 - player.radius - 1
    return (
      (player.position.y - player.radius + player.velocity.y <= boundary.position.y + boundary.height + padding)
      && (player.position.x + player.radius + player.velocity.x >= boundary.position.x - padding)
      && (player.position.y + player.radius + player.velocity.y >= boundary.position.y - padding)
      && (player.position.x - player.radius + player.velocity.x <= boundary.position.x + boundary.width + padding)
    )
  }

  function setVelocity(direction: string) {
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

  let animationId

  const animate = () => {
    animationId = requestAnimationFrame(animate)
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
        pacman.velocity.x = 0
        pacman.velocity.y = 0
      }
    })

    // detect collision between Ghost and Player
    function ghostCollidesWithPlayer(ghost) {
      return (
        Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y)
        < ghost.radius + pacman.radius
      )
    }

    for (let i = ghosts.length - 1; i >= 0; i--) {
      const ghost = ghosts[i]
      // Ghost collides with Player
      if (ghostCollidesWithPlayer(ghost))
        if (ghost.scared) { ghosts.splice(i, 1) }

        else {
          cancelAnimationFrame(animationId)
        }
    }

    // win condition
    if (pellets.length === 0) {
      console.log('you win')
      cancelAnimationFrame(animationId)
    }


    // where PowerUps go
    for (let i = powerups.length - 1; i >= 0; i--) {
      const powerUp = powerups[i]
      powerUp.draw()

      // Player collides with PowerUp
      if (Math.hypot(powerUp.position.x - pacman.position.x, powerUp.position.y - pacman.position.y) < powerUp.radius + pacman.radius) {

        powerups.splice(i, 1)

        // make ghosts scared
        ghosts.forEach((ghost) => {
          ghost.scared = true

          setTimeout(_ => {
            ghost.scared = false
            console.log(ghost.scared)
          }, 5000)
        })
      }
    }

    // Pacman touches a pellet here
    for (let i = pellets.length - 1; i >= 0; i--) {
      const pellet = pellets[i]
      pellet.draw()

      if (Math.hypot(pellet.position.x - pacman.position.x, pellet.position.y - pacman.position.y) < pellet.radius + pacman.radius) {

        pellets.splice(i, 1)
        score += 10
        scoreBoard.innerHTML = score
      }
    }



    pacman.update()

    ghosts.forEach((ghost) => {
      ghost.update()



      const collisions: string[] = []

      boundaries.forEach((boundary) => {
        if (!collisions.includes('up') && playerCollidesWithBoundary({ player: { ...ghost, velocity: { x: 0, y: -ghost.speed } }, boundary: boundary })) {
          collisions.push('up')
        }
        if (!collisions.includes('left') && playerCollidesWithBoundary({ player: { ...ghost, velocity: { x: -ghost.speed, y: 0 } }, boundary: boundary })) {
          collisions.push('left')
        }
        if (!collisions.includes('down') && playerCollidesWithBoundary({ player: { ...ghost, velocity: { x: 0, y: ghost.speed } }, boundary: boundary })) {
          collisions.push('down')
        }
        if (!collisions.includes('right') && playerCollidesWithBoundary({ player: { ...ghost, velocity: { x: ghost.speed, y: 0 } }, boundary: boundary })) {
          collisions.push('right')
        }
      })

      if (collisions.length > ghost.prevCollisions.length) {
        ghost.prevCollisions = collisions
      }

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        // console.log('gogo')

        if (ghost.velocity.x > 0) {
          ghost.prevCollisions.push('right')
        } else if (ghost.velocity.x < 0) {
          ghost.prevCollisions.push('left')
        } else if (ghost.velocity.y < 0) {
          ghost.prevCollisions.push('up')
        } else if (ghost.velocity.y > 0) {
          ghost.prevCollisions.push('down')
        }
        const pathways = ghost.prevCollisions.filter(collision => {
          return !collisions.includes(collision)
        })


        // get a random pathway for the Ghost
        const direction = pathways[Math.floor(Math.random() * pathways.length)]
        // console.log(pathways)

        switch (direction) {
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break
          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break
          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break
          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break
          default:
            break
        }
        ghost.prevCollisions = []
      }
    })

    if (pacman.velocity.x > 0) { pacman.rotation = 0 }
    else if (pacman.velocity.x < 0) { pacman.rotation = Math.PI }
    else if (pacman.velocity.y > 0) { pacman.rotation = Math.PI / 2 }
    else if (pacman.velocity.y < 0) { pacman.rotation = Math.PI * 1.5 }
  }


  {/* Player properties will not be changed within EventListener as it may cause unwanted behavior */ }
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


}