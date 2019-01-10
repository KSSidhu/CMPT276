//Referenced http://blog.alexanderdickson.com/javascript-chip-8-emulator for initialization and reset function


var chip8 = function(){

	//Initialize the chip8 emulator

	//Program Counter
	this.pc = 0

	//Memory
	this.memory = new Array(0x1000); // Standard Chip8 memory size, 4096 bytes

	//Stack
	this.stack = new Array(16); // According to Wikipedia page, modern systems use 16 levels

	//Stack Pointer
	this.sp = 0;

	//"V" Registers
	this.v = new Array(16); // According to Wikipedia page, modern systems use 16 levels

	// "I" Registers
	this.i = 0;

	// Delay Timer
	this.delayTimer = 0;

	//Sound Timer
	this.soundTimer = 0;
};

// Resets parameters of the emulator, saved into a reset() function
chip8.prototype = {

	reset: function() {
		var i;

		for(i = 0; i < this.memory.length; i++){
			this.memory[i] = 0;
		};

		for(i = 0; i < this.v.length; i++){
			this.v[i] = 0;
		};

		// reset stack pointers
		this.sp = 0;
		this.i = 0;

		// reset the PC to 0x200
		this.pc = 0x200;

		// Reset timers
		this.delayTimer = 0;
		this.soundTimer = 0;
	};

};
