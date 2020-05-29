/**
 * 用法和java一样
 * var set = new Set();<br/>
 * var val = set.get(i);<br/>
 */
function Set() {
	this.elements = new Array();
	// 获取Set元素个数
	this.size = function() {
		return this.elements.length;
	}

	// 判断Set是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	// 清除Set
	this.clear = function() {
		this.elements = new Array();
	}
	
	// 增加一个元素，不重复
	this.add = function(value) {
		// alert(this.containsKey(_key));
		if (this.containsValue(value)) {
			this.remove(value);
		}
		this.elements.push(value);
	}
	
	// 移除一个值
	this.remove = function(value) {
		var bln = false;
		try {

			for (i = 0; i < this.elements.length; i++) {

				if (this.elements[i] == value) {

					this.elements.splice(i, 1);

					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 移除一个值,索引
	this.kill = function(index) {
		this.remove(this.get(index));
	}

	// 得到一个值,索引
	this.get = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	// 查看是否包含一个值
	this.containsValue = function(value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i] == value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}
}