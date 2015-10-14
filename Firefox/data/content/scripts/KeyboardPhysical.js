KeyboardPhysical = function(kb){
	this.kb = kb;
}

KeyboardPhysical.prototype.keyDown = function(event){
	this.code = event.originalEvent.code;
	this.event = event;

	if((!this.isEventInKeysRange()) || (!this.kb.field.active))
		return;

	if(this.keyLettersDown())
		this.stopEvent();
}

KeyboardPhysical.prototype.stopEvent = function(){
	this.event.preventDefault();
	this.event.stopPropagation();
}

KeyboardPhysical.prototype.keyLettersDown = function(){
	for(var i = this.kb.keyLetters.length-1; i > -1 ; i--)
		if(this.kb.keyLetters[i].code === this.code){
			this.kb.keyLetters[i].action(this.event.shiftKey);
			return true;
		};
	return false;
}

KeyboardPhysical.prototype.isEventInKeysRange = function(){
	// Ctrl + Alt - true
	// Ctrl + Alt + Shift - true
	// else - false
	var ctrl = this.event.ctrlKey;
	var alt = this.event.altKey;
	var meta = this.event.metaKey;

	var ans = (ctrl && alt) && !(meta);
	return ans;
}
