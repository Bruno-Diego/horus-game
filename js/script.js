// Function structure to create a new HTML element for any function
function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className 
    return elem
}

function Progress() {
    this.element = newElement('span', 'progress')
    this.updateScore = score => {
        this.element.innerHTML = score
    }
    this.updateScore(0)
}

function Bird(heightGame) {
    let voando = false
    this.element = newElement('img', 'bird')
    this.element.src = 'img/horus.png'
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    // window.onkeydown = e => voando = true
    // window.onkeyup = e => voando = false

    // this.animar = () => {
    //     const novoY = this.getY() + (voando ? 8 : -5)
    //     const alturaMaxima = alturaJogo - this.element.clientHeight

    //     if (novoY <= 0) {
    //         this.setY(0)
    //     } else if (novoY >= alturaMaxima) {
    //         this.setY(alturaMaxima)
    //     } else {
    //         this.setY(novoY)
    //     }
    // }
    // this.setY(alturaJogo / 2)
}

function Bar(reverse = false) {
    this.element = newElement('div', 'bar')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')

    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}


function BarPair(height, spacing, x) {
    this.element = newElement('div', 'bar-pair')

    this.superior = new Bar(true)
    this.inferior = new Bar(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.getSpacing = () => {
        const superiorHeight = Math.random() * (height - spacing)
        const inferiorHeight = height - spacing - superiorHeight
        this.superior.setHeight(superiorHeight)
        this.inferior.setHeight(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.getSpacing()
    this.setX(x)
}

function Horus() {
    let score = 0
    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth
    const bird = new Bird(height)
    const progress = new Progress()
    gameArea.appendChild(bird.element)
    gameArea.appendChild(progress.element)

    const b = new BarPair(500, 200, 400)
    document.querySelector('[wm-flappy]').appendChild(b.element)
}
new Horus()