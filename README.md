# polybooljs

Boolean operations on polygons (union, intersection, difference, xor)

# Features

1. Clips polygons for all boolean operations
2. Removes unnecessary verticies
3. Handles segments that are coincident (overlap perfectly, share verticies, one inside the other, etc)
4. Uses formulas that take floating point irregularities into account (via configurable epsilon)

# Demo

[View the demo + animation](https://rawgit.com/voidqk/polybooljs/master/dist/demo.html)

# Paper

Based somewhat on the F. Martinez (2008) algorithm:

[Paper](http://www.cs.ucr.edu/~vbz/cs230papers/martinez_boolean.pdf)

[Code](https://github.com/akavel/martinez-src)

# Crash Course

## Example

```javascript
PolyBool.union(
  [ [[100,100],[200,200],[300,100]], [[300,100],[300,200],[400,100]] ],
  false,
  [ [[50,50],[200,50],[300,200]] ],
  false
)
==> {
  regions: [
    [[400,100],[300,100],[300,200],
     [260,140],[300,100],[233.33333333333331,100],
     [200,50],[50,50],[133.33333333333331,100],
     [100,100],[200,200],[237.5,162.5],[300,200]]
  ],
  inverted: false
}
```

## Basic functions

```javascript
PolyBool.union(                     // poly1 || poly2
  regions1, inverted1,              // <-- polygon 1
  regions2, inverted2,              // <-- polygon 2
  [epsilon, [buildLog]]             // <-- optional
);
PolyBool.intersect    (...same...); // poly1 && poly2
PolyBool.difference   (...same...); // poly1 - poly2
PolyBool.differenceRev(...same...); // poly2 - poly1
PolyBool.xor          (...same...); // poly1 ^ poly2
```

Where `regionsX` is a list regions for the polygon:

```javascript
[
  [ [10, 10], [20, 20], [30, 10] ], // <- a single region
  [ [20, 10], [30, 20], [40, 10] ]
]
```

A single region is a list of points in `[x, y]` format.

And `invertedX` is a bool indicating whether that polygon is inverted or not.

The parameters `epsilon` and `buildLog` are explained below, but can safely be ignored for most uses.

Returns an object:

```javascript
{
  regions: <list of regions in the result set>,
  inverted: <whether the resulting polygon is inverted>
}
```

# Computing Multiple Results

The algorithm produces enough information to calculate all the operations.  If you want multiple operations performed, it is much more efficient to request all of them at once, via:

```javascript
PolyBool.calculate(
  regions1, inverted1,   // <--- polygon 1, like before
  regions2, inverted2,   // <--- polygon 2, like before
  operations,            // <--- list of operations to compute
  [epsilon, [buildLog]]  // <--- optional
);
```

Where `regionsX`/`invertedX` are the same as before, and `operations` is a list of strings that are the operations to perform.

To calculate all operations, pass the following as the `operations` parameter:

`[ 'union', 'intersect', 'difference', 'differenceRev', 'xor' ]`

If you want less operations, just remove them from the list.  Order doesn't matter.

The function returns an object with the result of each requested operation as the key:

```javascript
{
  union: { // <-- only exists if 'union' was passed in operations list
    regions: <list of regions for union result>,
    inverted: <whether union polygon is inverted>
  },
  intersect: { // <-- only exists if 'intersect' was in operations... etc
    regions: <list of regions for intersect result>,
    inverted: <...etc...>
  },
  ...etc...
}
```

# Epsilon

Due to the beauty of floating point reality, floating point calculations are not exactly perfect.  This is a problem when trying to detect whether lines are on top of each other, or if verticies are exactly the same.

The `epsilon` value in the API function calls allows you to set the boundary for considering values equal.  It is a number, and the default is `0.0000000001`.

Normally you would expect this to work:

```javascript
if (A === B)
  /* A and B are equal */;
else
  /* A and B are not equal */;
```

But for inexact floating point math, instead we use:

```javascript
if (Math.abs(A - B) < epsilon)
  /* A and B are equal */;
else
  /* A and B are not equal */;
```

This not-quite-equal problem is a bit annoying.

Fortunately, `PolyBool` has already figured out (or stolen) the required formulas, so all you need to do is provide an `epsilon` value, and everything will (read: should) work.

If your polygons are really really large or really really tiny, then you will probably have to come up with your own epsilon value.

If `PolyBool` detects that your epsilon is too small, it will throw an error to try and help you.

# Build Log

The optional `buildLog` parameter is used strictly for debugging and creating the animation in the demo.

It simply logs the processing of the algorithm, so it can be inspected and played back.

If you want a build log for some reason, you can create one via:

`var buildLog = PolyBool.BuildLog();`

You can inspect the log by looking in the values inside of `buildLog.list`:

```javascript
buildLog.list.forEach(function(logEntry){
  console.log(logEntry.type, logEntry.data);
});
```

Don't rely on the build log functionality to be consistent across releases.
