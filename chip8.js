// Reference http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/ for chip8 object layout and functions to include
// Referenced http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#00E0 for opcode instructions

let CHIP8_FONTSET =[
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
//comment for test

chip8 = {
	// Program Counter
	pc: 0,

	//Memory
	memory: new Uint8Array(4096), // Standard Chip8 memory size, 4096 bytes

	//Stack
	stack: new Uint16Array(16), // According to Wikipedia page, modern systems use 16 levels

	//Stack Pointer
	sp: 0,

	//"V" Registers
	v: new Uint16Array(16), // V[0] -> V[F]

	// Video Memory holding size of display
	vram: new Uint8Array(64 * 32),

	//Keyboard Buffer
	buffer: new Array(16),

	//Tracks previous keys pressed
	keyLog: new Array(16),

	// Draw Operation Flag
	drawFlag: false,

	//Key Press
	keyPress: false,

	// "I" Index Register
	i: 0,

	// Delay Timer
	delayTimer: 0,

	//Sound Timer
	soundTimer: 0,

	//Flag for program loaded
	loadFlag: false,

	//Track if a key is pressed or waiting for key to be pressed
	keyWait: false,


	reset: function() {
		// Used to initialize chip8 emulator

		//clear memory
		chip8.memory = chip8.memory.map(() => 0);

		// load fontset into memory
		for (var i = 0; i < CHIP8_FONTSET.length; i++) {
			chip8.memory[i] = CHIP8_FONTSET[i];
		}

		// Clear display
		chip8.vram = chip8.vram.fill(0);

		// Clear V registers
		chip8.v = chip8.v.fill(0);

		// Clear stack
		chip8.stack = chip8.stack.fill(0);

		// Clear keyboard buffer
		chip8.buffer = chip8.buffer.fill(0);

		// reset stack pointers
		chip8.sp = 0;

		// set I address to 0
		chip8.i = 0;

		// reset the PC to 0x200
		chip8.pc = 0x200;

		// Reset timers
		chip8.delayTimer = 0;
		chip8.soundTimer = 0;

		//reset flags
		drawFlag = false;
		loadFlag = false;
		keyPress = false;
		keyWait = false;
	},

	//Emulation Cycle
	runCycle: function(opcode) {
		//Fetch Opcode
		// var opcode = (chip8.memory[chip8.pc] << 8) | chip8.memory[chip8.pc + 1]; // obtain 16-bit opcode command
		//Grab top 8 bits of opcode, shift left by 8 to make space to add remaining 8 bits of opcode

		//Calculate x and y indicies
		var x = (opcode & 0x0f00) >> 8;
		var y = (opcode & 0x00f0) >> 4;


		//Decode Opcode
		switch (opcode & 0xf000) { // Check 4 most significant bits
			case 0x0000:
				switch (opcode & 0x000f) { // Check least 4 significant bits
					case 0x0000: //0x000E Clears display
						chip8.vram = chip8.vram.map(() => 0); // clear content of the vram array
						break;
					//Case 0x000 is ignored on modern interpreters according to Cowgod's Chip 8 Technical Manual

					case 0x000e:
						chip8.pc = chip8.stack[chip8.sp--]; // push PC to top of stack
						break;
				}
				break;

			case 0x1000:
				chip8.pc = opcode & 0x0fff;
				break;

			case 0x2000:
				chip8.stack[chip8.sp] = chip8.pc;
				chip8.sp++;
				chip8.pc = opcode & 0x0fff;
				break;

			case 0x3000:
				if (chip8.v[x] == (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			case 0x4000:
				if (chip8.v[x] != (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			case 0x5000:
				if (chip8.v[x] === chip8.v[y]) {
					chip8.pc += 2;
				}
				break;

			case 0x6000:
				chip8.v[x] = opcode & 0x00ff;
				chip8.pc += 2;
				break;

			case 0x7000:
				chip8.v[x] += opcode & 0x00ff;
				chip8.pc += 2;
				break;

			case 0x8000:
				switch (opcode & 0x000f) {
					case 0x0000:
						chip8.v[x] = chip8.v[y];
						chip8.pc += 2;
						break;

					case 0x0001:
						chip8.v[x] = (chip8.v[x] | chip8.v[y]);
						chip8.pc += 2;
						break;

					case 0x0002:
						chip8.v[x] = (chip8.v[x] & chip8.v[y]);
						chip8.pc += 2;
						break;

					case 0x0003:
						chip8.v[x] = chip8.v[x] ^ chip8.v[y];
						chip8.pc += 2;
						break;

					case 0x0004:
						if (chip8.v[y] > 0xff - chip8.v[x])
							chip8.v[0xf] = 1; //carry
						else chip8.v[0xf] = 0;

						chip8.v[x] += chip8.v[y];
						chip8.pc += 2;
						break;

					case 0x0005:
						if (chip8.v[x] > chip8.v[y]) {
							// Vx > Vy
							chip8.v[0xf] = 1; //carry
						} else {
							chip8.v[0xf] = 0;
						}

						chip8.v[x] -= chip8.v[y]; //Vx = Vx - Vy
						chip8.pc += 2;
						break;

					case 0x0006:
						if (chip8.v[x] == 1) {
							chip8.v[0xf] = 1;
						} else {
							chip8.v[0xf] = 0;
						}

						chip8.v[x] = chip8.v[x] >> 1;
						chip8.pc += 2;
						break;

					case 0x0007:
						if (chip8.v[y] > chip8.v[x]) {
							// Vy > Vx
							chip8.v[0xf] = 1;
						} else {
							chip8.v[0xf] = 0;
						}

						chip8.v[x] = chip8.v[y] - chip8.v[x]; // Vx = Vy - Vx
						chip8.pc += 2;
						break;

					case 0x000e:
						chip8.v[0xf] = chip8.v[x] >> 7;
						chip8.v[x] *= 2;
						chip8.pc += 2;
						break;
				}
			break;

			case 0x9000:
				if (chip8.v[x] != chip8.v[y]) {
					// Vx != Vy ?
					chip8.pc += 2;
				}
				break;

			case 0xa000: // ANNN : Sets I to address NNN
				chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
				chip8.pc += 2;
				break;

			case 0xb000:
				chip8.pc = (opcode & 0x0fff) + chip8.v[0];
				break;

			case 0xc000:
				chip8.v[x] = (Math.random() * 256) & (opcode & 0x00ff);
				chip8.pc += 2;
				break;

			case 0xd000:
				var height = opcode & 0x000f; // save nibble
				var sprite;

				chip8.v[0xf] = 0;

				for (var ylim = 0; ylim < height; y++) {
					sprite = chip8.v[i + ylim];

					for (var xlim = 0; xlim < 8; xlim++) {
						if ((sprite & (0x80 >> xlim)) != 0) {
							if (chip8.vram[v[x] + xlim + (chip8.v[y] + ylim) * 64] == 1) { // checks if any sprites currently exist at position
								chip8.v[0xf] = 1;
							}
							chip8.vram[v[x] + xlim + (chip8.v[y] + ylim) * 64] ^= 1; // draw sprite to screen
						}
					}
				}

				break;

			case 0xe000:
				switch(opcode & 0x00ff) {
					case 0x009e:
						let index1 = chip8.v[x];
						if(chip8.buffer[index1] != 0) {
							chip8.pc += 2;
						}
						break;

					case 0x00a1:
						let index2 = chip8.v[x];
						if(chip8.buffer[index2] == 0) {
							chip8.pc += 2;
						}
						break;
				}
				break;

			case 0xf000:
				switch (opcode & 0x00ff) {
					case 0x0007:
						chip8.v[x] = chip8.delayTimer;
						chip8.pc += 2;
						break;

					case 0x000a:
						let keyPress = false;
						for(let i = 0; i < 16; i++) {
							if(chip8.buffer[i] != 0) { // if key is pressed
								chip8.v[x] = i; // store the value of the key into V[x]
								keyPress = true;
							}

							if(!keyPress) // if no key is pressed, stop execution until input is given
								return;
							chip8.pc += 2;
						}
						break;

					case 0x0015:
						chip8.delayTimer = chip8.v[x];
						chip8.pc += 2;
						break;

					case 0x0018:
						chip8.soundTimer = chip8.v[x];
						chip8.pc += 2;
						break;

					case 0x001e:
						chip8.i += chip8.v[x];
						chip8.pc += 2;
						break;

					case 0x0029:
						chip8.i = chip8.v[x] * 5;
						chip8.pc += 2;
						break;

					case 0x0033:
						//Store binary decimal representation of I
						chip8.memory[chip8.i] = chip8.v[x] / 100; //Store hundreth's position at location i in memory
						chip8.memory[chip8.i + 1] = (chip8.v[x] / 10) % 10; // Store tens digit into location i + 1 in memory
						chip8.memory[chip8.i + 2] = (chip8.v[x] % 100) % 10; // Store ones digit into location i + 2 in memory
						chip8.pc += 2;
						break;

					case 0x0055:
						for(let i = 0; i <= x; i++) {
							chip8.v[i] = chip8.memory[chip8.i + i];
						}
						break;

					case 0x0065:
						for(let i = 0; i <= x; i++) {
							chip8.v[i] = chip8.memory[chip8.i + i];
						}
						break;
				}
			break;

			default:
				console.log('Unknown Opcode: ' + opcode);
		}
	}

	// //Detects the key pressed
	// keyPress: function(key)
	// {
	// 	if (key < 16)
	// 	{
	// 		keyLog[key] = true;
	// 		if (keyWait != nil)
	// 		{
	// 			keyWait = key;
	// 			waitFlag = true;
	// 		}
	// 	}

	// },

	// keyRelease: function(key)
	// {
	// 	if (key < 16)
	// 	{
	// 		keyLog[key] = false;
	// 	}
	// },
};

module.exports = chip8; // exporting the chip8 object to run tests with JEST.js
