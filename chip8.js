

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
	keyBuffer: new Array(16),

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

	// Track if game is loaded
	gameLoaded: false,

	// The HTML canvas the emulator runs games to
	canvas: null,

	// Generates random numbers for memory, stack and V registers to 
	// display on the HTML page
	generateTestDisplay: function() {

		// Generate random numbers for memory display
		for(let i = 80; i < chip8.memory.length; i++) {
			chip8.memory[i] = Math.random() * (255 - 1) + 1;
		}

		// Generate random numbers for testing
		for(let i = 0; i < chip8.v.length; i++) {
			chip8.v[i] = Math.random() * (16 - 1) + 1;
		}

		// Generate random numbers for testing
		for(let i = 0; i < chip8.stack.length; i++) {
			chip8.stack[i] = Math.random() * (255 - 1) + 1;
		}
	},


	reset: function() {
		// Used to initialize chip8 emulator

		//clear memory
		chip8.memory = chip8.memory.map(() => 0);

		// // load fontset into memory
		for (var i = 0; i < CHIP8_FONTSET.length; i++) {
			chip8.memory[i] = CHIP8_FONTSET[i];
		}

		// Clear display
		chip8.vram = chip8.vram.fill(0);

		// Clear V registers
		chip8.v = chip8.v.map(() => 0);

		// Clear stack
		chip8.stack = chip8.stack.fill(0);

		// Clear keyboard buffer
		chip8.keyBuffer = chip8.keyBuffer.fill(0);

		// reset stack pointers
		chip8.sp = 0;

		// set I address to 0
		chip8.i = 0;

		// reset the PC to 0x200
		chip8.pc = 0x200;

		// Reset timers
		chip8.delayTimer = 0;
		chip8.soundTimer = 0;

		// Grab the canvas element to draw on
		chip8.canvas = document.getElementById('romDisplay').getContext('2d');

		//reset flags
		drawFlag = false;
		loadFlag = false;
		keyPress = false;
		keyWait = false;


	},

	

	loadGame: function(file) {
		let reader = new FileReader();
		console.log("HELLO FROM LAODGAME");

		reader.addEventListener('loadend', function() {
			let buffer = new Uint8Array(reader.result);
			buffer.map((val, index)=> (chip8.memory[index] = buffer[index]) );
			chip8.pc = 0x200;
			chip8.gameLoaded = true;
			console.log("Game is now loaded");
		});

		reader.readAsArrayBuffer(file);
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
					case 0x0000: 
						chip8.vram = chip8.vram.map(() => 0); // clear content of the vram array
						break;
					//Case 0x000 is ignored on modern interpreters according to Cowgod's Chip 8 Technical Manual
					
					//Clear Display
					case 0x000e:
						chip8.pc = chip8.stack[chip8.sp--]; // push PC to top of stack
						break;
				}
				break;

			//Jump to Address, location
			case 0x1000: 
				chip8.pc = opcode & 0x0fff;
				break;

			//Call Function
			case 0x2000: 
				chip8.stack[chip8.sp] = chip8.pc;
				chip8.sp++;
				chip8.pc = opcode & 0x0fff;
				break;

			//Skip to Next Instruction, vX Equal kk
			case 0x3000: 
				if (chip8.v[x] == (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			//Skip to Next Instruction, if vX Not Equal kk
			case 0x4000: 
				if (chip8.v[x] != (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			//Skip to Next Instruction, if vX Equals vY
			case 0x5000: 
				if (chip8.v[x] === chip8.v[y]) {
					chip8.pc += 2;
				}
				break;

			//Set vX to kk
			case 0x6000: 
				chip8.v[x] = opcode & 0x00ff;
				chip8.pc += 2;
				break;

			//set vX equal to vX + kk
			case 0x7000: 
				chip8.v[x] += opcode & 0x00ff;
				chip8.pc += 2;
				break;

			case 0x8000:
				switch (opcode & 0x000f) {

					//Store vY in vX
					case 0x0000: 
						chip8.v[x] = chip8.v[y];
						chip8.pc += 2;
						break;

					//Set vX equal to vX or vY
					case 0x0001: 
						chip8.v[x] = (chip8.v[x] | chip8.v[y]);
						chip8.pc += 2;
						break;

					//Set vX equal to vX and vY
					case 0x0002: 
						chip8.v[x] = (chip8.v[x] & chip8.v[y]);
						chip8.pc += 2;
						break;

					//Set vX equal to vX XOR vY
					case 0x0003:
						chip8.v[x] = chip8.v[x] ^ chip8.v[y];
						chip8.pc += 2;
						break;

					//Set vX equal to vX + vY, set vF equal to carry
					case 0x0004:
						if (chip8.v[y] > 0xff - chip8.v[x])
							chip8.v[0xf] = 1; //carry
						else chip8.v[0xf] = 0;

						chip8.v[x] += chip8.v[y];
						chip8.pc += 2;
						break;

					//set vX equal to vX - vY, set vF equal to NOT borrow
					//if vX > vY then vF is 1, otherwise 0. Then vX - vY and result stored in vX
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

					//Set vX = vX SHR 1
					//if least significant bit of vX is 1, then vF is 1, otherwise 0. Then result divided by 2
					case 0x0006:
						if (chip8.v[x] == 1) {
							chip8.v[0xf] = 1;
						} else {
							chip8.v[0xf] = 0;
						}

						chip8.v[x] = chip8.v[x] >> 1;
						chip8.pc += 2;
						break;

					//Set vX equal to vY - vX, set vF equal to NOT borrow
					//if vY > vX then vF is set to 1, otherwise 0. Then vX - vY and result stored in vX
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

					//Set vX equal to vX SHL 1
					//if most significant bit of vX is 1, then vF is set to 1, otherwise 0. Then vX is multiplied by 2.
					case 0x000e:
						chip8.v[0xf] = chip8.v[x] >> 7;
						chip8.v[x] *= 2;
						chip8.pc += 2;
						break;
				}
			break;

			//Skip next instruction if vX is not equal to vY
			case 0x9000:
				if (chip8.v[x] != chip8.v[y]) {
					// Vx != Vy ?
					chip8.pc += 2;
				}
				break;

			//Set i equal to nnn
			case 0xa000: // ANNN : Sets I to address NNN
				chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
				chip8.pc += 2;
				break;

			//Jump to location v0 + nnn
			case 0xb000:
				chip8.pc = (opcode & 0x0fff) + chip8.v[0];
				break;

			//Set vX equal to random byte AND kk
			case 0xc000:
				chip8.v[x] = (Math.random() * 256) & (opcode & 0x00ff);
				chip8.pc += 2;
				break;

	// Still requires testing
	// ---------------------------------------------------------------------------------------------
			

			//Display n-byte sprite starting at memory location i at (vX, vY), set vF equal to collision
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

	// ---------------------------------------------------------------------------------------------

			case 0xe000:
				switch(opcode & 0x00ff) {
					//Skip next instruction if the key with the value vX is pressed
					case 0x009e:
						let index1 = chip8.v[x];
						if(chip8.keyBuffer[index1] != 0) {
							chip8.pc += 2;
						}
						break;
					//Skip next instruction if the key with the value vX is not pressed
					case 0x00a1:
						let index2 = chip8.v[x];
						if(chip8.keyBuffer[index2] == 0) {
							chip8.pc += 2;
						}
						break;
				}
				break;

			case 0xf000:
				switch (opcode & 0x00ff) {

					//Place value of DelayTimer in vX
					case 0x0007:
						chip8.v[x] = chip8.delayTimer;
						chip8.pc += 2;
						break;

					//Wait for keypress, then store it in vX
					case 0x000a:
						let keyPress = false;
						for(let i = 0; i < 16; i++) {
							if(chip8.keyBuffer[i] != 0) { // if key is pressed
								chip8.v[x] = i; // store the value of the key into V[x]
								keyPress = true;
							}

							if(!keyPress) // if no key is pressed, stop execution until input is given
								return;
							chip8.pc += 2;
						}
						break;

					//DelayTimer is set to vX
					case 0x0015:
						chip8.delayTimer = chip8.v[x];
						chip8.pc += 2;
						break;

					//Set Sound Timer to vX
					case 0x0018:
						chip8.soundTimer = chip8.v[x];
						chip8.pc += 2;
						break;

					//Set i equal to i + vX
					case 0x001e:
						chip8.i += chip8.v[x];
						chip8.pc += 2;
						break;

					//Set i equal to location of sprite for digit vX
					case 0x0029:
						chip8.i = chip8.v[x] * 5;
						chip8.pc += 2;
						break;

					//Store BCD representation of vX in memory location starting at i
					case 0x0033:
						//Store binary decimal representation of I
						chip8.memory[chip8.i] = chip8.v[x] / 100; //Store hundreth's position at location i in memory
						chip8.memory[chip8.i + 1] = (chip8.v[x] / 10) % 10; // Store tens digit into location i + 1 in memory
						chip8.memory[chip8.i + 2] = (chip8.v[x] % 100) % 10; // Store ones digit into location i + 2 in memory
						chip8.pc += 2;
						break;

					//Store registers v0 through vX in memory at i
					case 0x0055:
						for(let i = 0; i <= x; i++) {
							chip8.v[i] = chip8.memory[chip8.i + i];
						}
						break;

					//Read registers from v0 through vX at i
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
	},

/******************************************
Keyboard Handling


******************************************/
	keyPress: function(index)
	{
		 translateKeys = {
	                    '1': 0x1,  // 1
	                    '2': 0x2,  // 2
	                   	'3': 0x3,  // 3
	                    '4': 0x4,  // 4
	                    'Q': 0x5,  // Q
	                    'W': 0x6,  // W
	                    'E': 0x7,  // E
	                    'R': 0x8,  // R
	                    'A': 0x9,  // A
	                    'S': 0xA,  // S
	                    'D': 0xB,  // D
	                    'F': 0xC,  // F
	                    'Z': 0xD,  // Z
	                    'X': 0xE,  // X
	                    'C': 0xF,  // C
	                    'V': 0x10  // V
	    }
	    if(index == '2')
	    {
	    	alert(translateKeys[index]);
	    }
	    chip8.setKey(translateKeys[index]);
	},

	setKey: function(keyCode)
	{
		chip8.keyBuffer[keyCode] = true;
		chip8.keyLog[keyCode] = keyCode;
	}, //


/******************************************
Remder/Draw


******************************************/
	render: function() {
		// If there's nothing to draw, return
		if(chip8.drawFlag === false) {
			return;
		}

		chip8.canvas.fillStyle = "#aaa";
		chip8.canvas.fillRect(0, 0, 640, 320);
		chip8.canvas.fillStyle = "#FF9100";

		for(let i = 0; i < chip8.vram.length; i++) {
			if(chip8.vram[i] == 1) {
				let y = i / 64 | 0;
				let x = i - 64*y;
				chip8.canvas.fillRect(x*15,y*15,15,15);
			}
		}

		chip8.drawFlag = false;
	} //
};
	

module.exports = chip8; // exporting the chip8 object to run tests with JEST.js