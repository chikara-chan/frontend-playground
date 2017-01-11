const canvas = document.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	leftColor = '#98f',
	rightColor = '#4e88b4',
	totalPoints = 6,
	threshold = 200,
	viscosity = 10,
	damping = 0.1
let timer, mouseTimer, points, gutter,
	mouseX = 0,
	mouseY = 0,
	lastMouseX = 0,
	lastMouseY = 0,
	mouseVelX = 0,
	mouseVelY = 0,
	mouseDirectionX = 'none'

class Point {
    constructor(x, y) {
        this.x = x
        this.originX = x
        this.velX = 0
        this.y = y
        this.originY = y
    }

    update() {
        var distanceX = this.x - mouseX,
            distanceY = this.y - mouseY

        this.velX += (this.originX - this.x) / viscosity
        if (mouseDirectionX === 'right' && mouseX > this.x || mouseDirectionX === 'left' && mouseX < this.x) {
            if (Math.abs(distanceX) < threshold && Math.abs(distanceY) < gutter) {
                this.velX = mouseVelX / 2
            }
        }
        this.velX *= 1 - damping
        this.x += this.velX
    }
}

function init() {
	initCanvas()
	bindEvents()
}

function initCanvas() {
	let i

	cancelAnimationFrame(timer)
	cancelAnimationFrame(mouseTimer)
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	points = []
	gutter = canvas.height / (totalPoints - 1)
	for (i = 0; i < totalPoints; i++) {
		points.push(new Point(canvas.width / 2, i * gutter))
	}
	updateMouseDirection()
	update()
}

function update() {
    points.forEach(point => {
        point.update()
    })
	draw()
	timer = requestAnimationFrame(update)
}

function draw() {
	let midx, midy, i

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = leftColor
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = rightColor
	ctx.beginPath()
	ctx.moveTo(canvas.width / 2, 0)
	for (i in points) {
		if (+i !== points.length - 1) {
			midx = (points[i].x + points[+i + 1].x) / 2
			midy = (points[i].y + points[+i + 1].y) / 2
		} else {
			midx = points[i].originX
			midy = points[i].originY
		}
		ctx.quadraticCurveTo(points[i].x, points[i].y, midx, midy)
	}
	ctx.lineTo(canvas.width, canvas.height)
	ctx.lineTo(canvas.width, 0)
	ctx.fill()
}

function mousemove(e) {
	if (mouseX !== 0) {
		mouseVelX = e.pageX - mouseX
		mouseVelY = e.pageY - mouseY
	}
	mouseX = e.pageX
	mouseY = e.pageY
}

function updateMouseDirection() {
	if (mouseX < lastMouseX) {
		mouseDirectionX = 'left'
	} else if (mouseX > lastMouseX) {
		mouseDirectionX = 'right'
	} else {
		mouseDirectionX = 'none'
	}
	lastMouseX = mouseX
	lastMouseY = mouseY
	mouseTimer = requestAnimationFrame(updateMouseDirection)
}

function bindEvents() {
	window.addEventListener('resize', initCanvas)
	window.addEventListener('mousemove', mousemove)
}

init()
