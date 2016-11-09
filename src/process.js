"use strict"
var players=[],result={},MAX_THREADS=5,
  rwct='<div id=main_dialog class="ui-outputpanel ui-widget GS_output"><div class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-draggable ui-overlay-visible" style="width: auto; height: auto; left: 713px; top: 15.5px; visibility: visible; z-index: 1005;" role=dialog aria-labelledby=dialog0_title aria-hidden=false aria-live=polite><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id=dialog0_title class=ui-dialog-title>Результаты обработки</span><a href=# class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" role=button><span class="ui-icon ui-icon-closethick"/></a></div><div class="ui-dialog-content ui-widget-content" style="height: auto;"><table><thead><tr><td>имя</td><td colspan=6>каналы</td></thead><tbody class=process_result_container></tbody></table></div><div class="ui-dialog-footer ui-widget-content"></div></div></div>',
  //rwcs='{{css_template}}',
  rwlt='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
  rwc=$(rwct).attr({"id":"result_container"+(new Date).getTime()}).appendTo($("body"));
rwc.find(".ui-icon-closethick").click(function(e) {$(e.target).parents(".ui-outputpanel").remove()}); //close action
rwc.find(".ui-dialog").resizable(); //make result window resizable
rwc=$(".process_result_container:last"); //change to tbody.process_result_container


$("td[role=gridcell] span").each(function(i,v) {if(v.title.length)players.push(v.title)});

//REMOVE THIS!!!!
//players=["Ackol0","Aleks222"];


$.each(players, collectData);

//function sleep(ms) {return new Promise(function(resolve){setTimeout(resolve, ms)})}

//var gi=-1; //global counter
//var vs;
//var interval=setInterval(function(){
	//var vst=$("#search_tab\\:player_search\\:search_form [name=javax\\.faces\\.ViewState]").val();
	//if (vs==vst) return; //wait for ViewState updated;
	//vs=vst;
//	if(!players[++gi]) clearInterval(interval)
//	else{collectData(players[gi])}
//},10)

function collectData(_,name){ //for script size optimization

if (!name.length || typeof(name)!="string") return; //do nothing if name is empty or not a string
$.ajax({
  url:"http://chatmod.de.heroes-online.com/GIMPLI-ChatModWebsite/secure/main.faces",
  method: "post",
  "async":false,
  headers: {	
	"Accept": "application/xml, text/xml, */*; q=0.01", 
	"Faces-Request": "partial/ajax",
	"Expires" : 0
  },
  data:{
    "javax.faces.partial.ajax": true,
	"javax.faces.source": "search_tab:player_search:search_form:j_idt295",
	"javax.faces.partial.execute": "search_tab:player_search:search_form:input",
	"javax.faces.partial.render": "search_tab:player_search:search_form:output search_tab:player_search:search_form:messages",
	"search_tab:player_search:search_form:j_idt295": "search_tab:player_search:search_form:j_idt295",
	"search_tab:player_search:search_form": "search_tab:player_search:search_form",
	"search_tab:player_search:search_form:playerName": name, //player name
	"search_tab:player_search:search_form:j_idt290": 3,
	"javax.faces.ViewState": $("#search_tab\\:player_search\\:search_form [name=javax\\.faces\\.ViewState]").val()
  },
  
  success:function(_0,_1,x){ //2 first arguments to trash
	  var data={};
	  //deprecated code commented: parse post data from URLUnencoded to JS object and grab user name
	  // this.data.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
		// data[decodeURIComponent(key)] = decodeURIComponent(value);
	  // }); 
	  // var name=data["search_tab:player_search:search_form:playerName"];
	  var rhtml=x.responseXML.firstChild //partial-response#j_id1
		.firstChild //changes
		.childNodes[1] //update#search_tab:player_search:search_form:output
		.firstChild //textNode
		.nodeValue
	
	  var jqr=$(rhtml);
	  if (jqr.find("#search_tab\\:player_search\\:search_form\\:online").html()=="false") {result[name]={"online_status":false}; return;} //if user offline
	  result[name]={"online_status":true, "channels":[]} //init current user obj;
	  var channels_array;
	  try {
		channels_array=jqr.find("#search_tab\\:player_search\\:search_form\\:channels").html().split('<br>');
	  } catch (e) {console.log(jqr); return;}
	  if (!channels_array.length) return; //stop processsing if channels array is empty
	  var rwl=$(rwlt).appendTo(rwc); //insert new line to result contatiner
	  rwl.find("td:eq(0)").html(name);
	  //$(channels_array).each(function(i,v) {
	  for(var i in channels_array) {var v=channels_array[i];
		  v=v.trim();
		  if(!v.length) return; //stop processing if value is empty
		  var ar=v.split('_'),pos=(new Number(ar[0]))+1;
		  result[name].channels.push(v); //push to result var
		  rwl.find("td:eq("+pos+")").html(v); //and set table cell content
	  }
      //})
  },
  error: function(){}
})

}