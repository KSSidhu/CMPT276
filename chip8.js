// Referenced http://blog.alexanderdickson.com/javascript-chip-8-emulator for chip 8 processor construction
// Reference http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/ for reset function construction

// Chip 8 processor
var chip8 = function(){
	this.initialize();

	wihle(true){
		this.runCycle();
	}
};



chip8.prototype = {

	var hexFontset =[
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


	initialize: function() {

		//Program Counter
		this.pc = 0

		//Memory
		this.memory = new Array(0x1000); // Standard Chip8 memory size, 4096 bytes

		//Stack
		this.stack = new Array(16); // According to Wikipedia page, modern systems use 16 levels

		//Stack Pointer
		this.sp = 0;

		//"V" Registers
		this.v = new Array(16); // V[0] -> V[F]

		// Video Memory
		this.vram = new Array(64 * 32);

		//Keyboard Buffer
		this.buffer = new Array(16);

		// Draw Operation Flag
		this.drawFlag = false;

		//Key Press
		this.keyPress = false;

		// "I" Index Registers
		this.i = 0;

		// Delay Timer
		this.delayTimer = 0;

		//Sound Timer
		this.soundTimer = 0;
	};

	// Resets parameters of the emulator, saved into a reset() function

	reset: function() { // Used to initialize chip8 emulator

		var k;

		for(k = 0; k < this.memory.length; k++){ // Load fontset
			this.memory[k] = hexFontset[k]
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
		var opcode = memory[pc] << 8 | memory[pc + 1]; // obtain 16-bit opcode command
													//Grab top 8 bits of opcode, shift left by 8 to make space to add remaining 8 bits of opcode

		//Decode Opcode

		switch(opcode & 0xF000) { // Check 4 most significant bits

			case 0x0000:
				switch(opcode & 0x000F) { // Check least 4 significant bits

					case 0x0000: //0x000E Clears display

					break;

					case 0x000E:
						sp --;
						pc = stack[sp]; // push PC to top of stack
						pc += 2;
					break;
				}
			break;

			var x = (opcode & 0x0F00) >> 8; 
			var y = (opcode & 0x00F0) >> 4; 

			case 0x1000:
				pc = opcode & 0x0FFF;
			break;


			case 0x2000:
				stack[sp] = pc;
				sp++;
				pc = opcode & 0x0FFF;
			break;


			case 0x3000:
				if(v[x] == (opcode & 0x00FF)) { //compare V[x] to last 8 bits
					pc += 4;
				} else {
					pc += 2;
				}
			break;


			case 0x4000:
				if(v[x] != (opcode & 0x00FF)) { //compare V[x] to last 8 bits
					pc += 4;
				} else {
					pc += 2;
				}
			break;


			case 0x5000:
				if(v[x] == v[y]) {
					pc += 4;
				} else {
					pc += 2;
				}
			break;


			case 0x6000:
				v[x] = (opcode & 0x00FF);
				pc += 2;
			break;


			case 0x7000:
				v[x] += (opcode & 0x00FF);
				pc += 2;
			break;


			case 0x8000:
				switch(opcode & 0x000F) {
					case 0x0000:
						v[x] = v[y];
						pc += 2;
					break;


					case 0x0001:
						x = opcode & 0x0F00;
						v[x] = (v[x] | v[y]);
						pc += 2;
					break;


					case 0x0002:
						v[x] = (v[x] & v[y]);
						pc += 2;
					break;


					case 0x0003:
						v[x] = (v[x] ^ v[y]);
						pc += 2;
					break;


					case 0x0004;
						if(v[y] > (0xFF - v[x]))
						    v[0xF] = 1; //carry
						 else
						    v[0xF] = 0;
						 v[x] += v[y];
  						pc += 2; 
					break;


					case 0x0005:
						if(v[x] > v[y]) { // Vx > Vy
							v[0xF] = 1; //carry
						} else {
							v[0xF] = 0
						}

						v[x] -= v[y]; //Vx = Vx - Vy
						pc += 2;
					break;


					case 0x0006:
						if(v[(opcode & 0x0100) >> 8] == 1) {
							v[0xF] = 1;
						} else {
							v[0xF] = 0;
						}

						v[x] = v[x] >> 1;
						pc += 2;
					break;


					case 0x0007:
						if(v[y] > v[x]) { // Vy > Vx
							v[0xF] = 1;
						} else {
							v[0xF] = 0;
						}

						v[x] = v[y] - v[x]; // Vx = Vy - Vx
						pc += 2;
					break;


					case 0x000E:
						if(v[(opcode & 0x0900) >> 11]) {
							v[0xF] = 1;
						} else {
							v[0xF] = 0;
						}

						v[x] << 1;
						pc += 2;
					break;
				}


			case 0x9000;
				if(v[x] != v[y]) { // Vx != Vy ?
					pc += 4;
				} else {
					pc += 2;
				}
			break;


			case 0xA000: // ANNN : Sets I to address NNN
				i = opcode & 0x0FFF; // This case grabs the last 12 bits to analyze
				pc += 2;
			break;


			case 0xB000:
				pc = (opcode & 0x0FFF) + v[0];
			break;


			case 0xC000:
				v[x] = (Math.random() * 256) & (opcode & 0x00FF);
				pc += 2;
			break;


			case 0xD000:
				var height = opcode & 0x000F // save nibble
				var sprite;

				v[0xF] = 0;

				for(int ylim = 0; ylim < height; y++){
					sprite = v[i + ylim];

					for(var xlim = 0; xlim < 8; xlim++){
						if((sprite & (0x80 >> xlim)) != 0){
							if(vram[(v[x] + xlim + ((v[y] + ylim) * 64))] == 1) {
								v[0xF] = 1;
							}
							vram[(v[x] + xlim + ((v[y] + ylim) * 64))] ^= 1
						}
					}
				}

			break;


			case 0xE000:
			break;


			case 0xF000:
				switch(opcode & 0x00FF) {
					case 0x0007
					v[x] = delayTimer;
					pc += 2;
					break;


					case 0x000A

					break;


					case 0x0015:
						delayTimer = v[x]
						pc += 2;
					break;


					case 0x0018:
						soundTimer = v[x]
						pc += 2;
					break;


					case 0x001E:
						i += v[x]
						pc += 2;
					break;


					case 0x0029:
					break;


					case 0x0033:
					break;


					case 0x0055:
					break;


					case 0x0065:
					break;
				}
			

			default:
				console.log("Unknown Opcode [0x0000]: opcode");

		}
	};

};
