
function SVGDrawPath(path, options) {
	options = options || {};
	var duration = options.duration || 5000;
	var easing = options.easing || 'ease-in-out';
	var reverse = options.reverse || false;
	var undraw = options.undraw || false;
	var callback = options.callback || function () {};
	var length = options.length || path.getTotalLength();
	var delay = options.delay || 0;

	if( delay > 0 ) {
		undraw = true;
		duration = 1;
		setTimeout(function() {
			options.delay = 0;

			SVGDrawPath(path, options);
		}, delay);
	}

	var dashOffsetStates = [length, 0];
	if (reverse) {
		dashOffsetStates = [length, 2 * length];
	}
	if (undraw) {
		dashOffsetStates.reverse();
	}

	// Clear any previous transition
	path.style.transition = path.style.WebkitTransition = 'none';

	var dashArray = path.style.strokeDasharray || path.getAttribute('stroke-dasharray');

	if( dashArray ) {
		var dashLength = dashArray.split(/[\s,]/).map(function (a) {
			return parseFloat(a) || 0;
		}).reduce(function (a, b) {
			return a + b;
		});
		var dashCount = length / dashLength + 1;
		var a = new Array(Math.ceil(dashCount)).join(dashArray + ' ');
		path.style.strokeDasharray = a + '0' + ' ' + length;
	}
	else {
		path.style.strokeDasharray = length + ' ' + length;
	}

	path.style.strokeDashoffset = dashOffsetStates[0];
	path.getBoundingClientRect();
	path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + duration + 'ms ' + easing;
	path.style.strokeDashoffset = dashOffsetStates[1];
}

window.addEventListener('load', function() {
	var line = document.querySelector('#line1-line');
	var arrow = document.querySelector('#line1-arrow');
	var origami = document.querySelector('#origami');

	SVGDrawPath(line, { duration: 2000 });
	SVGDrawPath(arrow, {
		delay: 2000,
		duration: 200
	});

	SVGDrawPath(origami, { duration: 5000 });
});
