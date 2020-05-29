function cacl(arr, callback) {
  var ret;
  for (var i=0; i<arr.length;i++) {
    ret = callback(arr[i], ret);
  }
  return ret;
}
 

/**
 * 数组最大值
 */
Array.prototype.max = function () {
  if (this.length == 0) {
	  return 0;
  }
  return cacl(this, function (item, max) {
    if (!(max > item)) {
      return item;
    }
    else {
      return max;
    }
  });
};


/**
 * 数组最小值
 */
Array.prototype.min = function () {
  if (this.length == 0) {
	  return 0;
  }
  return cacl(this, function (item, min) {
    if (!(min < item)) {
      return item;
    }
    else {
      return min;
    }
  });
};


/**
 * 数组之和
 */
Array.prototype.sum = function () {
  if (this.length == 0) {
	  return 0;
  }
  return cacl(this, function (item, sum) {
    if (typeof (sum) == 'undefined') {
      return item;
    }
    else {
      return sum += item;
    }
  });
};


/**
 * 数组平均值
 */
Array.prototype.avg = function () {
  if (this.length == 0) {
    return 0;
  }
  return this.sum(this) / this.length;
};
 
/*var theArray=[1,-2,4,9,15];
console.log(theArray.max());
console.log(theArray.min());
console.log(theArray.sum());
console.log(theArray.avg());*/