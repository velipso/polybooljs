// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// simple linked list implementation that allows you to traverse down nodes and save positions
//

function LinkedList(){
	function node(before){
		var my = {
			exists: function(){
				return before.next !== null;
			},
			nextExists: function(){
				return before.next !== null && before.next.next !== null;
			},
			prevExists: function(){
				return before.root !== true;
			},
			data: function(){
				if (before.next === null)
					throw new Error('cannot get data from nonexistent node');
				return before.next.data;
			},
			prevData: function(){
				if (before.root)
					throw new Error('cannot get data from nonexistent node');
				return before.data;
			},
			nextData: function(){
				if (before.next === null || before.next.next === null)
					throw new Error('cannot get data from nonexistent node');
				return before.next.next.data;
			},
			next: function(){
				if (before.next === null)
					throw new Error('cannot go forward from here');
				return node(before.next);
			},
			remove: function(){
				if (before.next === null)
					throw new Error('cannot remove nonexistent node');
				before.next = before.next.next;
				return my;
			},
			insertBefore: function(data){
				before.next = { data: data, next: before.next };
				return node(before.next);
			},
			find: function(check){
				// search forwards until we hit the end or check returns true
				var b = before;
				while (b.next !== null){
					if (check(b.next.data))
						break;
					b = b.next;
				}
				return node(b);
			}
		};
		return my;
	}
	return node({ root: true, next: null });
}

module.exports = LinkedList;
