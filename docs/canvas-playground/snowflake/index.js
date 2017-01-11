const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    deep = 2
let timer,
    lastGenerateDate = 0,
    triangles = []

class Triangle {
    constructor(x, y, side) {
        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0
        this.x3 = 0
        this.y3 = 0
        this.x = x
        this.y = y
        this.side = side
        this.velX = 0
        this.velY = 0.1
        this.accX = 0
        this.accY = 0
        this.update()
    }

    update() {
        this.accX = -0.05 + Math.random() * 0.1
        if (this.accY < 0.15) {
            this.accY = Math.random() * 0.005
        }
        this.velX += this.accX
        this.velY += this.accY
        this.x += this.velX
        this.y += this.velY
        this.updateVertex()
    }

    updateVertex() {
        this.x1 = this.x
        this.y1 = this.y - this.side * Math.sqrt(3) / 2 + this.side * Math.tan(Math.PI / 12) / 2
        this.x2 = this.x + this.side / 2
        this.y2 = this.y + this.side * Math.tan(Math.PI / 12) / 2
        this.x3 = this.x - this.side / 2
        this.y3 = this.y + this.side * Math.tan(Math.PI / 12) / 2
    }

    draw() {
        ctx.beginPath()
        kontsevich(this.x1, this.y1, this.x2, this.y2, 1, deep)
        kontsevich(this.x2, this.y2, this.x3, this.y3, 1, deep)
        kontsevich(this.x3, this.y3, this.x1, this.y1, 1, deep)
        ctx.stroke()
    }
}
/**
 * Kontsevich's formula
 * @param  {Number} x1
 * @param  {Number} y1
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} level
 * @param  {Number} deep
 */
function kontsevich(x1, y1, x2, y2, level, deep) {
    const x3 = (x2 - x1) / 3 + x1,
        y3 = (y2 - y1) / 3 + y1,
        x4 = x3 + ((x2 - x1) - (y2 - y1) * Math.sqrt(3)) / 6,
        y4 = y3 + ((x2 - x1) * Math.sqrt(3) + (y2 - y1)) / 6,
        x5 = (x2 - x1) / 3 * 2 + x1,
        y5 = (y2 - y1) / 3 * 2 + y1

    if (level === deep) {
        ctx.moveTo(x1, y1)
        ctx.lineTo(x3, y3)
        ctx.lineTo(x4, y4)
        ctx.lineTo(x5, y5)
        ctx.lineTo(x2, y2)
    } else {
        level++
        kontsevich(x1, y1, x3, y3, level, deep)
        kontsevich(x3, y3, x4, y4, level, deep)
        kontsevich(x4, y4, x5, y5, level, deep)
        kontsevich(x5, y5, x2, y2, level, deep)
    }

}

function init() {
    initCanvas()
    bindEvents()
}

function initCanvas() {
    cancelAnimationFrame(timer)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    update()

}

function update() {
    if (new Date() - lastGenerateDate > 150) {
        triangles.push(new Triangle(25 + Math.random() * (canvas.width - 50), -20, 10 + Math.random() * 20))
        lastGenerateDate = new Date()
    }
    triangles = triangles.filter(triangle => triangle.y < canvas.height + triangle.side)
    triangles.forEach(triangle => {
        triangle.update()
    })
    draw()
    timer = requestAnimationFrame(update)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    triangles.forEach(triangle => {
        triangle.draw()
    })
}

function bindEvents() {
    window.addEventListener('resize', initCanvas)
}

init()
