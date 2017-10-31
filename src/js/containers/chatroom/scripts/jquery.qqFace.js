// QQ表情插件
  import $ from 'jquery';

  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',//表情容器
			path : '../static/img/',//表情图片地址
			assign : 'content',//输入表情的输入框
			tip : 'em_',//表情文字
			icon:{count:8,suffix:".png"},
			title:[]
			
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		var count=option.icon.count;
		var suffix=option.icon.suffix;
		var title=option.title;
		
		var fn=option.fn;
		
	
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		$(this).click(function(e){
			var strFace,labFace;

			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:5;bottom:100%;left:0;line-height:26px" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<=count; i++){
						labFace = '['+tip+i+']';
						
						strFace += '<td><img title='+title[i-1]+' class="icon" labFace="'+labFace+'" src='+require("../static/img/"+i+suffix)+' /></td>';//onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');"
						if( i % 15 == 0 ) strFace += '</tr><tr>';
				}
				
				strFace += '</tr></table></div>';
			}
			$(this).parents(".chat-input").append(strFace);
//			$(this).parent().append(strFace);
			$("#facebox").off('click');
			$("#facebox").on('click','.icon',function(ev){
				var labFace=$(ev.target).attr('labFace');
				assign.setCaret();
				assign.insertAtCaret(labFace);
			})
			var offset = $(this).position();
			var top = offset.top + $(this).outerHeight();

			$('#'+id).show();

			e.stopPropagation();
		});
		
		$(document).on('click',function(){
			$('#'+id).hide();
			$('#'+id).remove();
		});
		
	};

	$.extend({ 
				unselectContents: function(){ 
					if(window.getSelection) 
						window.getSelection().removeAllRanges(); 
					else if(document.selection) 
						document.selection.empty(); 
					} 
			}); 
			$.fn.extend({ 
				selectContents: function(){ 
					$(this).each(function(i){ 
						var node = this; 
						var selection, range, doc, win; 
						if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
							range = doc.createRange(); 
							range.selectNode(node); 
							if(i == 0){ 
								selection.removeAllRanges(); 
							} 
							selection.addRange(range); 
						} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
							range.moveToElementText(node); 
							range.select(); 
						} 
					}); 
				}, 

				setCaret: function(){
					//if(!$.browser.msie) return; //xueln bug
					var initSetCaret = function(){ 
						var textObj = $(this).get(0); 
						//textObj.caretPos = document.selection.createRange().duplicate(); 
						textObj.focus()
					}; 
					$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
					//$(this).trigger('click')
				}, 

				insertAtCaret: function(textFeildValue){ 
					var textObj = $(this).get(0); 
					$(this).parent().next().css('background','#f03a0e')
					if(document.all && textObj.createTextRange && textObj.caretPos){ 
						var caretPos=textObj.caretPos; 
						caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? 
						textFeildValue+'' : textFeildValue;
						textObj.focus()
					} else if(textObj.setSelectionRange){ 
						var rangeStart=textObj.selectionStart; 
						var rangeEnd=textObj.selectionEnd; 
						var tempStr1=textObj.value.substring(0,rangeStart); 
						var tempStr2=textObj.value.substring(rangeEnd); 
						textObj.value=tempStr1+textFeildValue+tempStr2; 
						textObj.focus(); 
						var len=textFeildValue.length; 
						textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
						//textObj.blur(); 
					}else{ 
						textObj.value+=textFeildValue; 
						textObj.focus()
					} 
				} 
		});




export default $;