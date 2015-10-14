var Field = function(){
	this.active = false;
	this.field = null;
	this.document = null;
	this.type = undefined;
}

Field.prototype.focus = function(newField, newDoc){
  this.active = true;
	this.field = newField;
	this.document = newDoc;
	this.type = $(this.field).is('textarea, input') ? 'input' : 'contentEditable' ;
};

Field.prototype.blur = function(){
  this.active = false;
	this.field = null;
	this.document = null;
	this.type = undefined;
}

Field.prototype.addSymbol = function(word){
	var isExecCommand = false;
	try{
		if(this.document.execCommand("insertText", false, word)){
			isExecCommand = true;
		}
	}
	catch(err) {
		isExecCommand = false;
	}
	if((!isExecCommand) && $(this.field).is('textarea, input')){
		var selectStart = this.field.selectionStart;
		var selectEnd = this.field.selectionEnd;
		var textBegin = this.field.value.substring(0,selectStart);
		var textEnd = this.field.value.substring(selectEnd,this.field.value.length);
		this.field.value = textBegin + word + textEnd;
		this.field.setSelectionRange(selectStart+word.length,selectStart+word.length);
	};
}
