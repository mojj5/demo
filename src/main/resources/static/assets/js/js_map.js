/**  
 * 用法和java中的一样 <br/>
 * var map = new Map();<br/>
 * var val = map.get(key);<br/>
 */
function Map() {

	this.elements = new Array();

	/**
	 * 集合长度
	 */
	this.size = function() {
		return this.elements.length;
	}

	/**
	 * 判断集合是否为空
	 */
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	/**
	 * 清空集合数据
	 */
	this.clear = function() {
		this.elements = new Array();
	}

	
	/**
	 * 向集合添加key value  key不能重复
	 */
	this.put = function(_key, _value) {
		if (!this.containsKey(_key)) {
			this.elements.push( {
				key : _key,
				value : _value
			});
		}
	}

	/**
	 * 移除元素
	 */
	this.remove = function(_key) {
		var bln = false;

		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	/**
	 * 根据key得到value
	 */
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}

	/**
	 * 根据索引得到map中的一个对象
	 */
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	
	/**
	 * 判断map中key是否存在
	 */
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	
	/**
	 * 判断value在map中是否存在
	 */
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	/**
	 * value集合
	 */
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}

	
	/**
	 * key集合
	 */
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}
}