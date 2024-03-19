// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// provides the raw computation functions that takes epsilon into account
//
// zero is defined to be between (-epsilon, epsilon) exclusive
//

function Epsilon(eps){
	if (typeof eps !== 'number')
		eps = 0.0000000001; // sane default? sure why not
	var my = {
		epsilon: function(v){
			if (typeof v === 'number')
				eps = v;
			return eps;
		},
		pointAboveOrOnLine: function(pt, left, right){
			var Ax = left[0];
			var Ay = left[1];
			var Bx = right[0];
			var By = right[1];
			var Cx = pt[0];
			var Cy = pt[1];
			var ABx = Bx - Ax;
			var ABy = By - Ay;
			var AB = Math.sqrt(ABx * ABx + ABy * ABy);
			// algebraic distance of 'pt' to ('left', 'right') line is:
			// [ABx * (Cy - Ay) - ABy * (Cx - Ax)] / AB
			return ABx * (Cy - Ay) - ABy * (Cx - Ax) >= -eps * AB;
		},
		pointBetween: function(p, left, right){
			// p must be collinear with left->right
			// returns false if p == left, p == right, or left == right
			if (my.pointsSame(p, left) || my.pointsSame(p, right)) return false;
			var d_py_ly = p[1] - left[1];
			var d_rx_lx = right[0] - left[0];
			var d_px_lx = p[0] - left[0];
			var d_ry_ly = right[1] - left[1];

			var dot = d_px_lx * d_rx_lx + d_py_ly * d_ry_ly;
			// dot < 0 is p is to the left of 'left'
			if (dot < 0) return false;
			var sqlen = d_rx_lx * d_rx_lx + d_ry_ly * d_ry_ly;
			// dot <= sqlen is p is to the left of 'right'
			return dot <= sqlen;
		},
		pointsSameX: function(p1, p2){
			return Math.abs(p1[0] - p2[0]) < eps;
		},
		pointsSameY: function(p1, p2){
			return Math.abs(p1[1] - p2[1]) < eps;
		},
		pointsSame: function(p1, p2){
			return my.pointsSameX(p1, p2) && my.pointsSameY(p1, p2);
		},
		pointsCompare: function(p1, p2){
			// returns -1 if p1 is smaller, 1 if p2 is smaller, 0 if equal
			if (my.pointsSameX(p1, p2))
				return my.pointsSameY(p1, p2) ? 0 : (p1[1] < p2[1] ? -1 : 1);
			return p1[0] < p2[0] ? -1 : 1;
		},
		pointsCollinear: function(pt1, pt2, pt3){
			// does pt1->pt2->pt3 make a straight line?
			// essentially this is just checking to see if the slope(pt1->pt2) === slope(pt2->pt3)
			// if slopes are equal, then they must be collinear, because they share pt2
			var dx1 = pt1[0] - pt2[0];
			var dy1 = pt1[1] - pt2[1];
			var dx2 = pt2[0] - pt3[0];
			var dy2 = pt2[1] - pt3[1];
			var n1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
			var n2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
			// Assuming det(u, v) = 0, we have:
			// |det(u + u_err, v + v_err)| = |det(u + u_err, v + v_err) - det(u,v)|
			// =|det(u, v_err) + det(u_err. v) + det(u_err, v_err)|
			// <= |det(u, v_err)| + |det(u_err, v)| + |det(u_err, v_err)|
			// <= N(u)N(v_err) + N(u_err)N(v) + N(u_err)N(v_err)
			// <= eps * (N(u) + N(v) + eps)
			// We have N(u) ~ N(u + u_err) and N(v) ~ N(v + v_err).
			// Assuming eps << N(u) and eps << N(v), we end with:
			// |det(u + u_err, v + v_err)| <= eps * (N(u + u_err) + N(v + v_err))
			return Math.abs(dx1 * dy2 - dx2 * dy1) <= eps * (n1 + n2);
		},
		linesIntersect: function(a0, a1, b0, b1){
			// returns false if the lines are coincident (e.g., parallel or on top of each other)
			//
			// returns an object if the lines intersect:
			//   {
			//     pt: [x, y],    where the intersection point is at
			//     alongA: where intersection point is along A,
			//     alongB: where intersection point is along B
			//   }
			//
			//  alongA and alongB will each be one of: -2, -1, 0, 1, 2
			//
			//  with the following meaning:
			//
			//    -2   intersection point is before segment's first point
			//    -1   intersection point is directly on segment's first point
			//     0   intersection point is between segment's first and second points (exclusive)
			//     1   intersection point is directly on segment's second point
			//     2   intersection point is after segment's second point
			var adx = a1[0] - a0[0];
			var ady = a1[1] - a0[1];
			var bdx = b1[0] - b0[0];
			var bdy = b1[1] - b0[1];

			var axb = adx * bdy - ady * bdx;
			var n1 = Math.sqrt(adx * adx + ady * ady);
			var n2 = Math.sqrt(bdx * bdx + bdy * bdy);
			if (Math.abs(axb) <= eps * (n1 + n2))
				return false; // lines are coincident

			var dx = a0[0] - b0[0];
			var dy = a0[1] - b0[1];

			var A = (bdx * dy - bdy * dx) / axb;
			var B = (adx * dy - ady * dx) / axb;
			var pt = [
				a0[0] + A * adx,
				a0[1] + A * ady
			];

			var ret = {
				alongA: 0,
				alongB: 0,
				pt: pt
			};

			// categorize where intersection point is along A and B
			if (my.pointsSame(pt, a0))
				ret.alongA = -1;
			else if (my.pointsSame(pt, a1))
				ret.alongA = 1;
			else if (A < 0)
				ret.alongA = -2;
			else if (A > 1)
				ret.alongA = 2;

			if (my.pointsSame(pt, b0))
				ret.alongB = -1;
			else if (my.pointsSame(pt, b1))
				ret.alongB = 1;
			else if (B < 0)
				ret.alongB = -2;
			else if (B > 1)
				ret.alongB = 2;

			return ret;
		},
		pointInsideRegion: function(pt, region){
			var x = pt[0];
			var y = pt[1];
			var last_x = region[region.length - 1][0];
			var last_y = region[region.length - 1][1];
			var inside = false;
			for (var i = 0; i < region.length; i++){
				var curr_x = region[i][0];
				var curr_y = region[i][1];

				// if y is between curr_y and last_y, and
				// x is to the right of the boundary created by the line
				if ((curr_y - y > eps) != (last_y - y > eps) &&
					(last_x - curr_x) * (y - curr_y) / (last_y - curr_y) + curr_x - x > eps)
					inside = !inside

				last_x = curr_x;
				last_y = curr_y;
			}
			return inside;
		}
	};
	return my;
}

module.exports = Epsilon;
