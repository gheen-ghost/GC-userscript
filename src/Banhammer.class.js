"use strict"
function Banhammer(name){
	if (!name) {alert("Имя не заданно при создании объекта");throw  "Name can not be empty";return}
	this.name = name;
	this.headers = {"Accept": "application/xml, text/xml, */*; q=0.01", "Faces-Request": "partial/ajax"};
	this._d = {};
	
	this._doFirst3Requests();
	this._searchUser();
}

Banhammer.prototype._getViewState=function(){return $("#j_id1\\:javax\\.faces\\.ViewState\\:0").val()}

Banhammer.prototype._doFirst3Requests=function(){
	var tbid=$("button.ui-button:first").attr("id"); //id of search button
	if (!tbid) {alert("Не найдена кнопка на тулбаре:\n button.ui-button:first"); throw 'selector "button.ui-button:first" not found or can\'t read id property'; return;}
	//first request (ХЗ зачем он нужен)
	var data={};
	data["javax.faces.partial.ajax"] = true;
	data["javax.faces.source"] = tbid;
	data["javax.faces.partial.execute"] = "@all";
	data["javax.faces.partial.render"] = "main_dialog";
	data[tbid]=tbid;
	data["top_bar"] = "top_bar";
	data["javax.faces.ViewState"] = this._getViewState();
	
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		headers:this.headers,
		data: data,
		success:function(_0,_1,x){console.log(x)},
		error:function(){alert("Запрос не был успешно обработан")}
	});
	
	
	//search form request, repeat two times. Don't ask me why :/
	for (var i=0;i<2;i++) {$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		context: this,
		headers: this.headers,
		data: {
			"javax.faces.partial.ajax": true,
			"javax.faces.source": "dialog0",
			"javax.faces.partial.execute": "dialog0",
			"javax.faces.partial.render": "dialog0",
			"dialog0": "dialog0",
			"dialog0_contentLoad": "true",
			"userForm": "userForm",
			"javax.faces.ViewState": this._getViewState()
		},
		success:function(_0,_1,x){console.log(x);
			var rform=$(x.responseXML.firstChild.firstChild.firstChild.firstChild.data);
			this._d.sbid=rform.find("#search_tab\\:player_search\\:search_form\\:input button[type=submit]").attr("id"); //search button id
			this._d.cbid=rform.find("#search_tab\\:player_search\\:search_form\\:worlds input[type=checkbox]").attr("name"); //checkbox name attribute
		},
		error:function(){alert("Запрос не был успешно обработан")}
	})}

}

Banhammer.prototype._searchUser=function(){
	if (!this._d.cbid) {alert("Из запроса формы поиска не найден чекбокс: \n#search_tab:player_search:search_form:worlds input[type=checkbox]"); throw 'selector "#search_tab:player_search:search_form:worlds input[type=checkbox]" not found or can\'t read name property'; return}
	if (!this._d.sbid) {alert("Из запроса формы поиска не найдена кнопка поиска: \n#search_tab:player_search:search_form:input button[type=submit]"); throw 'selector "#search_tab:player_search:search_form:input button[type=submit]" not found or can\'t read id property'; return}
	var data={};
	data["javax.faces.partial.ajax"] = true
	data["javax.faces.source"] = this._d.sbid
	data["javax.faces.partial.execute"] = "search_tab:player_search:search_form:input"
	data["javax.faces.partial.render"] = "search_tab:player_search:search_form:output search_tab:player_search:search_form:messages"
	data[this._d.sbid] = this._d.sbid
	data["search_tab:player_search:search_form"] = "search_tab:player_search:search_form"
	data["search_tab:player_search:search_form:playerName"] = this.name
	data[this._d.cbid] = 3;
	data["javax.faces.ViewState"] = this._getViewState();
	
	//player search request
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		context: this,
		headers: this.headers,
		data: data,
		success:function(_0,_1,x){console.log(x)
			var rdom=$(x.responseXML.firstChild.firstChild.childNodes[1].firstChild.data),
			  re=/\{s:'(.+?)'/,
			  libanClickTxt=rdom.find("#search_tab\\:player_search\\:search_form\\:action_menu_menu li:first a").attr("onclick"), //onclick text from ban menu item
			  limailClickTxt=rdom.find("#search_tab\\:player_search\\:search_form\\:action_menu_menu li:eq(4) a").attr("onclick"); //onclick text from mail menu item
			console.log(rdom, libanClickTxt);
			this._d.bfrid=re.exec(libanClickTxt)[1]; //ban form request id
			this._d.mfrid=re.exec(limailClickTxt)[1]; //mail form request id
		},
		error:function(){alert("Запрос не был успешно обработан")}
	});	
}

Banhammer.prototype._mailFormRequest=function(){
	if (!this._d.mfrid) {alert("Из результатов поиска не найдено действие для запроса формы почты: \n#search_tab:player_search:search_form:action_menu_menu li:eq(4) a");throw 'selector "#search_tab:player_search:search_form:action_menu_menu li:eq(4) a" not found or can\'t read onclick property'; return}
	if (!this._d.cbid) {alert("Из запроса формы поиска не найден чекбокс: \n#search_tab:player_search:search_form:worlds input[type=checkbox]");throw 'selector "#search_tab:player_search:search_form:worlds input[type=checkbox]" not found or can\'t read name property'; return}
	
	var data={};
	data["javax.faces.partial.ajax"] = true;
	data["javax.faces.source"] = this._d.mfrid;
	data["javax.faces.partial.execute"] = this._d.mfrid;
	data["javax.faces.partial.render"] = "inner_dialog";
	data[this._d.mfrid] = this._d.mfrid;
	data["search_tab:player_search:search_form"] = "search_tab:player_search:search_form";
	data["search_tab:player_search:search_form:playerName"] = this.name;
	data[this._d.cbid] = 3;
	data["javax.faces.ViewState"] = this._getViewState();
	
	//mail form request #0
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		headers: this.headers,
		data: data,			 
		success:function(_0,_1,x){console.log(x)},
		error:function(){alert("Запрос не был успешно обработан")}
	});

	//mail form request #1
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		context: this,
		headers: this.headers,
		data: {
			"javax.faces.partial.ajax": true,
			"javax.faces.source": "dialog1",
			"javax.faces.partial.execute": "dialog1",
			"javax.faces.partial.render": "dialog1",
			"dialog1": "dialog1",
			"dialog1_contentLoad": true,
			"userForm": "userForm",
			"javax.faces.ViewState": this._getViewState()
		},
		success:function(_0,_1,x){console.log(x)
			var rdom=$(x.responseXML.firstChild.firstChild.firstChild.firstChild.data);
			this._d.mfid=rdom.attr("id"); //mail form id
			this._d.mfbtnid=rdom.find("button:first").attr("id"); //mail form send button id
		},
		error:function(){alert("Запрос не был успешно обработан")}
	});
}

Banhammer.prototype._banFormRequest=function(){
	if (!this._d.bfrid) {alert("из результатов поиска не найдено действие для запроса формы бана: \n#search_tab:player_search:search_form:action_menu_menu li:first a"); throw 'selector "#search_tab:player_search:search_form:action_menu_menu li:first a" not found or can\'t read onclick property'; return}
	if (!this._d.cbid) {alert("Из запроса формы поиска не найден чекбокс: \n#search_tab:player_search:search_form:worlds input[type=checkbox]");throw 'selector "#search_tab:player_search:search_form:action_menu_menu li:eq(4) a" not found or can\'t read onclick property'; return}
	
	var data={};
	data["javax.faces.partial.ajax"] = true;
	data["javax.faces.source"] = this._d.bfrid;
	data["javax.faces.partial.execute"] = this._d.bfrid;
	data["javax.faces.partial.render"] = "inner_dialog";
	data[this._d.bfrid] = this._d.bfrid;
	data["search_tab:player_search:search_form"] =  "search_tab:player_search:search_form";
	data["search_tab:player_search:search_form:playerName"] = name;
	data[this._d.cbid] = 3;
	data["javax.faces.ViewState"] = this._getViewState();
	
	//ban form request #0
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		headers: this.headers,
		 data: data,
		 success:function(_0,_1,x){console.log(x)},
		 error:function(){alert("Запрос не был успешно обработан")}
	});

	//ban form request #1
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		context: this,
		headers: this.headers,
		data: {
			"javax.faces.partial.ajax": true,
			"javax.faces.source": "dialog1",
			"javax.faces.partial.execute": "dialog1",
			"javax.faces.partial.render": "dialog1",
			"dialog1": "dialog1",
			"dialog1_contentLoad": true,
			"userForm": "userForm",
			"javax.faces.ViewState": this._getViewState()
		},
		success:function(_0,_1,x){console.log(x);
			var rdom=$(x.responseXML.firstChild.firstChild.firstChild.firstChild.data), re=/{s:'(.+?)'/;
			this._d.bfid=rdom.attr("id"); //ban form id
			//this._d.bfbtnid=rdom.find("button:first").attr("id"); //Ban form Ok button id
			this._d.bsid=re.exec(rdom.find("script:last").html())[1];
			this._d.br=rdom.find(`#${this._d.bfid}\\:reason_input option:first`).attr("value"); //ban reason
		},
		error:function(){alert("Запрос не был успешно обработан")}
	});
}

/**
 * Send mail to this.name, with subject and body specified
 * all args is string and required
 */
Banhammer.prototype.sendMail=function(subject, body) {
	if (!subject || !body) {alert("Отправка почты не возможна: не заданны все параметры"); return}
	this._mailFormRequest();
	if (!this._d.mfbtnid) {alert("Из запроса формы почты не найдена кнопка отправки: \nbutton:first");throw 'selector "button:first" not found in mail form or cant\'read id property'; return}
	if (!this._d.mfid) {alert("Из запроса формы почты не найдена сама форма");throw 'mail form not found or can\'t read if property'; return}
	
//	doFirst3Requests();
//	searchUser(reciever);
	
	var data={};
	data["javax.faces.partial.ajax"] = true;
	data["javax.faces.source"] = this._d.mfbtnid;
	data["javax.faces.partial.execute"] = "@all";
	data["javax.faces.partial.render"] = `${this._d.mfid}:newmailvalidator inner_dialog`;
	data[this._d.mfbtnid] = this._d.mfbtnid;
	data[this._d.mfid] = this._d.mfid;
	data[`${this._d.mfid}:addressee`] = this.name;
	data[`${this._d.mfid}:subject`] = subject;
	data[`${this._d.mfid}:message`] = body;
	data["javax.faces.ViewState"] = this._getViewState();
	
	//mail send request
	$.ajax({
		url:"/GIMPLI-ChatModWebsite/secure/main.faces",
		method: "post",
		timeout: 3000,
		async: false,
		headers: this.headers,
		data: data,
		success:function(_0,_1,x){console.log(x);
			var color = x.responseXML.firstChild.firstChild.childNodes[1].firstChild.data.indexOf("Successfully sent") ? "green" : "red";
			Banhammer.form.find(".mail_sent_result").css({"color":color}); Banhammer.form.mail_success = (color == "red") ? false : true;
		},
		error:function(){alert("Запрос не был успешно обработан")}
	});
}

/**
 * Ban user for specifed duration. 
 * @param duration positive int ban duration
 */
Banhammer.prototype.ban=function(duration) {
	if (isNaN(duration)) {alert("duration must be integer!");return;} //5 15 30 60 120 240 480 720 1440 2880 4320 5760 4320 10080 0
	this._banFormRequest();
	if (!this._d.bsid) {alert("Из запроса формы бана не найден скрипт с функцией отправки: script:last"); throw 'selector "script:last" not found in ban form or can\'t find regexp"/{s:\'(.+)\'/"'; return}
	if (!this._d.bfid) {alert("Из запроса формы бана не найдена сама форма");"ban form not found or can't read id property"; return}
	if (!this._d.br) {alert("Из запроса формы бана не найдено поле причины \n ${this._d.bfid}:reason_input option:first");'selector "#${this._d.bfid}\\:reason_input option:first" not found in ban form or can\'t read value property'; return} 
	
	var data={};
	data["javax.faces.partial.ajax"] = true;
	data["javax.faces.source"] = this._d.bsid;
	data["javax.faces.partial.execute"] = this._d.bfid;
	data["javax.faces.partial.render"] = `${this._d.bfid}:banmessage`;
	data[this._d.bsid] = this._d.bsid;
	data[this._d.bfid] = this._d.bfid;
	data[`${this._d.bfid}:banplayername`] = this.name;
	data[`${this._d.bfid}:language_focus`] = "";
	data[`${this._d.bfid}:language_input`] = "English";
	data[`${this._d.bfid}:duration_focus`] = "";
	data[`${this._d.bfid}:duration_input`] = duration;
	data[`${this._d.bfid}:reason_focus`] = "";
	data[`${this._d.bfid}:reason_input`] = this._d.br;
	data["javax.faces.ViewState"] = this._getViewState();
	
	$.ajax({
	  url:"/GIMPLI-ChatModWebsite/secure/main.faces",
	  method: "post",
	  timeout: 3000,
	  async: false,
	  headers: this.headers,
	  data: data,
	  success:function(_0,_1,x){
		console.log(x);
		var color = x.responseXML.firstChild.firstChild.firstChild.firstChild.data.indexOf("Ban successful") ? "green" : "red";
		Banhammer.form.find(".ban_result").css({"color":color}); Banhammer.form.ban_success = (color == "red") ? false : true;
	  },
		error:function(){alert("Запрос не был успешно обработан")}
	})
}

/**
 * 
 * @param tpl string template to save
 */
Banhammer.saveTpl=function(e) {
	var tpl=$(e).parents("td").find("#ban_template").val();
	tpl=encodeURIComponent(tpl);
	document.cookie = `bwtpl=${tpl}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
}

Banhammer.btnAction=function() {
	var w=Banhammer.form,
		username=w.find("#ban_username").val(),
		subject=w.find("#ban_subject").val(),
		ban_tpl=w.find("#ban_template").val(),
		duration=w.find("li.selected").attr("data-duration"),
		duration_text=w.find("li.selected").text(),
		reason=ban_tpl.replace("{{ban_time}}", duration_text).replace("{{ban_reason}}",w.find("#ban_reason").val());
		
		if (isNaN(duration)) {alert("Не выбран срок");return}
		if (!subject) {alert("Тема не может быть пустой");return}
		if (!reason) {alert("Сообщение (причина) не может быть пустым");return}
		
		var o=new Banhammer(username);
		o.sendMail(subject, reason);
		o.ban(duration);
}

Banhammer.showForm=function(name){
	if (Banhammer.form_showed) return;
	Banhammer.form_showed=true;
	if (!name) name="";
	var mail_tpl,matches=/bwtpl=(.+?)(;|$)/.exec(document.cookie);
	mail_tpl=(matches) ? decodeURIComponent(/bwtpl=(.+?)(;|$)/.exec(document.cookie)[1]) : "Вам ограничен доступ к чату по причине {{ban_reason}}\nСрок {{ban_time}}\nС полным текстом правил чата вы можете ознакомится тут http://forum.ru.heroes-online.com/showthread.php?t=6&p=41&viewfull=1#post41";	
	var tpl=`<div class="ui-outputpanel ui-widget GS_ban_form" style="z-index:9999;position:absolute"><div style="left:535px;top:10px" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-draggable ui-overlay-visible"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span class="ui-dialog-title">Кого забаним?</span><a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick"/></a></div><div class="ui-dialog-content ui-widget-content" style="height: auto;"><table><tbody class="ban_form"><tr><td class="ban_time"><div class="ui-selectonemenu-panel ui-widget-content ui-corner-all" style="position:static;margin-left:20px;"><div class="ui-selectonemenu-items-wrapper" style="height:auto"><ul class="ui-selectonemenu-items ui-selectonemenu-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"><li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="5">5 минут</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="15">15 минут</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="30">30 минут</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" style="padding-bottom: 15px !important;" data-duration="60">1 час</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="120">2 часа</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="180">3 часа</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="240">4 часа</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="480">8 часа</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" style="padding-bottom: 15px !important;" data-duration="720">12 часов</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="1440">1 день</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="2880">2 дня</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="4320">3 дня</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="5760">4 дня</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" data-duration="10080">7 дней</li> <li class="ui-selectonemenu-item ui-selectonemenu-list-item ui-corner-all" style="background:#ebccd1; color:#a94442;" data-duration="0">НАВСЕГДА!</li></ul></div></div></td><style>td.ban_time li.selected::before{color:#0b66b1;content:"●";left:30px;position:absolute;}</style><td style="padding:20px">Имя пользователя:<br/> <input id="ban_username" value="${name}" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" style="width:300px"type="text"/> <br/><br/>Тема:<br/> <input type="text" id="ban_subject" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" style="width:300px" value="Бан" /> <br/><br/>Шаблон: [<a href="#" onclick="Banhammer.saveTpl(this);return false">&#x1f4be;</a>]<br/> <textarea id="ban_template" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" style="width:300px;height:150px">${mail_tpl}</textarea> <br/><br/>Причина:<br/> <textarea id="ban_reason" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" style="width:300px;height:62px"/></td></tr><tr><td colspan="2" style="text-align:right"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" onclick="Banhammer.btnAction(this)" type="button" aria-disabled="false"><span class="ui-button-text ui-c">Забанить нахрен!</span></button></td></tr></tbody></table></div><div class="ui-dialog-footer ui-widget-content">send mail: <span class="mail_sent_result">●</span>&nbsp;&nbsp;&nbsp;ban: <span class="ban_result">●</span></div></div></div>`,
		w=$(tpl).appendTo("body"); Banhammer.form=w;
		w.find("li")
			.click(function(e){
				$(".GS_ban_form li").removeClass("selected");
				$(e.target).addClass("selected")
			});
		w.find(".ui-dialog")
			.draggable()
			.find(".ui-icon-closethick")
			.click(function(e){$(e.target).parents(".GS_ban_form").remove(); Banhammer.form_showed=false});
}


//Main code
var ctrlKeyPressed; //boolean for controlling Ctrl key

//controlling pressed keys
$("body").keyup(function(e){if(e.which==17)ctrlKeyPressed=false;})
	.keydown(function(e){ 
		if(e.which==17)ctrlKeyPressed=true;
		var txt=getSelection().toString();
		if(!ctrlKeyPressed || e.which!=13 || txt.length==0) return;
		document.execCommand("copy"); //copy text to clipboad
		var re=/^\[\d{1,2}:\d{2} (A|P)M\]\s+(.+):/,
			nick=txt.match(re)[2];
		
		Banhammer.showForm(nick);
});
