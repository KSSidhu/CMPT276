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

	// "I" Index Registers
	this.i = 0;

	// Delay Timer
	this.delayTimer = 0;

	//Sound Timer
	this.soundTimer = 0;
};

chip8.prototype = {

	var CHIP8_FONTSET =[
	  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
	  0x20, 0x60, 0x20, 0x20, 0x70, // 1
	  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
	  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
	  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
	  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
	  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
	  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
	  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
	  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
	  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
	  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
	  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
	  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
	  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
	  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
	];

<<<<<<< HEAD
	// Resets parameters of the emulator, saved into a reset() function
=======

>>>>>>> 8fc36d34333bca9a828a333b2e2fcf442b84a3a3
	reset: function() { // Used to initialize chip8 emulator

		var k;

		for(k = 0; k < this.memory.length; k++){ // Load fontset
			this.memory[k] = CHIP8_FONTSET[k]
		};

		for(k = 0; k < this.v.length; k++){
			this.v[k] = 0;
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

	//Emulation Cycle
	runCycle: function(){
		//Fetch Opcode
		opcode = memory[pc] << 8 | memory[pc + 1]; // obtain 16-bit opcode command
													//Grab top 8 bits of opcode, shift left by 8 to make space to add remaining 8 bits of opcode

		//Decode Opcode

		switch(opcode & 0xF000){

			//opcode cases here ....

			case 0xA000: // ANNN : Sets I to address NNN
				i = opcode & 0x0FFF; // This case grabs the last 12 bits to analyze
				pc += 2;
			break;

			// Execute Opcode

			default:
				//print out Error statement

		}
	}

};
