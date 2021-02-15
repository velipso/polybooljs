// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

// from d3-array
function bisect(compare) {
  return function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
  };
}

var List = {
  create: function() {
    var my = {
      nodes: [],
      exists: function(node) {
        return my.nodes.includes(node);
      },
      getIndex: function(node) {
        return my.nodes.indexOf(node);
      },
      isEmpty: function() {
        return my.nodes.length === 0;
      },
      getHead: function() {
        return my.nodes[0];
      },
      insertBefore: function(node, check) {
        my.findTransition(node, check).insert(node);
      },
      findTransition: function(node, check) {
        var i = bisect(function (a, b) { return check(b) - check(a); })(my.nodes, node);
        return {
          before: i === 0 ? null : my.nodes[i - 1],
          after: my.nodes[i] || null,
          insert: function(node) {
            my.nodes.splice(i, 0, node);
            node.remove = function() { my.nodes.splice(my.nodes.indexOf(node), 1); };
            return node;
          }
        };
      }
    };
    return my;
  },
  node: function(data) {
    return data;
  }
};

module.exports = List;
