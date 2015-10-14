var KeyLetter = function(kb, physicalKeyCode, symbols){
  this.kb = kb;
  this.code = physicalKeyCode;
  this.symbols = symbols;
  /*    example of symbols object
	symbols = {
	    lowerCase: 'q',
	    upperCase: 'Q',
	  }                     */
}

KeyLetter.prototype.action = function(isShift){
  if(isShift){
    if(this.symbols.upperCase !== '')
      this.kb.addLetter(this.symbols.upperCase);
  }else{
    if(this.symbols.lowerCase !== '')
      this.kb.addLetter(this.symbols.lowerCase);
  }
}
