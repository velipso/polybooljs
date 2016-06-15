/*
 * @copyright 2016 Sean Connelly (@voidqk), http://syntheti.cc
 * @license MIT
 * @preserve Project Home: https://github.com/voidqk/polybooljs
 */

var Epsilon = require('./lib/epsilon')
var Intersecter = require('./lib/intersecter');
var SegmentChainer = require('./lib/segment-chainer');
var SegmentSelector = require('./lib/segment-selector');

function calc(regions1, inverted1, regions2, inverted2, operations, epsilon, buildLog){
	// main algorithm
	//
	// this function is exposed as PolyBool.calculate(...)
	//
	// or you can use the single-use functions instead, PolyBool.union(...), etc -- see exported API
	// below in the PolyBool object
	//
	// each regionsX is a list of regions
	//   [ region1, region2, region3, ... ]
	// each region is a list of points
	//   [ [x1, y1], [x2, y2], [x3, y3], ... ]
	//
	// invertedX is a bool that says whether that region is inverted or not
	//
	// operations is a list of strings of the operations you want calculated...
	// to calculate everything, pass:
	//   [ 'union', 'intersect', 'difference', 'reverseDifference', 'xor' ]
	// or just remove the strings you don't want to waste time calculating
	//
	// epsilon is optional, but would specify what tolerance to use when performing calculations,
	// and should be a PolyBool.Epsilon object...
	// i.e., PolyBool.Epsilon(0.0001) says that `value` is zero when `Math.abs(value) < 0.0001`
	//
	// buildLog is optional, but would specify a PolyBool.BuildLog object that keeps track of the
	// processing of the different algorithms... only useful for inspection/debugging, or creating a
	// pretty animation :-)
	//
	// this function returns an object with the keys set to the result of the specified operation:
	//   {
	//     union: {       <-- only exists if 'union' was in operations list
	//       regions: [ region1, etc...],    list of regions in the result,
	//       inverted: true/false             bool whether the result polygon is inverted
	//     },
	//     intersect: {   <-- only exists if 'intersect' was in operations list, etc
	//       same as union, etc...
	//     },
	//     other operations...
	//   }

	var inverted = {
		union: inverted1 || inverted2,
		intersect: inverted1 && inverted2,
		difference: inverted1 && !inverted2,
		differenceRev: !inverted1 && inverted2,
		xor: inverted1 !== inverted2
	};
	if (operations.length <= 0)
		return {};
	operations.forEach(function(op){
		if (!inverted.hasOwnProperty(op))
			throw new Error('invalid PolyBool operation: ' + op);
	});

	epsilon = epsilon || Epsilon();

	var i1 = Intersecter(true, epsilon, buildLog);
	regions1.forEach(i1.addRegion);
	var s1 = i1.calculate(inverted1);

	var i2 = Intersecter(true, epsilon, buildLog);
	regions2.forEach(i2.addRegion);
	var s2 = i2.calculate(inverted2);

	if (buildLog)
		buildLog.reset();

	var i3 = Intersecter(false, epsilon, buildLog);
	var s3 = i3.calculate(s1, inverted1, s2, inverted2);

	var result = {};
	operations.forEach(function(op){
		var s4 = SegmentSelector[op](s3, buildLog);

		result[op] = {
			regions: SegmentChainer(s4, epsilon, buildLog),
			inverted: inverted[op]
		};
	});

	return result;
}

var PolyBool = {
	BuildLog: require('./lib/build-log'),
	Epsilon: Epsilon,
	Intersecter: Intersecter,
	SegmentChainer: SegmentChainer,
	SegmentSelector: SegmentSelector,

	// basic operations for common cases
	union: function(regions1, inverted1, regions2, inverted2, epsilon, buildLog){
		return calc(
			regions1, inverted1,
			regions2, inverted2,
			['union'],
			epsilon, buildLog
		).union;
	},
	intersect: function(regions1, inverted1, regions2, inverted2, epsilon, buildLog){
		return calc(
			regions1, inverted1,
			regions2, inverted2,
			['intersect'],
			epsilon, buildLog
		).intersect;
	},
	difference: function(regions1, inverted1, regions2, inverted2, epsilon, buildLog){
		return calc(
			regions1, inverted1,
			regions2, inverted2,
			['difference'],
			epsilon, buildLog
		).difference;
	},
	differenceRev: function(regions1, inverted1, regions2, inverted2, epsilon, buildLog){
		return calc(
			regions1, inverted1,
			regions2, inverted2,
			['differenceRev'],
			epsilon, buildLog
		).differenceRev;
	},
	xor: function(regions1, inverted1, regions2, inverted2, epsilon, buildLog){
		return calc(
			regions1, inverted1,
			regions2, inverted2,
			['xor'],
			epsilon, buildLog
		).xor;
	},

	// or, slightly more beefy, just expose calc directly:
	calculate: calc
};

if (typeof window === 'object')
	window.PolyBool = PolyBool;

module.exports = PolyBool;
