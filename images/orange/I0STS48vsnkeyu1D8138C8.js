﻿/*
	[Discuz!] (C)2001-2009 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$Id: portal.js 16908 2010-09-16 10:40:05Z zhangguosheng $
*/

function block_get_setting(classname, script, bid) {
	var x = new Ajax();
	x.get('portal.php?mod=portalcp&ac=block&op=setting&bid='+bid+'&classname='+classname+'&script='+script+'&inajax=1', function(s){
		ajaxinnerhtml($('tbody_setting'), s);
	});
}

function switch_blocktab(type) {
	if(type == 'setting') {
		$('blockformsetting').style.display = '';
		$('blockformdata').style.display = 'none';
		$('li_setting').className = 'a';
		$('li_data').className = '';
	} else {
		$('blockformsetting').style.display = 'none';
		$('blockformdata').style.display = '';
		$('li_setting').className = '';
		$('li_data').className = 'a';
	}
}

function showpicedit() {
	if($('picway_remote').checked) {
		$('pic_remote').style.display = "block";
		$('pic_upload').style.display = "none";
	} else {
		$('pic_remote').style.display = "none";
		$('pic_upload').style.display = "block";
	}
}

function block_show_thumbsetting(classname, styleid, bid) {
	var x = new Ajax();
	x.get('portal.php?mod=portalcp&ac=block&op=thumbsetting&classname='+classname+'&styleid='+styleid+'&bid='+bid+'&inajax=1', function(s){
		ajaxinnerhtml($('tbody_thumbsetting'), s);
	});
}

function block_showstyle(stylename) {
	var el_span = $('span_'+stylename);
	var el_value = $('value_' + stylename);
	if (el_value.value == '1'){
		el_value.value = '0';
		el_span.className = "";
	} else {
		el_value.value = '1';
		el_span.className = "a";
	}
}

function block_pushitem(bid, itemid) {
	var id = $('push_id').value;
	var idtype = $('push_idtype').value;
	if(id && idtype) {
		var x = new Ajax();
		x.get('portal.php?mod=portalcp&ac=block&op=push&&bid='+bid+'&itemid='+itemid+'&idtype='+idtype+'&id='+id+'&inajax=1', function(s){
			ajaxinnerhtml($('tbody_pushcontent'), s);
		});
	}
}

function block_delete_item(bid, itemid, itemtype, from) {
	var msg = itemtype==1 ? '您确定要删除该数据吗？' : '您确定要屏蔽该数据吗？';
	if(confirm(msg)) {
		var url = 'portal.php?mod=portalcp&ac=block&op=remove&bid='+bid+'&itemid='+itemid;
		if(from=='ajax') {
			var x = new Ajax();
			x.get(url+'&inajax=1', function(){
				showWindow('showblock', 'portal.php?mod=portalcp&ac=block&op=data&bid='+bid+'&tab=data&t='+(+ new Date()), 'get', 0);
			});
		} else {
			location.href = url;
		}
	}
	doane();
}

function portal_comment_requote(cid) {
	var x = new Ajax();
	x.get('portal.php?mod=portalcp&ac=comment&op=requote&cid='+cid+'&inajax=1', function(s){
		$('message').focus();
		ajaxinnerhtml($('message'), s);
	});
}

function insertImage(text) {
	text = "\n[img]" + text + "[/img]\n";
	insertContent('message', text)
}

function insertContent(target, text) {
	var obj = $(target);
	selection = document.selection;
	checkFocus(target);
	if(!isUndefined(obj.selectionStart)) {
		var opn = obj.selectionStart + 0;
		obj.value = obj.value.substr(0, obj.selectionStart) + text + obj.value.substr(obj.selectionEnd);
	} else if(selection && selection.createRange) {
		var sel = selection.createRange();
		sel.text = text;
		sel.moveStart('character', -strlen(text));
	} else {
		obj.value += text;
	}
}

function searchblock(from) {
	var value = $('searchkey').value;
	var targettplname = $('targettplname').value
	value = BROWSER.ie && document.charset == 'utf-8' ? encodeURIComponent(value) : (value ? value.replace(/#/g,'%23') : '');
	var url = 'portal.php?mod=portalcp&ac=portalblock&searchkey='+value+'&from='+from;
	url += targettplname != '' ? '&targettplname='+targettplname+'&type=page' : '&type=block';
	reloadselection(url);
}

function reloadselection(url) {
	ajaxget(url+'&t='+(+ new Date()), 'block_selection');
}

function getColorPalette(colorid, id, background) {
	return "<input id=\"c"+colorid+"\" onclick=\"createPalette('"+colorid+"', '"+id+"');\" type=\"button\" class=\"colorwd\" value=\"\" style=\"background: "+background+"\">";
}

function listblock_bypage(tpl) {
	var msg = '';
	var sel = $('recommend_bid');
	var elem = $('recommend_pageblock_' + tpl);
	sel.options.length = 0;
	sel.options.add(new Option('选择模块', ''));
	if(elem && elem.options.length) {
		msg = '找到<font color="red">'+elem.options.length+'</font>个相应的模块';
		for(var i=0; i<elem.options.length; i++) {
			var opt = elem.options[i];
			sel.options.add(new Option(opt.text, opt.value));
		}
	} else {
		msg = '<font color="red">没有相应的模块</font>';
	}
	ajaxinnerhtml($('itemeditarea'), '<tr><td>&nbsp;</td><td>&nbsp;'+msg+'</td></tr>');
}

function recommenditem_check() {
	var sel = $('recommend_bid');
	if(sel && sel.value) {
		return true;
	} else {
		alert("请选择一个模块！");
		return false;
	}
}

function recommenditem_byblock(bid, id, idtype) {
	var editarea = $('itemeditarea');
	if(editarea) {
		if(bid) {
			ajaxget('portal.php?mod=portalcp&ac=block&op=recommend&bid='+bid+'&id='+id+'&idtype='+idtype+'&handlekey=recommenditem', 'itemeditarea');
		} else {
			ajaxinnerhtml(editarea, '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>');
		}
	}
}

function blockBindTips() {
	var elems = ($('blockformsetting') || document).getElementsByTagName('img');
	var k = 0;
	var stamp = (+new Date());
	var tips = '';
	for(var i = 0; i < elems.length; i++) {
		tips = elems[i]['tips'] || elems[i].getAttribute('tips') || '';
		if(tips && ! elems[i].isBindTips) {
			elems[i].isBindTips = '1';
			elems[i].id = elems[i].id ? elems[i].id : ('elem_' + stamp + k.toString());
			k++;
			showPrompt(elems[i].id, 'mouseover', tips, 1, true);
		}
	}
}

function blockSetCacheTime(timer) {
	$('txt_cachetime').value=timer;
	doane();
}

function toggleSettingShow() {
	if(!$('tbody_setting').style.display) {
		$('tbody_setting').style.display = 'none';
		$('a_setting_show').innerHTML = '展开设置项';
	} else {
		$('tbody_setting').style.display = '';
		$('a_setting_show').innerHTML = '收起设置项';
	}
	doane();
}

function checkblockname(form) {
	if(!(trim(form.name.value) > '')) {
		alert('模块标识不能为空');
		form.name.focus();
		return false;
	}
	return true;
}

function blockconver(ele,bid) {
	if(ele && bid) {
		if(confirm('你确定要转换模块的类型从 '+ele.options[0].innerHTML+' 到 '+ele.options[ele.selectedIndex].innerHTML)) {
			ajaxget('portal.php?mod=portalcp&ac=block&op=convert&bid='+bid+'&toblockclass='+ele.value,'blockshow');
		} else {
			ele.selectedIndex = 0;
		}
	}
}