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
	keyBuffer: new Uint8Array(16),

	//Tracks previous keys pressed
	keyLog: new Uint8Array(16),

	// Draw Operation Flag
	drawFlag: false,

	//Key Press
	keyPressed: false,

	// "I" Index Register
	i: 0,

	// Delay Timer
	delayTimer: 0,

	//Sound Timer
	soundTimer: 0,

	// Track if game is loaded
	gameLoaded: false,

	// The HTML canvas the emulator runs games to
	canvas: null,

	paused: false,
	cycles: 0,

	// Generates random numbers for memory, stack and V registers to 
	// display on the HTML page
	generateTestDisplay: function() {
		// Generate random numbers for memory display
		for (let i = 80; i < chip8.memory.length; i++) {
			chip8.memory[i] = Math.random() * (255 - 1) + 1;
		}

		// Generate random numbers for testing
		for (let i = 0; i < chip8.v.length; i++) {
			chip8.v[i] = Math.random() * (16 - 1) + 1;
		}

		// Generate random numbers for testing
		for (let i = 0; i < chip8.stack.length; i++) {
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
		chip8.vram = chip8.vram.map(() => 0);

		// Clear V registers
		chip8.v = chip8.v.map(() => 0);

		// Clear stack
		chip8.stack = chip8.stack.map(() => 0);

		// Clear keyboard buffer
		chip8.keyBuffer = chip8.keyBuffer.map(() => 0);

		chip8.keyLog = chip8.keyLog.map(() => 0);

		// reset stack pointers
		chip8.sp = 0;

		// set I address to 0
		chip8.i = 0;

		// reset the PC to 0x200
		chip8.pc = 0x200;

		// Reset timers
		chip8.delayTimer = 0;
		chip8.soundTimer = 0;

		chip8.canvas = document.querySelector('canvas');

		//reset flags
		chip8.drawFlag = false;
		chip8.keyPressed = false;
		chip8.keyWait = false;

		document.onkeyup = document.onkeydown = chip8.onKey;

		//
		chip8.cycles = 0;

		// chip8.gameLoaded = false;

		console.log('ALL RESET');
	},

	// hexConverter: function(opcode) {
	// 	let temp = (opcode).toString(16).toUpperCase();
	// 	let pad = "";

	// 	for(let i = 0; i < 4-temp.length; i++) {
	// 		pad = pad + "0";
	// 	}

	// 	return ("0x" + pad + temp);
	// },

	onKey: function(evt) {
		let charStr = String.fromCharCode(evt.which);
		let val = (evt.type == 'keydown') ? true : false;

		idx =
		  {
		    '1': 0x1,'2': 0x2,'3': 0x3,'4': 0x4,
		    'Q': 0x4,'W':0x5,'E': 0x6,'R': 0xD,
		    'A': 0x7,'S':0x8,'D': 0x9,'F': 0xE,
		    'Z': 0xA,'X':0x0,'C': 0xB, 'V':0xF,
		  }[charStr];

		  if(idx !== undefined)
		  {
		    chip8.keyBuffer[idx] = val;
		  }

  			chip8.keyPressed = chip8.keyBuffer.reduce( ((prevValue,currentValue) => (prevValue | currentValue)) )

	},

	stop: function() {
		chip8.gameLoaded = true;
	},

	begin: function() {
		chip8.gameLoaded = false;
	},

	emulate: function() {
		// chip8.gameLoaded = true
		if(chip8.gameLoaded == true) {
			let opcode = chip8.memory[chip8.pc] << 8 | chip8.memory[chip8.pc + 1];
			chip8.runCycle(opcode);
		}
	},

	loadGame: function(file) {
		let reader = new FileReader();
		console.log('HELLO FROM LOADGAME');

		reader.addEventListener('loadend', function() {
			let buffer = new Uint8Array(reader.result);
			buffer.map((val, index) => (chip8.memory[index + 512] = buffer[index]));
			chip8.pc = 0x200;
			chip8.gameLoaded = true;
			console.log('Game is now loaded');
		});

		reader.readAsArrayBuffer(file);
	},

	//Emulation Cycle
	runCycle: function(opcode) {
		//Calculate x and y indicies
		// console.log("OPCODE RUNNING");
		var x = (opcode & 0x0f00) >> 8;
		var y = (opcode & 0x00f0) >> 4;

		chip8.pc += 2;

		//Decode Opcode
		switch (opcode & 0xf000) { // Check 4 most significant bits
			case 0x0000:
				switch (opcode & 0x00ff) { // Check least 4 significant bits
					case 0x00e0:
						console.log('HELLO FROM 0x00e0');
						chip8.vram = chip8.vram.map(() => 0); // clear content of the vram array
						break;
					//Case 0x000 is ignored on modern interpreters according to Cowgod's Chip 8 Technical Manual

					//Clear Display
					case 0x00ee:
						console.log('HELLO FROM 0x00ee');
						chip8.pc = chip8.stack[--chip8.sp]; // push PC to top of stack
						break;
				}
				break;

			//Jump to Address, location
			case 0x1000:
				console.log('HELLO FROM 0x1000');
				chip8.pc = opcode & 0x0fff;
				break;

			//Call Function
			case 0x2000:
				console.log('HELLO FROM 0x2000');
				chip8.stack[chip8.sp] = chip8.pc;
				chip8.sp++;
				chip8.pc = opcode & 0x0fff;
				break;

			//Skip to Next Instruction, vX Equal kk
			case 0x3000:
				console.log('HELLO FROM 0x3000');
				if (chip8.v[x] === (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			//Skip to Next Instruction, if vX Not Equal kk
			case 0x4000:
				console.log('HELLO FROM 0x4000');
				if (chip8.v[x] != (opcode & 0x00ff)) {
					//compare V[x] to last 8 bits
					chip8.pc += 2;
				}
				break;

			//Skip to Next Instruction, if vX Equals vY
			case 0x5000:
				console.log('HELLO FROM 0x5000');
				if (chip8.v[x] === chip8.v[y]) {
					chip8.pc += 2;
				}
				break;

			//Set vX to kk
			case 0x6000:
				console.log('HELLO FROM 0x6000');
				chip8.v[x] = opcode & 0x00ff;
				break;

			//set vX equal to vX + kk
			case 0x7000:
				console.log('HELLO FROM 0x7000');
				// chip8.v[x] += opcode & 0x00ff;
				let val = (opcode & 0x00ff) + chip8.v[x];
				if (val > 255) {
					val -= 256;
				}

				chip8.v[x] = val;
				break;

			case 0x8000:
				switch (opcode & 0x000f) {
					//Store vY in vX
					case 0x0000:
						console.log('HELLO FROM 0x8000');
						chip8.v[x] = chip8.v[y];
						break;

					//Set vX equal to vX or vY
					case 0x0001:
						console.log('HELLO FROM 0x8001');
						chip8.v[x] = chip8.v[x] | chip8.v[y];
						break;

					//Set vX equal to vX and vY
					case 0x0002:
						console.log('HELLO FROM 0x8002');
						chip8.v[x] = chip8.v[x] & chip8.v[y];
						break;

					//Set vX equal to vX XOR vY
					case 0x0003:
						console.log('HELLO FROM 0x8003');
						chip8.v[x] = chip8.v[x] ^ chip8.v[y];
						break;

					//Set vX equal to vX + vY, set vF equal to carry
					case 0x0004:
						console.log('HELLO FROM 0x8004');
						chip8.v[x] += chip8.v[y];
						chip8.v[0xf] = +(chip8.v[x] > 255);
						if (chip8.v[x] > 255) {
							chip8.v[x] -= 256;
						}
						break;

					//set vX equal to vX - vY, set vF equal to NOT borrow
					//if vX > vY then vF is 1, otherwise 0. Then vX - vY and result stored in vX
					case 0x0005:
						console.log('HELLO FROM 0x8005');
						chip8.v[0xf] = +(chip8.v[x] > chip8.v[y]);
						chip8.v[x] -= chip8.v[y]; //Vx = Vx - Vy
						if (chip8.v[x] > 255) {
							chip8.v[x] -= 256;
						}
						break;

					//Set vX = vX SHR 1
					//if least significant bit of vX is 1, then vF is 1, otherwise 0. Then result divided by 2
					case 0x0006:
						console.log('HELLO FROM 0x8006');
						chip8.v[0xf] = chip8.v[x] & 0x1;
						chip8.v[x] = chip8.v[x] >> 1;
						break;

					//Set vX equal to vY - vX, set vF equal to NOT borrow
					//if vY > vX then vF is set to 1, otherwise 0. Then vX - vY and result stored in vX
					case 0x0007:
						console.log('HELLO FROM 0xf00x8007');
						if (chip8.v[y] > chip8.v[x]) {
							// Vy > Vx
							chip8.v[0xf] = 1;
						} else {
							chip8.v[0xf] = 0;
						}

						chip8.v[x] = chip8.v[y] - chip8.v[x]; // Vx = Vy - Vx
						if (chip8.v[x] > 255) {
							chip8.v[x] -= 256;
						}
						break;

					//Set vX equal to vX SHL 1
					//if most significant bit of vX is 1, then vF is set to 1, otherwise 0. Then vX is multiplied by 2.
					case 0x000e:
						console.log('HELLO FROM 0x800e');
						chip8.v[0xf] = chip8.v[x] >> 7;
						chip8.v[x] *= 2;
						break;
				}
				break;

			//Skip next instruction if vX is not equal to vY
			case 0x9000:
				console.log('HELLO FROM 0x9000');
				if (chip8.v[x] != chip8.v[y]) {
					chip8.pc += 2;
				}
				break;

			//Set i equal to nnn
			case 0xa000: // ANNN : Sets I to address NNN
				console.log('HELLO FROM 0xa000');
				chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
				break;

			//Jump to location v0 + nnn
			case 0xb000:
				console.log('HELLO FROM 0xb000');
				chip8.pc = (opcode & 0x0fff) + chip8.v[0];
				break;

			//Set vX equal to random byte AND kk
			case 0xc000:
				console.log('HELLO FROM 0xc000');
				chip8.v[x] = Math.floor(Math.random() * 0x00ff) & (opcode & 0x00ff);
				break;

			// Still requires testing
			// ---------------------------------------------------------------------------------------------

			case 0xd000:
				console.log('HELLO FROM 0xd000');
				//Display n-byte sprite starting at memory location i at (vX, vY), set vF equal to collis
				let height = opcode & 0x000f; // save nibble
				let sprite;

				let v_X = chip8.v[x];
				let v_Y = chip8.v[y];

				chip8.v[0xf] = 0;

				for (var ylim = 0; ylim < height; ylim++) {
					sprite = chip8.memory[chip8.i + ylim];

					for (var xlim = 0; xlim < 8; xlim++) {
						if ((sprite & (0x80 >> xlim)) != 0) {
							if (chip8.vram[v_X + xlim + ((v_Y + ylim) * 64)] == 1) {
								// checks if any sprites currently exist at position
								chip8.v[0xf] = 1;
							}

							chip8.vram[v_X + xlim + (v_Y + ylim) * 64] ^= 1; // draw sprite to screen
						}
					}
				}

				chip8.drawFlag == true;

				break;

			// ---------------------------------------------------------------------------------------------

			case 0xe000:
				switch (opcode & 0x00ff) {
					//Skip next instruction if the key with the value vX is pressed
					case 0x009e:
						console.log('HELLO FROM 0xe09e');
						if (chip8.keyBuffer[chip8.v[x]]) {
							chip8.pc += 2;
						}
						break;
					//Skip next instruction if the key with the value vX is not pressed
					case 0x00a1:
						console.log('HELLO FROM 0xf0a1');
						if (!chip8.keyBuffer[chip8.v[x]]) {
							chip8.pc += 2;
						}
						break;
				}
				break;

			case 0xf000:
				switch (opcode & 0x00ff) {
					//Place value of DelayTimer in vX
					case 0x0007:
						console.log('HELLO FROM 0xf007');
						chip8.v[x] = chip8.delayTimer;
						break;

					//Wait for keypress, then store it in vX
					case 0x000a:
						console.log('HELLO FROM 0xf00a');
						let oldKey = false;

						for(let i = 0; i < 16; i++) {
							if(chip8.keyBuffer[i] != 0) {
								// alert(i);
								chip8.v[x] = chip8.keyBuffer[i];
								oldKey = true;
								chip8.drawFlag = true;
							}
						}

						if(!oldKey) {
							chip8.pc -= 2;
						}
						break;

					//DelayTimer is set to vX
					case 0x0015:
						console.log('HELLO FROM 0xf015');
						chip8.delayTimer = chip8.v[x];
						break;

					//Set Sound Timer to vX
					case 0x0018:
						console.log('HELLO FROM 0xf018');
						chip8.soundTimer = chip8.v[x];
						break;

					//Set i equal to i + vX
					case 0x001e:
						console.log('HELLO FROM 0xf01e');
						chip8.i += chip8.v[x];
						break;

					//Set i equal to location of sprite for digit vX
					case 0x0029:
						console.log('HELLO FROM 0xf029 ');
						chip8.i = chip8.v[x] * 5;
						break;

					//Store BCD representation of vX in memory location starting at i
					case 0x0033:
						console.log('HELLO FROM 0xf033');
						// Store binary decimal representation of I
						chip8.memory[chip8.i] = chip8.v[x] / 100; //Store hundreth's position at location i in memory
						chip8.memory[chip8.i + 1] = (chip8.v[x] / 10) % 10; // Store tens digit into location i + 1 in memory
						chip8.memory[chip8.i + 2] = (chip8.v[x] % 100) % 10; // Store ones digit into location i + 2 in memory
						break;

					//Store registers v0 through vX in memory at i
					case 0x0055:
						console.log('HELLO FROM 0xf055');
						for (let i = 0; i <= x; i++) {
							chip8.memory[chip8.i + i] = chip8.v[i];
						}
						break;

					//Read registers from v0 through vX at i
					case 0x0065:
						console.log('HELLO FROM 0xf065');
						for (let i = 0; i <= x; i++) {
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
	// keyPress: function(index, keyToggle)
	// {
	// 	 translateKeys = {
	//                     '1': 0x1,  // 1
	//                     '2': 0x2,  // 2
	//                    	'3': 0x3,  // 3
	//                     '4': 0x4,  // 4
	//                     'q': 0x5,  // Q
	//                     'w': 0x6,  // W
	//                     'e': 0x7,  // E
	//                     'r': 0x8,  // R
	//                     'a': 0x9,  // A
	//                     's': 0xA,  // S
	//                     'd': 0xB,  // D
	//                     'f': 0xC,  // F
	//                     'z': 0xD,  // Z
	//                     'x': 0xE,  // X
	//                     'c': 0xF,  // C
	//                     'v': 0x10  // V
	//     }

	//     chip8.keyPressed = false;
	//     //If keyToggle is null, it means the user clicked on a key, if true then the user is using keyboard
	//     if(keyToggle == null || keyToggle == true)
	//     {
	//     	chip8.keyPressed = true;
	//     }

	//     if (chip8.keyPressed == true)
	//     {
	// 	    let keyIndex = translateKeys[index];
	// 	    //Restrict keyboard keys to onscreen key presses
	// 	    if(keyIndex != null)
	// 	    {	

	// 	    	//Test pressing keyboard keys + mouse with onscreen keys
			    // alert(index + " " + translateKeys[index]);
	// 		    chip8.setKey(translateKeys[index]);
	// 	    }
	// 	}
	// 	else
	// 	{
	// 		chip8.unsetKey(translateKeys[index]);
	// 	}
	// },

	// setKey: function(keyCode) {
	// 	chip8.keyBuffer[keyCode] = keyCode;
	// 	// chip8.keyLog[keyCode] = keyCode;
	// },

	// unsetKey : function(keyCode)
	// {

	// 	delete chip8.keyBuffer[keyCode];
	// 	// delete chip8.keyLog[keyCode];
	// },

/******************************************
Backwards, Pause, Forwards, Help


******************************************/
	//Step back in emulator one step
	backwards : function()
	{
		chip8.pause();
	},

	//Stop and pause all operations in emulator
	pause : function()
	{

	},

	//Step forward in emulator one step
	forwards : function()
	{
		chip8.pause();
	},

	help : function()
	{
		alert(
			" F1 | Pause \n F2 | Step Backwards \n F3 | Step Forwards"



		);
	},


/******************************************
Render/Draw


******************************************/
	render: function() {
		let SCALE = 10;
		let ctx = chip8.canvas.getContext('2d');
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, chip8.canvas.width, chip8.canvas.height);


		ctx.fillStyle = '#ffffff';

		for(let y = 0; y < 32; y++) {
			for(let x = 0; x < 64; x++) {
				if(chip8.vram[x + y * 64] != 0x0) {
					ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
				}
			}
		}
	}
};

module.exports = chip8; // exporting the chip8 object to run tests with JEST.js