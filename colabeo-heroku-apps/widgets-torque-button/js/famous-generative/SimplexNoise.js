//Heavily Influenced/Based on: http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
define(function(require, exports, module) 
{
  function Grad(x, y, z, w) 
  {
      this.x = x || 0.0; 
      this.y = y || 0.0;
      this.z = z || 0.0; 
      this.w = w || 0.0;     
  }  

  function dot2(g, xin, yin) 
  {  
    return g.x*xin + g.y*yin; 
  }

  function dot3(g, x, y, z)
  {
    return g.x*x + g.y*y + g.z*z; 
  }

  function dot4(g, x, y, z, w)
  {
    return g.x*x + g.y*y + g.z*z + g.w*w; 
  }

  /**
   * @constructor
  */
  function SimplexNoise()
  {    
    // Skewing and unskewing factors for 2, 3, and 4 dimensions
    this.F2 = 0.5*(Math.sqrt(3.0)-1.0);
    this.G2 = (3.0-Math.sqrt(3.0))/6.0;
    this.F3 = 1.0/3.0;
    this.G3 = 1.0/6.0;
    this.F4 = (Math.sqrt(5.0)-1.0)/4.0;
    this.G4 = (5.0-Math.sqrt(5.0))/20.0;    

    this.grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
                  new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
                  new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

    this.grad4 = [new Grad(0,1,1,1),new Grad(0,1,1,-1),new Grad(0,1,-1,1),new Grad(0,1,-1,-1),
                  new Grad(0,-1,1,1),new Grad(0,-1,1,-1),new Grad(0,-1,-1,1),new Grad(0,-1,-1,-1),
                  new Grad(1,0,1,1),new Grad(1,0,1,-1),new Grad(1,0,-1,1),new Grad(1,0,-1,-1),
                  new Grad(-1,0,1,1),new Grad(-1,0,1,-1),new Grad(-1,0,-1,1),new Grad(-1,0,-1,-1),
                  new Grad(1,1,0,1),new Grad(1,1,0,-1),new Grad(1,-1,0,1),new Grad(1,-1,0,-1),
                  new Grad(-1,1,0,1),new Grad(-1,1,0,-1),new Grad(-1,-1,0,1),new Grad(-1,-1,0,-1),
                  new Grad(1,1,1,0),new Grad(1,1,-1,0),new Grad(1,-1,1,0),new Grad(1,-1,-1,0),
                  new Grad(-1,1,1,0),new Grad(-1,1,-1,0),new Grad(-1,-1,1,0),new Grad(-1,-1,-1,0)];

    this.p = [];
    for(var i = 0; i <= 255; i++)
    {
      this.p[i] = Math.floor(Math.random() * 255); 
    }

    // To remove the need for index wrapping, var the permutation table length
    this.perm = []; 
    this.permMod12 = []; 

    for(var i = 0; i < 512; i++)
    {
      this.perm[i] = this.p[i & 255];      
      this.permMod12[i] = this.perm[i] % 12;      
    }          
  };

  SimplexNoise.prototype.noise2D = function(xin, yin)
  {
    // Noise contributions from the three corners
    var n0 = 0.0; 
    var n1 = 0.0;
    var n2 = 0.0; 

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*this.F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*this.G2;

    // Unskew the cell origin back to (x,y) space
    var X0 = i-t; 
    var Y0 = j-t;
    
    // The x,y distances from the cell origin    
    var x0 = xin-X0; 
    var y0 = yin-Y0;
    
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    {
      i1=1; 
      j1=0;
    } 
    else      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    { 
      i1=0;
      j1=1;
    }      
    
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + this.G2;
    var x2 = x0 - 1.0 + 2.0 * this.G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * this.G2;
    
    // Work out the hashed gradient indices of the three simplex corners
    var ii = i & 255;
    var jj = j & 255;
  
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0>=0) 
    {
      var gi0 = this.permMod12[ii+this.perm[jj]];    
      t0 *= t0;
      n0 = t0 * t0 * dot2(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient
    }

    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1>=0)
    {
      var gi1 = this.permMod12[ii+i1+this.perm[jj+j1]];
      t1 *= t1;
      n1 = t1 * t1 * dot2(this.grad3[gi1], x1, y1);
    }
    
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2>=0) 
    {
      var gi2 = this.permMod12[ii+1+this.perm[jj+1]];
      t2 *= t2;
      n2 = t2 * t2 * dot2(this.grad3[gi2], x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the varerval [-1,1].
    return 70.0 * (n0 + n1 + n2);
  };

   // 3D simplex noise
  SimplexNoise.prototype.noise3D = function(xin, yin, zin) 
  {
    // Noise contributions from the four corners
    var n0 = 0.0; 
    var n1 = 0.0; 
    var n2 = 0.0; 
    var n3 = 0.0;
    
    // Skew the input space to determine which simplex cell we're in
    // Very nice and simple skew factor for 3D
    var s = (xin+yin+zin)*this.F3; 
    
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);
    
    var t = (i+j+k)*this.G3;
    
    // Unskew the cell origin back to (x,y,z) space
    var X0 = i-t; 
    var Y0 = j-t;
    var Z0 = k-t;
    
    // The x,y,z distances from the cell origin
    var x0 = xin-X0; 
    var y0 = yin-Y0;
    var z0 = zin-Z0;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    // Offsets for second corner of simplex in (i,j,k) coords
    var i1, j1, k1; 
    // Offsets for third corner of simplex in (i,j,k) coords    
    var i2, j2, k2; 
    
    if(x0>=y0) 
    {
      if(y0>=z0)      // X Y Z order   
      { 
        i1=1;
        j1=0; 
        k1=0; 
        i2=1; 
        j2=1; 
        k2=0; 
      } 
      else if(x0>=z0) // X Z Y order
      { 
        i1=1;
        j1=0; 
        k1=0; 
        i2=1; 
        j2=0; 
        k2=1;
      } 
      else            // Z X Y order
      { 
        i1=0; 
        j1=0; 
        k1=1; 
        i2=1; 
        j2=0; 
        k2=1;
      } 
    }
    else              // x0<y0
    { 
      if(y0<z0)       // Z Y X order
      { 
        i1=0; 
        j1=0; 
        k1=1; 
        i2=0; 
        j2=1; 
        k2=1; 
      } 
      else if(x0<z0)  // Y Z X order
      {
        i1=0; 
        j1=1; 
        k1=0; 
        i2=0; 
        j2=1; 
        k2=1; 
      } 
      else            // Y X Z order
      { 
        i1=0; 
        j1=1; 
        k1=0; 
        i2=1; 
        j2=1; 
        k2=0; 
      } 
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    
    // Offsets for second corner in (x,y,z) coords    
    var x1 = x0 - i1 + this.G3; 
    var y1 = y0 - j1 + this.G3;
    var z1 = z0 - k1 + this.G3;
    
    // Offsets for third corner in (x,y,z) coords    
    var x2 = x0 - i2 + 2.0*this.G3; 
    var y2 = y0 - j2 + 2.0*this.G3;
    var z2 = z0 - k2 + 2.0*this.G3;

    // Offsets for last corner in (x,y,z) coords
    var x3 = x0 - 1.0 + 3.0*this.G3; 
    var y3 = y0 - 1.0 + 3.0*this.G3;
    var z3 = z0 - 1.0 + 3.0*this.G3;
    
    // Work out the hashed gradient indices of the four simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    
    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0>=0) 
    {     
      var gi0 = this.permMod12[ii+this.perm[jj+this.perm[kk]]]; 
      t0 *= t0;
      n0 = t0 * t0 * dot3(this.grad3[gi0], x0, y0, z0);
    }
    
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1>=0) 
    {    
      var gi1 = this.permMod12[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]];  
      t1 *= t1;
      n1 = t1 * t1 * dot3(this.grad3[gi1], x1, y1, z1);
    }

    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2>=0) 
    {
      var gi2 = this.permMod12[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]];
      t2 *= t2;
      n2 = t2 * t2 * dot3(this.grad3[gi2], x2, y2, z2);
    }

    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3>=0) 
    {
      var gi3 = this.permMod12[ii+1+this.perm[jj+1+this.perm[kk+1]]];
      t3 *= t3;
      n3 = t3 * t3 * dot3(this.grad3[gi3], x3, y3, z3);
    }
    
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0*(n0 + n1 + n2 + n3);
  }
   

  SimplexNoise.prototype.noise4D = function(xin, yin, zin, win)
  {
    // Noise contributions from the five corners
    var n0 = 0.0; 
    var n1 = 0.0; 
    var n2 = 0.0; 
    var n3 = 0.0; 
    var n4 = 0.0; 

    // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
    var s = (xin + yin + zin + win) * this.F4; // Factor for 4D skewing
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var k = Math.floor(zin + s);
    var l = Math.floor(win + s);

    // Factor for 4D unskewing
    var t = (i + j + k + l) * this.G4; 
    var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
    var Y0 = j - t;
    var Z0 = k - t;
    var W0 = l - t;

    // The x,y,z,w distances from the cell origin
    var x0 = xin - X0;  
    var y0 = yin - Y0;
    var z0 = zin - Z0;
    var w0 = win - W0;
    
    // To find out which of the 24 possible simplices we're in, we need to
    // determine the magnitude ordering of x0, y0, z0 and w0.
    // Six pair-wise comparisons are performed between each possible pair
    // of the four coordinates, and the results are used to rank the numbers.
    var rankx = 0;
    var ranky = 0;
    var rankz = 0;
    var rankw = 0;
    
    if(x0 > y0) 
    {
      rankx++; 
    }
    else 
    {
      ranky++;
    }

    if(x0 > z0)
    {
      rankx++;
    } 
    else 
    {
      rankz++;
    }

    if(x0 > w0) 
    {
      rankx++;
    } 
    else 
    { 
      rankw++;
    }

    if(y0 > z0) 
    {
      ranky++;
    } 
    else 
    {
      rankz++;
    }
    
    if(y0 > w0) 
    {
      ranky++;
    } 
    else 
    {
      rankw++;
    }
    if(z0 > w0) 
    {
      rankz++;
    } 
    else 
    {
      rankw++;
    }

    // The integer offsets for the second simplex corner
    var i1, j1, k1, l1; 
    // The integer offsets for the third simplex corner
    var i2, j2, k2, l2; 
    // The integer offsets for the fourth simplex corner
    var i3, j3, k3, l3;

    // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
    // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
    // impossible. Only the 24 indices which have non-zero entries make any sense.
    // We use a thresholding to set the coordinates in turn from the largest magnitude.
    // Rank 3 denotes the largest coordinate.
    i1 = rankx >= 3 ? 1 : 0;
    j1 = ranky >= 3 ? 1 : 0;
    k1 = rankz >= 3 ? 1 : 0;
    l1 = rankw >= 3 ? 1 : 0;

    // Rank 2 denotes the second largest coordinate.
    i2 = rankx >= 2 ? 1 : 0;
    j2 = ranky >= 2 ? 1 : 0;
    k2 = rankz >= 2 ? 1 : 0;
    l2 = rankw >= 2 ? 1 : 0;
    
    // Rank 1 denotes the second smallest coordinate.
    i3 = rankx >= 1 ? 1 : 0;
    j3 = ranky >= 1 ? 1 : 0;
    k3 = rankz >= 1 ? 1 : 0;
    l3 = rankw >= 1 ? 1 : 0;
    
    // The fifth corner has all coordinate offsets = 1, so no need to compute that.
    var x1 = x0 - i1 + this.G4; // Offsets for second corner in (x,y,z,w) coords
    var y1 = y0 - j1 + this.G4;
    var z1 = z0 - k1 + this.G4;
    var w1 = w0 - l1 + this.G4;
    
    // Offsets for third corner in (x,y,z,w) coords    
    var x2 = x0 - i2 + 2.0*this.G4; 
    var y2 = y0 - j2 + 2.0*this.G4;
    var z2 = z0 - k2 + 2.0*this.G4;
    var w2 = w0 - l2 + 2.0*this.G4;

    // Offsets for fourth corner in (x,y,z,w) coords
    var x3 = x0 - i3 + 3.0*this.G4; 
    var y3 = y0 - j3 + 3.0*this.G4;
    var z3 = z0 - k3 + 3.0*this.G4;
    var w3 = w0 - l3 + 3.0*this.G4;

    // Offsets for last corner in (x,y,z,w) coords
    var x4 = x0 - 1.0 + 4.0*this.G4; 
    var y4 = y0 - 1.0 + 4.0*this.G4;
    var z4 = z0 - 1.0 + 4.0*this.G4;
    var w4 = w0 - 1.0 + 4.0*this.G4;
    // Work out the hashed gradient indices of the five simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var ll = l & 255;
   
    // Calculate the contribution from the five corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0 - w0*w0;
    if(t0>=0) 
    {
      var gi0 = this.perm[ii+this.perm[jj+this.perm[kk+this.perm[ll]]]] % 32;
      t0 *= t0;
      n0 = t0 * t0 * dot4(this.grad4[gi0], x0, y0, z0, w0);
    }

    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1 - w1*w1;    
    if(t1>=0) 
    {
      var gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1+this.perm[ll+l1]]]] % 32;
      t1 *= t1;
      n1 = t1 * t1 * dot4(this.grad4[gi1], x1, y1, z1, w1);
    }

    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2 - w2*w2;
    if(t2>=0) 
    {
      var gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2+this.perm[ll+l2]]]] % 32;
      t2 *= t2;
      n2 = t2 * t2 * dot4(this.grad4[gi2], x2, y2, z2, w2);
    }
    
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3 - w3*w3;
    if(t3>=0) 
    {
      var gi3 = this.perm[ii+i3+this.perm[jj+j3+this.perm[kk+k3+this.perm[ll+l3]]]] % 32;
      t3 *= t3;
      n3 = t3 * t3 * dot4(this.grad4[gi3], x3, y3, z3, w3);
    }

    var t4 = 0.6 - x4*x4 - y4*y4 - z4*z4 - w4*w4;
    if(t4<0) 
    {
       var gi4 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1+this.perm[ll+1]]]] % 32;
      t4 *= t4;
      n4 = t4 * t4 * dot4(this.grad4[gi4], x4, y4, z4, w4);
    }

    // Sum up and scale the result to cover the range [-1,1]
    return 27.0 * (n0 + n1 + n2 + n3 + n4);
  } 

  module.exports = SimplexNoise;
});