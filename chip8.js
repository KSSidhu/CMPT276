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

	// Resets parameters of the emulator, saved into a reset() function

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

		switch(opcode & 0xF000) {

			case 0x0000:
				switch(opcode & 0x000F) {
					case 0x0000: //0x000E Clears display

					break;

					case 0x000E:
						pc = stack[sp]; // push PC to top of stack
						sp -= 1;
					break;
				}
			break;


			case 0x1000:
				pc = opcode & 0x0FFF;
			break;


			case 0x2000:
				sp++;
				stack[sp] = pc;
				pc = opcode & 0x0FFF;
			break;


			case 0x3000:
				if(v[opcode & 0x0F000] == (opcode & 0x00FF)) { //compare V[x] to last 8 bits
					pc += 2;
				}
			break;


			case 0x4000:
				if(v[opcode & 0x0F000] != (opcode & 0x00FF)) { //compare V[x] to last 8 bits
					pc += 2;
				}
			break;


			case 0x5000:
				if(v[opcode & 0x0F00] == v[opcode & 0x00F0]) {
					pc += 2;
				}
			break;


			case 0x6000:
				v[opcode & 0x0F00] = (opcode & 0x00FF);
			break;


			case 0x7000:
				v[opcode & 0x0F00] += (opcode & 0x00FF);
			break;


			case 0x8000:
				switch(opcode & 0x000F) {
					case 0x0000:
						v[opcode & 0x0F00] = v[opcode & 0x00F0];
					break;


					case 0x0001:
						x = opcode & 0x0F00;
						v[x] = (v[x] | v[opcode & 0x00F0]);
					break;


					case 0x0002:
						x = opcode & 0x0F00;
						v[x] = (v[x] & v[opcode & 0x00F0]);
					break;


					case 0x0003:
						x = opcode & 0x0F00;
						v[x] = (v[x] ^ v[opcode & 0x00F0]);
					break;


					case 0x0004;

					break;


					case 0x0005:

					break;


					case 0x0006:

					break;


					case 0x0007:

					break;


					case 0x000E:

					break;
				}

			case 0xA000: // ANNN : Sets I to address NNN
				i = opcode & 0x0FFF; // This case grabs the last 12 bits to analyze
				pc += 2;
			break;

			case 0xB000:
				pc = (opcode & 0x0FFF) + v[0];
			break;
			

			default:
				console.log("Unknown Opcode [0x0000]: opcode");

		}
	}

};
