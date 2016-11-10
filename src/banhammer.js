"use strict"
/**
 * Send mail to reciever, with subject and body
 * all args is string and required
 */
function sendMail(reciever, subject, body){
$.ajax({
  url:"/GIMPLI-ChatModWebsite/secure/main.faces",
  method: "post",
  headers: {
	"Accept": "application/xml, text/xml, */*; q=0.01", 
	"Faces-Request": "partial/ajax",
  },
  data: {
	"javax.faces.partial.ajax": true,
	"javax.faces.source": "j_idt328:j_idt333",
	"javax.faces.partial.execute": "@all",
	"javax.faces.partial.render": "j_idt328:newmailvalidator inner_dialog",
	"j_idt328:j_idt333": "j_idt328:j_idt333",
	"j_idt328": "j_idt328",
	"j_idt328:addressee": reciever,
	"j_idt328:subject": subject,
	"j_idt328:message": body,
	"javax.faces.ViewState": $("#j_id1\\:javax\\.faces\\.ViewState\\:2").val()
  },
  success:function(_0,_1,x){ 
	console.log(x);
}})}


/**
 * Ban user for specifed duration. 
 * @param username string name of the user
 * @param duration int ban duration
 */
function banUser(username, duration) {
	if (isNaN(duration)) {alert("duration must be integer!");return;} //5 15 30 60 120 240 480 720 1440 2880 4320 5760 4320 10080 0
	if (!username.length) {{alert("username can not be empty!");return;}}

$.ajax({
  url:"/GIMPLI-ChatModWebsite/secure/main.faces",
  method: "post",
  headers: {
	"Accept": "application/xml, text/xml, */*; q=0.01", 
	"Faces-Request": "partial/ajax"
  },
  data: {
	"javax.faces.partial.ajax": true,
	"javax.faces.source": "j_idt314:j_idt326",
	"javax.faces.partial.execute": "j_idt314",
	"javax.faces.partial.render": "j_idt314:banmessage",
	"j_idt314:j_idt326": "j_idt314:j_idt326",
	"j_idt314": "j_idt314",
	"j_idt314:banplayername": username,
	"j_idt314:language_focus": "",
	"j_idt314:language_input": "English",
	"j_idt314:duration_focus": "",
	"j_idt314:duration_input": duration,
	"j_idt314:reason_focus": "",
	"j_idt314:reason_input": "Please report to MOD_Tjsolomon",
	"javax.faces.ViewState": $("#j_id1\\:javax\\.faces\\.ViewState\\:2").val()
  },
success:function(_0,_1,x){
	console.log(x);
}})}