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
==> result
{
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

`PolyBool.union(regions1, inverted1, regions2, inverted2)`

Where `regions1`/`regions2` are lists of regions:

```javascript
[
  [ [100, 100], [200, 200], [300, 100] ], // <- a single region is a list of points
  [ [200, 100], [300, 200], [400, 100] ]
]
```

`inverted1`/`inverted2` are bools that simply indicate if the polygon is inverted.

Returns an object:

```javascript
{
  regions: <list of regions in the result set>,
  inverted: <whether the resulting polygon is inverted>
}
```

`PolyBool.intersect(regions1, inverted1, regions2, inverted2)`

Same as `PolyBool.union`, except for intersection.

`PolyBool.difference(regions1, inverted1, regions2, inverted2)`

Same as `PolyBool.union`, except for difference (`poly1 - poly2`).

`PolyBool.differenceRev(regions1, inverted1, regions2, inverted2)`

Same as `PolyBool.union`, except for revered difference (`poly2 - poly1`).

`PolyBool.xor(regions1, inverted1, regions2, inverted2)`

Same as `PolyBool.union`, except for exclusive or.

# Full Documentation

... soon
