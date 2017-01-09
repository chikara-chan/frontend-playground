/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var canvas = document.querySelector('canvas'),
	    ctx = canvas.getContext('2d'),
	    leftColor = '#98f',
	    rightColor = '#4e88b4',
	    totalPoints = 6,
	    threshold = 200,
	    viscosity = 10,
	    damping = 0.1;

	var timer = void 0,
	    mouseTimer = void 0,
	    points = void 0,
	    gutter = void 0,
	    mouseX = 0,
	    mouseY = 0,
	    lastMouseX = 0,
	    lastMouseY = 0,
	    mouseVelX = 0,
	    mouseVelY = 0,
	    mouseDirectionX = 'none';

	function Point(x, y) {
		this.x = x;
		this.originX = x;
		this.velX = 0;
		this.y = y;
		this.originY = y;
	}

	Point.prototype.update = function () {
		var distanceX = this.x - mouseX,
		    distanceY = this.y - mouseY;

		this.velX += (this.originX - this.x) / viscosity;
		if (mouseDirectionX === 'right' && mouseX > this.x || mouseDirectionX === 'left' && mouseX < this.x) {
			if (Math.abs(distanceX) < threshold && Math.abs(distanceY) < gutter) {
				this.velX = mouseVelX / 2;
			}
		}
		this.velX *= 1 - damping;
		this.x += this.velX;
	};

	function init() {
		initCanvas();
		bindEvents();
	}

	function initCanvas() {
		var i = void 0;

		cancelAnimationFrame(timer);
		cancelAnimationFrame(mouseTimer);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		points = [];
		gutter = canvas.height / (totalPoints - 1);
		for (i = 0; i < totalPoints; i++) {
			points.push(new Point(canvas.width / 2, i * gutter));
		}
		updateMouseDirection();
		update();
	}

	function update() {
		var i = void 0;

		for (i in points) {
			points[i].update();
		}
		render();
		timer = requestAnimationFrame(update);
	}

	function render() {
		var midx = void 0,
		    midy = void 0,
		    i = void 0;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = leftColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = rightColor;
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		for (i in points) {
			if (+i !== points.length - 1) {
				midx = (points[i].x + points[+i + 1].x) / 2;
				midy = (points[i].y + points[+i + 1].y) / 2;
			} else {
				midx = points[i].originX;
				midy = points[i].originY;
			}
			ctx.quadraticCurveTo(points[i].x, points[i].y, midx, midy);
		}
		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(canvas.width, 0);
		ctx.fill();
	}

	function mousemove(e) {
		if (mouseX !== 0) {
			mouseVelX = e.pageX - mouseX;
			mouseVelY = e.pageY - mouseY;
		}
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	function updateMouseDirection() {
		if (mouseX < lastMouseX) {
			mouseDirectionX = 'left';
		} else if (mouseX > lastMouseX) {
			mouseDirectionX = 'right';
		} else {
			mouseDirectionX = 'none';
		}
		lastMouseX = mouseX;
		lastMouseY = mouseY;
		mouseTimer = requestAnimationFrame(updateMouseDirection);
	}

	function bindEvents() {
		window.addEventListener('resize', initCanvas);
		window.addEventListener('mousemove', mousemove);
	}

	init();

/***/ }
/******/ ]);