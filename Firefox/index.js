CURRENT_VERSION = "0.1";
DEFAULT_SET = [
	[ "~","~"],
	[ "1","!"],
	[ "2","@"],
	[ "3","#"],
	[ "4","$"],
	[ "5","%"],
	[ "6","^"],
	[ "7","&"],
	[ "8","*"],
	[ "9","("],
	[ "0",")"],
	[ "-","_"],
	[ "=","+"],
	[ "!","😊"],
	[ "@","😩"],
	[ "#","✋"],
	[ "÷","☺"],
	[ "%","👍"],
	[ "^",""],
	[ "&","😒"],
	[ "*","💁"],
	[ "(","👌"],
	[ ")","😔"],
	[ "_",""],
	[ "+",""],
	[ "—","☝️"],
	[ "α","😉"],
	[ "β","😏"],
	[ "π","😎"],
	[ "√","😳"],
	[ "≠","😁"],
	[ "∞","😍"],
	[ "ƒ","😂"],
	[ "","😘"],
	[ "","❤️"],
	[ "¶",""],
	[ "§",""],
	[ "€",""],
	[ "$","👏"],
	[ "£","😭"],
	[ "¥","✌️"],
	[ "©","😊"],
	[ "®","🙈"],
	[ "","🙉"],
	[ "«","🙊"],
	[ "»",""],
	[ "",""],
	[ "X",""],
	[ "I",""],
	[ "II",""],
	[ "III",""],
	[ "IV",""],
	[ "V",""],
	[ "VI",""],
	[ "VII",""],
	[ "VIII",""],
	[ "IX",""]
]
//	Firefox API
var storage = require("sdk/simple-storage").storage;
var array = require('sdk/util/array');
var data = require("sdk/self").data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var pageMod = require("sdk/page-mod");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");

// set default options
if(storage.symbolSet === undefined){
	storage.symbolSet = DEFAULT_SET;
}


// button on panel

openOptionsPage = function(){
	tabs.open(data.url("options/index.html"));
	button.state('window', {checked: false});
}

var button = ToggleButton({
	id: "style-tab",
	label: "Additional Keyboard Symbols",
	icon: "icons/16.png",
	icon: {
		"16": "./icons/16.png",
		"32": "./icons/32.png",
	},
	badgeColor: "#111",
	onClick: openOptionsPage
});

var contentPages = [];

pageMod.PageMod({
	include: "*",
	attachTo: ["frame", "top"],
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("include/jquery.js"), data.url("objects.js"), data.url("content/scripts/Field.js"),
		data.url("content/scripts/Key.js"), data.url("content/scripts/KeyboardPhysical.js"),
		data.url("content/scripts/Keyboard.js"), data.url("content/scripts/connect.js")
	],
	onAttach: function(worker){
		worker.on('pageshow', function() { contentPages.push(this); });
		worker.on('pagehide', function() {
			var index = contentPages.indexOf(this);
			if (index > -1)
			    contentPages.splice(index, 1);
		})
		worker.on('detach', function() {
			var index = contentPages.indexOf(this);
			if (index > -1)
			    contentPages.splice(index, 1);
		})

		worker.port.emit('create', {symbolSet: storage.symbolSet});
	}
});

switchOn = function(){
	for(var i=0; i < contentPages.length; i++){
		contentPages[i].port.emit('create', {symbolSet: symbolSet});
	}
}
switchOff = function(){
	for(var i=0; i < contentPages.length; i++){
		contentPages[i].port.emit('destroy');
	}
}

// Options
var optionPage;
pageMod.PageMod({
	include: [data.url("options/index.html"), data.url("browser-keyboard.github.io/*")],
	contentScriptFile: [data.url("include/angular.js"),data.url("include/emojione.min.js"), data.url("objects.js"), data.url("options/script.js")],
	contentStyleFile: [data.url("include/emojione.min.css"), data.url("options/style.css")],
	onAttach: function(worker){
		optionPage = this;

		worker.port.on('reset', function(){
			resetOptions();
		});
		worker.port.on('default', function(){
			defaultOptions();
		});
		worker.port.on('save', function(params){
			saveOptions(params);
		});
	}
});

resetOptions = function(){
	optionPage.port.emit('setInfo', {symbolSet: storage.symbolSet});
}
defaultOptions = function(){
	optionPage.port.emit('setDefaulto', {defaultSet: DEFAULT_SET});
}
saveOptions = function(params){
	switchOff();

	storage.symbolSet = params.symbolSet;
}

checkIsNewVersion = function(){
	// Checking for update instead Mozilla, because it has long queue
	var Request = require("sdk/request").Request;
	Request({
		url: "http://browser-keyboard.github.io/firefox/info-additional.json",
		onComplete: function (response) {
			console.log(response);
			console.log(response[0]);
			if(response.json.version.substring(0,3) != CURRENT_VERSION){
				tabs.open(data.url(response.json.update_page));
				storage.prevDay = new Date()*1;
			}
		}
	}).get()
}

if(storage.isActive){
	switchOn();

	var today = new Date();
	if(!storage.prevDay){
		storage.prevDay = today *1;
	}

	if(storage.prevDay <= (today - 7 * 24 * 60 * 60 * 1000)){
		checkIsNewVersion()
	}
}

if(!storage.was_installed){
	storage.was_installed = true;
	openOptionsPage();
	checkIsNewVersion();
}
