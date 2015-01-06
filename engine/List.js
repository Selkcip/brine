function ListNode(newitem){
	this.item = newitem;
}
ListNode.prototype.item = null;
ListNode.prototype.link = null;

/**
 * Creates a new instance of List.
 * 
 * @class A singly linked list of nodes, each with item and link properties. Unlike other languages, a list can contain unrelated object types at the same time.
 * However, this may result in unexpected results when processing its contents with a loop.
 * @property {ListNode} head Pointer to the first node in the list.
 * @property {ListNode} tail Pointer to the last node in the list.
 * @property {number} length The number of nodes in the list.
 */
function List(){
}

List.prototype.head = null;
List.prototype.tail = null;
List.prototype.length = 0;

/**
 * Inserts the given object at the end of the list.
 *  
 * @param {Object} object The object to be inserted.
 */
List.prototype.push = function(object){
	var newNode = new ListNode(object);
	if(this.head === null){
		this.head = newNode;
	}else{
		this.tail.link = newNode;
	}
	this.tail = newNode;
	this.length++;
}

/**
 * Inserts the given object at the front of the list.
 *  
 * @param {Object} object The object to be inserted.
 */
List.prototype.push_front = function(object){
	var newNode = new ListNode(object);
	if(this.head === null){
		this.tail = newNode;
	}else{
		newNode.link = this.head;
	}
	this.head = newNode;
	this.length++;
}

/**
 * Inserts the given object at the front of the list.
 *  
 * @param {Object} object The object to be inserted.
 */
List.prototype.push_back = function(object){
	this.push(object);
}

/**
 * Removes the head of the list and returns its item.
 * 
 * @return {Object} The contents of the head node.
 */
List.prototype.pop = function(){
	var item = null;
	if(this.head != null){
		item = this.head.item;
		if(this.tail == this.head){
			this.tail = null;
		}
		this.head = this.head.link;
		this.length--;
	}
	return item;
}

/**
 * Removes the head of the list and returns its item.
 * 
 * @return {Object} The contents of the head node.
 */
List.prototype.pop_front = function(){
	return this.pop();
}

/**
 * Removes the head of the list and returns its item.
 * 
 * @return {Object} The contents of the head node.
 */
List.prototype.pop_back = function(){
	var item = null;
	if(this.tail != null){
		item = this.tail.item;
		this.remove(item);
		//this.head = this.head.link;
		//this.length--;
	}
	return item;
}

/**
 * Removes the first instance found of the given object from the list. If there is more than one instance the others remain.
 * 
 * @param {Object} object The object to remove.
 * @return {bool} True if the object was found and removed, false otherwise.
 */
List.prototype.remove = function(object){
	if(this.head != null){
		if(this.head.item === object){
			this.head = this.head.link;
			this.length--;
			return true;
		}
		var prev = this.head;
		var curr = this.head.link;
		while(curr !== null){
			if(curr.item === object){
				prev.link = curr.link;
				if(this.tail.item === object){
					this.tail = prev;
				}
				this.length--;
				return true;
			}
			prev = curr;
			curr = curr.link;
		}
	}
	return false;
}

/**
 * Searches the list for the given object.
 *  
 * @param {Object} object The object to be looked for.
 * @return {bool} True if found, false otherwise.
 */
List.prototype.find = function(object){
	for(var node = this.head; node !== null; node = node.link){
		if(node.item == object){
			return true;
		}
	}
	return false;
}

/**
 * Returns the object in the node at the given index.
 *  
 * @param {Object} index The node index to retrieve an object from. null if the index is out of range.
 */
List.prototype.getAt = function(index){
	var item = null;
	var cur = this.head;
	if(index >= 0 && index < this.length){
		while(index > 0 && cur != null){
			cur = cur.link;
			index--;
		}
		item = cur.item;
	}
	return item;
}

/**
 * For each item in the list the given function is called with the item and the given additional parameters as parameters.
 * 
 * @param {Object} func The function to be called.
 * @param {Object} params Additional parameters to pass to the function.
 */
List.prototype.foreach = function(func, params){
	for(var node = this.head; node !== null; node = node.link){
		func(node.item, params);
	}
}

/**
 * Joins the list into a string for debugging purposes.
 * 
 * @return {string} The list as a string. 
 */
List.prototype.toString = function(){
	var count = 0;
	var curr = this.head;
	var dbgstring = "";
	while(curr !== null){
		dbgstring += "["+count+": ";
		dbgstring += curr.item+"]";
		//dbgstring += "--Link: "+curr.link+"\n";
		curr = curr.link;
		count++;
	}
	return dbgstring;
}