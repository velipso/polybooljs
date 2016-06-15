// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// filter a list of segments based on boolean operations
//

function select(segments, selection, buildLog){
	var result = [];
	segments.forEach(function(seg){
		var index =
			(seg.myFill   .above ? 8 : 0) +
			(seg.myFill   .below ? 4 : 0) +
			((seg.otherFill && seg.otherFill.above) ? 2 : 0) +
			((seg.otherFill && seg.otherFill.below) ? 1 : 0);
		if (selection[index])
			result.push(seg);
	});

	if (buildLog)
		buildLog.selected(result);

	return result;
}

var SegmentSelector = {
	union: function(segments, buildLog){ // primary | secondary
		// above1 below1 above2 below2    Keep?
		//    0      0      0      0   =>   0
		//    0      0      0      1   =>   1
		//    0      0      1      0   =>   1
		//    0      0      1      1   =>   0
		//    0      1      0      0   =>   1
		//    0      1      0      1   =>   1
		//    0      1      1      0   =>   0
		//    0      1      1      1   =>   0
		//    1      0      0      0   =>   1
		//    1      0      0      1   =>   0
		//    1      0      1      0   =>   1
		//    1      0      1      1   =>   0
		//    1      1      0      0   =>   0
		//    1      1      0      1   =>   0
		//    1      1      1      0   =>   0
		//    1      1      1      1   =>   0
		return select(segments, [
			0, 1, 1, 0,
			1, 1, 0, 0,
			1, 0, 1, 0,
			0, 0, 0, 0
		], buildLog);
	},
	intersect: function(segments, buildLog){ // primary & secondary
		// above1 below1 above2 below2    Keep?
		//    0      0      0      0   =>   0
		//    0      0      0      1   =>   0
		//    0      0      1      0   =>   0
		//    0      0      1      1   =>   0
		//    0      1      0      0   =>   0
		//    0      1      0      1   =>   1
		//    0      1      1      0   =>   0
		//    0      1      1      1   =>   1
		//    1      0      0      0   =>   0
		//    1      0      0      1   =>   0
		//    1      0      1      0   =>   1
		//    1      0      1      1   =>   1
		//    1      1      0      0   =>   0
		//    1      1      0      1   =>   1
		//    1      1      1      0   =>   1
		//    1      1      1      1   =>   0
		return select(segments, [
			0, 0, 0, 0,
			0, 1, 0, 1,
			0, 0, 1, 1,
			0, 1, 1, 0
		], buildLog);
	},
	difference: function(segments, buildLog){ // primary - secondary
		// above1 below1 above2 below2    Keep?
		//    0      0      0      0   =>   0
		//    0      0      0      1   =>   0
		//    0      0      1      0   =>   0
		//    0      0      1      1   =>   0
		//    0      1      0      0   =>   1
		//    0      1      0      1   =>   0
		//    0      1      1      0   =>   1
		//    0      1      1      1   =>   0
		//    1      0      0      0   =>   1
		//    1      0      0      1   =>   1
		//    1      0      1      0   =>   0
		//    1      0      1      1   =>   0
		//    1      1      0      0   =>   0
		//    1      1      0      1   =>   1
		//    1      1      1      0   =>   1
		//    1      1      1      1   =>   0
		return select(segments, [
			0, 0, 0, 0,
			1, 0, 1, 0,
			1, 1, 0, 0,
			0, 1, 1, 0
		], buildLog);
	},
	differenceRev: function(segments, buildLog){ // secondary - primary
		// above1 below1 above2 below2    Keep?
		//    0      0      0      0   =>   0
		//    0      0      0      1   =>   1
		//    0      0      1      0   =>   1
		//    0      0      1      1   =>   0
		//    0      1      0      0   =>   0
		//    0      1      0      1   =>   0
		//    0      1      1      0   =>   1
		//    0      1      1      1   =>   1
		//    1      0      0      0   =>   0
		//    1      0      0      1   =>   1
		//    1      0      1      0   =>   0
		//    1      0      1      1   =>   1
		//    1      1      0      0   =>   0
		//    1      1      0      1   =>   0
		//    1      1      1      0   =>   0
		//    1      1      1      1   =>   0
		return select(segments, [
			0, 1, 1, 0,
			0, 0, 1, 1,
			0, 1, 0, 1,
			0, 0, 0, 0,
		], buildLog);
	},
	xor: function(segments, buildLog){ // primary ^ secondary
		// above1 below1 above2 below2    Keep?
		//    0      0      0      0   =>   0
		//    0      0      0      1   =>   1
		//    0      0      1      0   =>   1
		//    0      0      1      1   =>   0
		//    0      1      0      0   =>   1
		//    0      1      0      1   =>   0
		//    0      1      1      0   =>   0
		//    0      1      1      1   =>   1
		//    1      0      0      0   =>   1
		//    1      0      0      1   =>   0
		//    1      0      1      0   =>   0
		//    1      0      1      1   =>   1
		//    1      1      0      0   =>   0
		//    1      1      0      1   =>   1
		//    1      1      1      0   =>   1
		//    1      1      1      1   =>   0
		return select(segments, [
			0, 1, 1, 0,
			1, 0, 0, 1,
			1, 0, 0, 1,
			0, 1, 1, 0
		], buildLog);
	}
};

module.exports = SegmentSelector;
