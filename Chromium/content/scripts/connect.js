var created = false;
var additionalKeyboard;
var HANDLE_SELECTORS = 'textarea, input, [contentEditable]';
var NON_HANDLE_SELECTORS = ':button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

topCreate = function(){
  if(document.URL.indexOf("https://www.google.ru/_/chrome/newtab") != -1)
		return;
  if(created)
    return;
  created = 1;
	chrome.storage.local.get(['symbolSet'], function (result) {
		additionalKeyboard = new Keyboard(keyTitlesAndCodes, result.symbolSet);
		keyboardConnectionOn();
		created = true;
		ckeditorKludge();
    $(setFocusIfAutofocus);
	});
}

var turnOff = function(){
	if(!created)
		return;
  created = false;
  keyboardConnectionOff();
  delete virtualKeyboard;
}

keyboardConnectionOn = function(){
	// set events
		$('html').on('focus', HANDLE_SELECTORS, f_focus);
		$('html').on('blur', HANDLE_SELECTORS, f_blur);
		$('html').on('keydown', HANDLE_SELECTORS, f_keyDown);
};

keyboardConnectionOff = function(){
	// unset events
  $('html').off('focus', HANDLE_SELECTORS, f_focus);
  $('html').off('blur', HANDLE_SELECTORS, f_blur);
  $('html').off('keydown', HANDLE_SELECTORS, f_keyDown);
};

var f_focus = function(e){
  if($(this).is(NON_HANDLE_SELECTORS))
    return false;
  window.additionalKeyboard.setField(this, self);
}

var f_blur = function(e){
	window.additionalKeyboard.fieldBlur();
}
var f_keyDown =  function(e){
  window.additionalKeyboard.keyDown(e);
}

var ckeditorKludge = function(){
  // если скрипт не запустился в iframe (костыль для ckeditor)
  // if script was not run on iframe (its for ckeditor)
  setTimeout(function(){
    setInterval(function(){
      if(!created)
        return;
      for(var i = 0; i < window.frames.length ; i++){
        try {
          if(!window.frames[i].additionalKeyboard){
            window.frames[i].additionalKeyboard = true;
            content = $(window.frames[i].document).contents().find('body').parent();
            content.on('focus', HANDLE_SELECTORS, function(e){
              if(!created) return;
              if($(this).is(NON_HANDLE_SELECTORS))
                return false;
              additionalKeyboard.setField(this, e.view.window);
            });
            content.on('blur', HANDLE_SELECTORS, function(){
              if(!created) return;
              additionalKeyboard.fieldBlur();
            });
            content.on('keydown', HANDLE_SELECTORS, function(e){
              if(!created) return;
              additionalKeyboard.keyDown(e);
            });
          }
        } catch(e){}
      }
    }, 500);
  }, 500);
}

var setFocusIfAutofocus = function(){
  if(document.activeElement != document.getElementsByTagName('body')[0]){
      if($(document.activeElement).is('input:password')){
        additionalKeyboard.setField(document.activeElement, self, {animate: false});
        return;
      }
      if($(document.activeElement).is(NON_HANDLE_SELECTORS)){
        return false;
      }
      additionalKeyboard.setField(document.activeElement, self);
  }
}

topCreate();

chrome.runtime.onMessage.addListener(function(data){
  switch(data.eve){
    case "rebult":
      turnOff();
      topCreate();
			break;
  }
})
