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

function Bird(gameHeight) {
    let flying = false
    this.element = newElement('img', 'bird')
    this.element.src = 'img/horus.png'
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }
    this.setY(gameHeight / 2)
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


function Bars(height, width, opening, gap, notifyScore) {
    this.pairs = [
        new BarPair(height, opening, width),
        new BarPair(height, opening, width + gap),
        new BarPair(height, opening, width + gap * 2),
        new BarPair(height, opening, width + gap * 3),
    ]

    const movement = 3;
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - movement)

            //quando o elemento sair da area do jogo
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + gap * this.pairs.length)
                pair.getSpacing()
            }

            const between = width / 2
            const crossBetween = pair.getX() + movement >= between
                && pair.getX() < between;
            if (crossBetween) notifyScore();
        });
    }
}


function isOver(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

function colided(bird, bars) {
    let colided = false
    bars.pairs.forEach(barPairs => {
        if(!colided) {
            const superior = barPairs.superior.element
            const inferior = barPairs.inferior.element
            colided = isOver(bird.element, superior)
                || isOver(bird.element, inferior)
        }
    })
    return colided
}

function Horus() {
    let score = 0
    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth
    const bird = new Bird(height)
    const progress = new Progress()
    // const b = new BarPair(height, 200, 400)
    // document.querySelector('[wm-flappy]').appendChild(b.element)
    const bars = new Bars(height, width, 200, 400,
        () => progress.updateScore(++score))
        
    gameArea.appendChild(bird.element)
    gameArea.appendChild(progress.element)
    bars.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        // loop do jogo
        const timer = setInterval(() => {
            bars.animate()
            bird.animate()

            if(colided(bird, bars)) {
                clearInterval(timer)
            }
        }, 20)
    }
}
new Horus().start()