var chip8 = function(){
	this.reset();
};

// Resets parameters of the emulator, saved into a reset() function
chip8.prototype.reset = funtion(){
	//Program Counter
	this.pc

	//Memory
	this.memory = new Array(4096); // Standard Chip8 memory size

	//Stack
	this.stack = new Array(16); // According to Wikipedia page, modern systems use 16 levels

	//Stack Pointer
	this.sp = 0;

	//"V" Registers
	this.v = new Array(16);

	// "I" Registers
	this.i = 0;

	// Delay Timer
	this.delayTimer = 0;

	//Sound Timer
	this.soundTimer = 0;

}

