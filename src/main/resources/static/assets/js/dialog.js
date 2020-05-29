Dialog = (function () {
	var res = {
			alert:function(e, callback_){
				bootbox.dialog({
					message: "<span class='bigger-110'>"+e+"</span>",
					onEscape: function() {
					},
					buttons: {  
	                    /*Cancel: {  
	                        label: "<i class='icon-remove'></i> 取消", 
	                        className: "btn btn-sm",  
	                        callback: function () {  
	                            alert("Cancel");  
	                        }  
	                    }, */
	                    OK: {
	                        label: "<i class='icon-remove'></i> 确定",  
	                        className: "btn btn-sm btn-info",  
	                        callback: function () {  
	                        	if(callback_ && (callback_  instanceof Function)){
	                        		callback_.call(this);//回调
	                        	} 
	                        }  
	                    }  
	                }  
				});
			}
	};
	return res;
})();