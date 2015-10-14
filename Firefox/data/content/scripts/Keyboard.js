Keyboard = function(keyTitlesAndCodes, symbolSet){
	this.createButtons(keyTitlesAndCodes, symbolSet);

	this.field = new Field();
	this.physical = new KeyboardPhysical(this);
}

Keyboard.prototype.createButtons = function(keyTitlesAndCodes, symbolSet){
	this.keyLetters = [];

	for(var i1 = 0; i1 < keyTitlesAndCodes.length; i1++){
		var symbols = {
			lowerCase: symbolSet[i1][0],
			upperCase: symbolSet[i1][1],
		}
		this.keyLetters.push(new KeyLetter(this, keyTitlesAndCodes[i1][1], symbols));
	}
}

Keyboard.prototype.setField = function(newField, newWindow, params){
	this.field.focus(newField, newWindow);
};

Keyboard.prototype.fieldBlur = function(){
	this.field.blur();
};

Keyboard.prototype.keyDown = function(event){
	if(!this.field.active)
		return;
	this.physical.keyDown(event);
};

Keyboard.prototype.addLetter = function(symbol){
	this.field.addSymbol(symbol);
}
