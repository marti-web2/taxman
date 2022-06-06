; (function () {

  let canvas, ctx, pacman

  /* Before drawing anything, make sure the DOM (HTML) finished loading to avoid any related errors. */
  function init() {
    canvas = document.getElementById('pac-maze')
    ctx = canvas.getContext('2d')

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

    animate()
  }

  document.addEventListener('DOMContentLoaded', init)

  class Boundary {
    static width = 40
    static height = 40

    constructor({ position, image }) {
      this.position = position
      this.width = 40
      this.height = 40
      this.image = image
    }

    draw() {
      // ctx.fillStyle = 'blue'
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

      ctx.drawImage(this.image, this.position.x, this.position.y)

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

  class Pellet {
    constructor({ position }) {
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

  const pellets = []

  const boundaries = []

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

  const animate = () => {
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
        pacman.velocity.x = 0
        pacman.velocity.y = 0
      }
    })

    pellets.forEach((pellet) =>{
      pellet.draw()
    })


    pacman.update()
  }



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


})()