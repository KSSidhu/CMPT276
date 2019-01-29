// Referenced http://blog.alexanderdickson.com/javascript-chip-8-emulator for chip 8 processor construction
// Reference http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/ for reset function construction


chip8 = {
	// Program Counter
	pc: 0,

	//Memory
	memory: new Uint8Array(4096), // Standard Chip8 memory size, 4096 bytes

	//Stack
	stack: new Array(16), // According to Wikipedia page, modern systems use 16 levels

	//Stack Pointer
	sp: 0,

	//"V" Registers
	v: new Array(16), // V[0] -> V[F]

	// Video Memory
	vram: new Array(64 * 32),

	//Keyboard Buffer
	buffer: new Array(16),

	//Tracks previous keys pressed
	keyLog: new Array(16),

	// Draw Operation Flag
	drawFlag: false,

	//Key Press
	keyPress: false,

	// "I" Index Registers
	i: 0,

	// Delay Timer
	delayTimer: 0,

	//Sound Timer
	soundTimer: 0,

	//Flag for program loaded
	loadFlag : false,

	//Track if a key is pressed or waiting for key to be pressed
	keyWait : false,




	// Resets parameters of the emulator, saved into a reset() function

	reset: function() {
		// Used to initialize chip8 emulator

		chip8.memory = chip8.memory.map( ()=> 0);
		chip8.v = chip8.v.map( ()=> 0);

		// reset stack pointers
		chip8.sp = 0;
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
	runCycle: function() {
		//Fetch Opcode
		var opcode = (chip8.memory[chip8.pc] << 8) | chip8.memory[chip8.pc + 1]; // obtain 16-bit opcode command
		//Grab top 8 bits of opcode, shift left by 8 to make space to add remaining 8 bits of opcode

		
		

		//Decode Opcode

		switch (opcode & 0xf000) { // Check 4 most significant bits
			case 0x0000:
				switch (opcode & 0x000f) { // Check least 4 significant bits
					case 0x0000: //0x000E Clears display
						break;

					case 0x000e:
						sp--;
						pc = stack[sp]; // push PC to top of stack
						pc += 2;
						break;
				}
				break;

				var x = (opcode & 0x0f00) >> 8;
				var y = (opcode & 0x00f0) >> 4;

			case 0x1000:
				pc = opcode & 0x0fff;
				break;

			case 0x2000:
				stack[sp] = pc;
				sp++;
				pc = opcode & 0x0fff;
				break;

			case 0x3000:
				if (v[x] == (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					pc += 4;
				} else {
					pc += 2;
				}
				break;

			case 0x4000:
				if (v[x] != (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					pc += 4;
				} else {
					pc += 2;
				}
				break;

			case 0x5000:
				if (v[x] == v[y]) {
					pc += 4;
				} else {
					pc += 2;
				}
				break;

			case 0x6000:
				v[x] = opcode & 0x00ff;
				pc += 2;
				break;

			case 0x7000:
				v[x] += opcode & 0x00ff;
				pc += 2;
				break;

			case 0x8000:
				switch (opcode & 0x000f) {
					case 0x0000:
						v[x] = v[y];
						pc += 2;
						break;

					case 0x0001:
						x = opcode & 0x0f00;
						v[x] = v[x] | v[y];
						pc += 2;
						break;

					case 0x0002:
						v[x] = v[x] & v[y];
						pc += 2;
						break;

					case 0x0003:
						v[x] = v[x] ^ v[y];
						pc += 2;
						break;

					case 0x0004:
						if (v[y] > 0xff - v[x])
							v[0xf] = 1; //carry
						else v[0xf] = 0;
						v[x] += v[y];
						pc += 2;
						break;

					case 0x0005:
						if (v[x] > v[y]) {
							// Vx > Vy
							v[0xf] = 1; //carry
						} else {
							v[0xf] = 0;
						}

						v[x] -= v[y]; //Vx = Vx - Vy
						pc += 2;
						break;

					case 0x0006:
						if (v[(opcode & 0x0100) >> 8] == 1) {
							v[0xf] = 1;
						} else {
							v[0xf] = 0;
						}

						v[x] = v[x] >> 1;
						pc += 2;
						break;

					case 0x0007:
						if (v[y] > v[x]) {
							// Vy > Vx
							v[0xf] = 1;
						} else {
							v[0xf] = 0;
						}

						v[x] = v[y] - v[x]; // Vx = Vy - Vx
						pc += 2;
						break;

					case 0x000e:
						if (v[(opcode & 0x0900) >> 11]) {
							v[0xf] = 1;
						} else {
							v[0xf] = 0;
						}

						v[x] << 1;
						pc += 2;
						break;
				}

			case 0x9000:
				if (v[x] != v[y]) {
					// Vx != Vy ?
					pc += 4;
				} else {
					pc += 2;
				}
				break;

			case 0xa000: // ANNN : Sets I to address NNN
				i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
				pc += 2;
				break;

			case 0xb000:
				pc = (opcode & 0x0fff) + v[0];
				break;

			case 0xc000:
				v[x] = (Math.random() * 256) & (opcode & 0x00ff);
				pc += 2;
				break;

			case 0xd000:
				var height = opcode & 0x000f; // save nibble
				var sprite;

				v[0xf] = 0;

				for (var ylim = 0; ylim < height; y++) {
					sprite = v[i + ylim];

					for (var xlim = 0; xlim < 8; xlim++) {
						if ((sprite & (0x80 >> xlim)) != 0) {
							if (vram[v[x] + xlim + (v[y] + ylim) * 64] == 1) {
								v[0xf] = 1;
							}
							vram[v[x] + xlim + (v[y] + ylim) * 64] ^= 1;
						}
					}
				}

				break;

			case 0xe000:
				break;

			case 0xf000:
				switch (opcode & 0x00ff) {
					case 0x0007:
						v[x] = delayTimer;
						pc += 2;
						break;

					case 0x000a:
						break;

					case 0x0015:
						delayTimer = v[x];
						pc += 2;
						break;

					case 0x0018:
						soundTimer = v[x];
						pc += 2;
						break;

					case 0x001e:
						i += v[x];
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
				console.log('Unknown Opcode [0x0000]: opcode');
		}
	}

	//Detects the key pressed
	keyPress: function(key)
	{
		if (key < 16)
		{
			keyLog[key] = true;
			if (keyWait != nil)
			{
				keyWait = key;
				waitFlag = true;
			}
		}

	},

	keyRelease: function(key)
	{
		if (key < 16)
		{
			keyLog[key] = false;
		}
	},

};
