var Field;
Field = function(){
  this.active = false;
  this.field = null;
  this.window = null;
}

Field.prototype.focus = function(newField, newWindow){
  this.active = true;
  this.field = newField;
  this.window = newWindow;
};

Field.prototype.blur = function(){
  this.active = false;
  this.field = null;
  this.window = null;
}

Field.prototype.addSymbol = function(word){
  if (!this.active)
    return;
  this.window.document.execCommand("insertText", false, word)
}
