var contentKeyboard;
self.port.on('create', function(params){
	contentKeyboard = new Keyboard(keyTitlesAndCodes, params.symbolSet);
	$('html').on('focus', selector, f_focus);
	$('html').on('blur', selector, f_blur);
	$('html').on('keydown', selector, f_keyDown);
	$(setFocusIfIsAutofocusField);
});
self.port.on('destroy', function(){
	$('html').off('focus', selector, f_focus);
	$('html').off('blur', selector, f_blur);
	$('html').off('keydown', selector, f_keyDown);
  delete contentKeyboard;
});

var selector = 'textarea, input, [contentEditable]';
var nonSelector = ':button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

var f_focus = function(e){
	if($(this).is(nonSelector))
		return false;
	contentKeyboard.setField(this, document);;
}
var f_blur = function(e){
	contentKeyboard.fieldBlur();
}
var f_keyDown =  function(e){
	contentKeyboard.keyDown(e);
}

var setFocusIfIsAutofocusField = function(){
	if(document.activeElement != document.getElementsByTagName('body')[0]){
		// если при загрузки странницы установлен автофокус на текстовом поле
		if($(document.activeElement).is('input:password')){
			contentKeyboard.setField(document.activeElement, document);
			setTimeout(function(){self.port.emit('setField', {animate: false});}, 600);
		}else if(!$(document.activeElement).is(nonSelector)){
			contentKeyboard.setField(document.activeElement, document);
			setTimeout(function(){self.port.emit('setField', {});}, 600);
		}
	}
}
