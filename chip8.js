// Reference http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/ for chip8 object layout and functions to include
// Refernce https://github.com/reu/chip8.js for emulation render cycle
// Referenced http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#00E0 for opcode instructions

let chip8 = {

	debug: false,

	test: false,

	loop: null,

	previousCPU: [],

	// timer refresh rate
	timerRefreshRate: 16,

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

	//Key Press
	keyPressed: false,

	// "I" Index Register
	i: 0,

	// Delay Timer
	delayTimer: 0,

	//Sound Timer
	soundTimer: 0,

	// The HTML canvas the emulator runs games to
	canvas: null,

	//register display
	registerFlag: false,

	//instruction display
	instructionFlag: false,
	maxRows: 7,
	currInstr: 7,

	//memory display
	memFlag: false,
	currMem: 7,

	interval: null,

	paused: false,

	cycles: 0,

	step: null,

	loop: null,

	breakPoint: false,

	prevReg: 0,

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

	updateTimers: function() {
		if (chip8.delayTimer > 0) {
			chip8.delayTimer--;
		}

		if (chip8.soundTimer > 0) {
			chip8.soundTimer--;
		}
	},

	checkPixels: function(x, y) {
		let location;
		let width = 64;
		let height = 32;

		if (x > width) {
			while(x > width) x -= width;
		}else if (x < 0) {
			while(x < 0) x += width;
		}

		if (y > height) {
			while(y > height) y -= height;
		}else if (y < 0) {
			while(y < 0) y += height;
		}

		location = x + (y * width);
		chip8.vram[location] ^= 1;

		return !chip8.vram[location];
	},

	reset: function() {
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

		// reset stack pointers
		chip8.sp = 0;

		// set I address to 0
		chip8.i = 0;

		// reset the PC to 0x200
		chip8.pc = 0x200;

		// Reset timers
		chip8.delayTimer = 0;
		chip8.soundTimer = 0;

		// Grab canvas to draw on
		chip8.canvas = document.querySelector('canvas');

		//reset flags
		chip8.keyPressed = false;
		chip8.keyWait = false;
		chip8.paused = false;

		//Display memory
		if(!chip8.test) {
			chip8.initRegisters();
			chip8.initInstructions();
			chip8.initMem();
		}

		document.onkeyup = document.onkeydown = chip8.keyPress;

		//
		chip8.cycles = 0;
		if (chip8.debug) console.log('ALL RESET');
	},

	//Convert opcode to hex
	hexConverter: function(opcode) {
		let temp = (opcode).toString(16).toUpperCase();
		let pad = "";

		for(let i = 0; i < 4-temp.length; i++) {
			pad = pad + "0";
		}

		return ("0x" + pad + temp);
	},

	//Handle key presses
	onKey: function(evt, name) {
		let val = false;
		let charStr = String.fromCharCode(evt.which);
		if (evt.type == 'keydown') {
			val = true;
		} else if (evt.type == 'click') {
			val = true;
			charStr = name;
		}

		translateKeys = {
			'1': 0x1,
			'2': 0x2,
			'3': 0x3,
			'4': 0xc,
			'Q': 0x4,
			'W': 0x5,
			'E': 0x6,
			'R': 0xd,
			'A': 0x7,
			'S': 0x8,
			'D': 0x9,
			'F': 0xe,
			'Z': 0xa,
			'X': 0x0,
			'C': 0xb,
			'V': 0xf
		}[charStr];

		if (translateKeys !== undefined) {
			chip8.keyBuffer[translateKeys] = val;
		}

		chip8.keyPressed = chip8.keyBuffer.reduce((prevValue, currentValue) => prevValue | currentValue);
	},
/******************************************
Display Registers, Memory, Instructions 


******************************************/

	//Init Register Display
	initRegisters: function() {
		if(!chip8.test){
			var table = document.getElementById('regTable');
		if(!chip8.registerFlag)
		{
			//Create table 
			var tbody = document.createElement('tbody');
			var tr = document.createElement('tr');
			if(!chip8.test) {
				table.appendChild(tbody);
				tbody.appendChild(tr);
			}
			// table.appendChild(tbody);
			// tbody.appendChild(tr);

			//Header values
			var heading = ["Register", "Value", "Register", "Value"];

			//Used for splitting the table into 4 columns, where registers V 0-7 are in first column and V 8-15 are in third column
			var tableBuffer = 8;

			//Header
			for(var col = 0; col < heading.length; col++)
			{
				var th = document.createElement('TH');
				th.width = '75';
				th.appendChild(document.createTextNode(heading[col]));
				tr.appendChild(th);
			}

			//Create and populate tables
			for (var f = 0; f < tableBuffer; f++)
			{
				//Row
			  	var tr = document.createElement('TR'); 

			  	//Columns and Values
			    var regCol1 = document.createElement('TD');
			    var regVal1 = document.createElement('TD');
			    var regCol2 = document.createElement('TD');
			    var regVal2 = document.createElement('TD');

			    //Set ID to columns for updating
			    var regID1 = document.createAttribute("id");
			    regID1.value = "reg-V" + f;
			    regVal1.setAttributeNode(regID1);

			    var regID2 = document.createAttribute("id");
			    var regBG = document.createAttribute("backgroundColor");
			   	regID2.value = "reg-V" + (f + tableBuffer);
			    regVal2.setAttributeNode(regID2);
			    regVal2.setAttributeNode(regBG);

			    //Add the cells to each row
			    regCol1.appendChild(document.createTextNode("V" + f));
			    regVal1.appendChild(document.createTextNode(chip8.v[f]));

		        regCol2.appendChild(document.createTextNode("V" + (f + tableBuffer)));
	            regVal2.appendChild(document.createTextNode(chip8.v[f + tableBuffer]));

	            //Add to rows
		        tr.appendChild(regCol1);
		        tr.appendChild(regVal1);

			    tr.appendChild(regCol2);
			    tr.appendChild(regVal2);

			    //Add to table
			    tbody.appendChild(tr);

			    //Add the i register and program counter to the table
	            if(f == tableBuffer - 1)
	            {  
	            	tr = document.createElement('TR');

	            	//"I" Register 
	            	var iReg = document.createElement('TD');
			   		var iRegVal = document.createElement('TD');
			   		//PC Register
					var pcReg = document.createElement('TD');
			   		var pcRegVal = document.createElement('TD');

			   		//"I" id for updating value
				    var iID = document.createAttribute("id");
				    iID.value = "reg-I";
				    iRegVal.setAttributeNode(iID);
				    //PC id for updating value
				    var pcID = document.createAttribute("id");
				    pcID.value = "reg-PC";
				    pcRegVal.setAttributeNode(pcID);

				    //Append the "I" register
					iReg.appendChild(document.createTextNode("I"));
					iRegVal.appendChild(document.createTextNode(chip8.i));

					//Append the program counter
					pcReg.appendChild(document.createTextNode("PC"));
					pcRegVal.appendChild(document.createTextNode(chip8.pc));

					tr.appendChild(iReg);
					tr.appendChild(iRegVal);
					tr.appendChild(pcReg);
					tr.appendChild(pcRegVal);
	            }
	            //Add to table
			    tbody.appendChild(tr);
			}
			//Register table is created, prevent program from creating multiple tables
			chip8.registerFlag = true;
		}
		}
	},


	//Init Instructions Display
	initInstructions: function()
	{
		if(!chip8.test){
			var table = document.getElementById('instrTable');
			if(!chip8.instructionFlag)
			{
				var tbody = document.createElement('tbody');
				var tr = document.createElement('tr');
				table.appendChild(tbody);

				tbody.appendChild(tr);

				var heading = ["Opcode", "Instruction"];
				var tableBuffer = 8;

				for(var col = 0; col < heading.length; col++)
				{
					var th = document.createElement('TH');
					th.width = '75';
					th.appendChild(document.createTextNode(heading[col]));
					tr.appendChild(th);



				}		 
				for (var f = 0; f < tableBuffer; f++)
				{
				  	var tr = document.createElement('TR'); 
				  	var op = document.createElement('TD');
				    var instr = document.createElement('TD');

				    var opID = document.createAttribute("id");
				    opID.value = "op" + f;
				    op.setAttributeNode(opID);

				    var instrID = document.createAttribute("id");
				    instrID.value = "instr" + f;
				    instr.setAttributeNode(instrID);

				    op.appendChild(document.createTextNode("test" + f));
				    instr.appendChild(document.createTextNode("test" + f));

			        tr.appendChild(op);
			        tr.appendChild(instr);

				    tbody.appendChild(tr);
				}
				chip8.instructionFlag = true;
			}
		}
	},

	//Init Memory Display
	initMem: function()
	{
		if(!chip8.test){
			var table = document.getElementById('memTable');
			if(!chip8.memFlag)
			{
				var tbody = document.createElement('tbody');
				var tr = document.createElement('tr');
				table.appendChild(tbody);

				tbody.appendChild(tr);

				var heading = ["Memory", "Value"];
				var tableBuffer = 8;

				for(var col = 0; col < heading.length; col++)
				{
					var th = document.createElement('TH');
					th.width = '75';
					th.appendChild(document.createTextNode(heading[col]));
					tr.appendChild(th);

				}		 
				for (var f = 0; f < tableBuffer; f++)
				{
				  	var tr = document.createElement('TR'); 
				  	var mem = document.createElement('TD');
				    var val = document.createElement('TD');

				    var memID = document.createAttribute("id");
				    memID.value = "mem" + f;
				    mem.setAttributeNode(memID);

				    var valID = document.createAttribute("id");
				    valID.value = "val" + f;
				    val.setAttributeNode(valID);

				    mem.appendChild(document.createTextNode("test" + f));
				    val.appendChild(document.createTextNode("test" + f));

			        tr.appendChild(mem);
			        tr.appendChild(val);

				    tbody.appendChild(tr);
				}
				chip8.memFlag = true;
			}
		}
	},


	// //Update register values after opcode is retrieved
	// updateRegisters: function()
	// {
	// 	if(!chip8.test) {
	// 		if(chip8.paused)
	// 		{
	// 			return;
	// 		}

	// 			for(var i = 0; i < 16; i++)
	// 			{
	// 				$("#reg-V" + i).text(chip8.hexConverter(chip8.v[i]));

					
	// 			}

	// 			$("#reg-I").text(chip8.hexConverter(chip8.i));
	// 			$("#reg-PC").text(chip8.hexConverter(chip8.pc));
	// 	}
		
	// },

	//Update Register Display
	updateRegister: function(index)
	{
		if(!chip8.test) {

			chip8.highlight("reg-V", index, "white");

			if(chip8.paused)
			{
				return;
			}

				if(chip8.v[index] != chip8.prevReg)
				{

					chip8.highlight("reg-V", index, "#ddd");
					$("#reg-V" + index).text(chip8.hexConverter(chip8.v[index]));
				}
				else if(chip8.v[index] == chip8.prevReg)
				{

					chip8.highlight("reg-V", index, "white");
				}

			$("#reg-I").text(chip8.hexConverter(chip8.i));
			$("#reg-PC").text(chip8.pc);

			}


	},

	updateInstruction: function(opcode, instruction)
	{
		if(!chip8.test) {
			if(chip8.paused)
			{
				return;
			}

			chip8.highlight("op", chip8.currInstr - 1, "white");
			chip8.highlight("instr", chip8.currInstr - 1, "white");

			if(chip8.currInstr < 0)
			{
				chip8.currInstr = chip8.maxRows;
			}
			$("#op" + chip8.currInstr).text(opcode);
			$("#instr" + chip8.currInstr).text(instruction);
			chip8.highlight("op", chip8.currInstr, "#ddd");
			chip8.highlight("instr", chip8.currInstr, "#eee");

			chip8.currInstr--;

		}

	},

	updateMem: function(index, value)
	{
		if(!chip8.test) {
			if(chip8.paused)
			{
				return;
			}

			chip8.highlight("mem", chip8.currMem - 1, "white");
			chip8.highlight("val", chip8.currMem - 1, "white");

			if(chip8.currMem < 0)
			{
				chip8.currMem = chip8.maxRows;
			}
			$("#mem" + chip8.currMem).text("memory" + index);
			$("#val" + chip8.currMem).text(chip8.hexConverter(value));
			chip8.highlight("mem", chip8.currMem, "#ddd");
			chip8.highlight("val", chip8.currMem, "#eee");

			chip8.currMem--;

		}
	},

	highlight: function(id, index, colour)
	{
		$("#" + id + index).css("backgroundColor", colour);
	},

/******************************************
Stop/Start Emulator


******************************************/
	stop: function() {
		cancelAnimationFrame(loop);
	},

	start: function() {
		loop = requestAnimationFrame(function step() {
			step = chip8.emulate();
			loop = requestAnimationFrame(step);
		});
	},

	emulate: function() {
		// Save copy of current chip 8 object to access later
		chip8.previousCPU.push({video: chip8.vram.slice(), counter: chip8.pc, iRegister: chip8.i, vRegisters: chip8.v.slice(), 
									mem: chip8.memory.slice(), stack: chip8.stack.slice(), stackPointer: chip8.sp, keys: chip8.keyBuffer.slice(), 
									delay: chip8.delayTimer, sound: chip8.sountTimer, waitKey: chip8.keyWait});
		if (!chip8.paused) {
			for (let i = 0; i < 10; i++) {
				let opcode = (chip8.memory[chip8.pc] << 8) | chip8.memory[chip8.pc + 1];
				chip8.runCycle(opcode);
			}
		}

		if (!chip8.paused) {
			chip8.updateTimers();
		}

		chip8.render();
	},

	loadGame: function(file) {
		let reader = new FileReader();
		console.log('HELLO FROM LOADGAME');

		reader.addEventListener('loadend', function() {
			let buffer = new Uint8Array(reader.result);
			buffer.map((val, index) => (chip8.memory[index + 512] = buffer[index]));
			chip8.pc = 512;
			console.log('Game is now loaded');
		});

		reader.readAsArrayBuffer(file);
	},

	//Emulation Cycle
	runCycle: function(opcode) {

		//Calculate x and y indicies
		let x = (opcode & 0x0f00) >> 8;
		let y = (opcode & 0x00f0) >> 4;

		// Increment Program Counter
		chip8.pc += 2;

		//Decode Opcode
		switch (opcode & 0xf000) { // Check 4 most significant bits
			case 0x0000:
			//Case 0x000 is ignored on modern interpreters according to Cowgod's Chip 8 Technical Manual
				switch (opcode & 0x00ff) { // Check least 4 significant bits
					case 0x00e0:
						if(chip8.debug) console.log('HELLO FROM 0x00e0');
						clearScreen();
						break;

					//Clear Display
					case 0x00ee:
						if (chip8.debug) console.log('HELLO FROM 0x00ee');
						returnFromSubroutine();
						break;
				}
				break;

			//Jump to Address, location
			case 0x1000:
				if (chip8.debug) console.log('HELLO FROM 0x1000');
				jmpToLocation(opcode);
				break;

			//Call Function
			case 0x2000:
				if (chip8.debug) console.log('HELLO FROM 0x2000');
				callAddress(opcode);
				break;

			//Skip to Next Instruction, vX Equal kk
			case 0x3000:
				if (chip8.debug) console.log('HELLO FROM 0x3000');
				skipInstruction_VxEqKk(opcode, x);
				break;

			//Skip to Next Instruction, if vX Not Equal kk
			case 0x4000:
				if (chip8.debug) console.log('HELLO FROM 0x4000');
				skipInstruction_VxNeqKk(opcode, x);
				break;

			//Skip to Next Instruction, if vX Equals vY
			case 0x5000:
				if (chip8.debug) console.log('HELLO FROM 0x5000');
				skipInstruction_VxEqVy(x, y);
				break;

			//Set vX to kk
			case 0x6000:
				if (chip8.debug) console.log('HELLO FROM 0x6000');
				setVxTonn(opcode, x);
				break;

			//set vX equal to vX + kk
			case 0x7000:
				if (chip8.debug) console.log('HELLO FROM 0x7000');
				addnnToVx(opcode, x);
				break;

			case 0x8000:
				switch (opcode & 0x000f) {
					//Store vY in vX
					case 0x0000:
						if (chip8.debug) console.log('HELLO FROM 0x8000');
						setVxToVy(x, y);
						break;

					//Set vX equal to vX or vY
					case 0x0001:
						if (chip8.debug) console.log('HELLO FROM 0x8001');
						setVxToVxOrVy(x, y);
						break;

					//Set vX equal to vX and vY
					case 0x0002:
						if (chip8.debug) console.log('HELLO FROM 0x8002');
						setVxToVxAndVy(x, y);
						break;

					//Set vX equal to vX XOR vY
					case 0x0003:
						if (chip8.debug) console.log('HELLO FROM 0x8003');
						setVxToVxXorVy(x, y);
						break;

					//Set vX equal to vX + vY, set vF equal to carry
					case 0x0004:
						if (chip8.debug) console.log('HELLO FROM 0x8004');
						addVyToVx(x, y);
						break;

					//set vX equal to vX - vY, set vF equal to NOT borrow
					//if vX > vY then vF is 1, otherwise 0. Then vX - vY and result stored in vX
					case 0x0005:
						if (chip8.debug) console.log('HELLO FROM 0x8005');
						subVyFromVx(x, y);
						break;

					//Set vX = vX SHR 1
					//if least significant bit of vX is 1, then vF is 1, otherwise 0. Then result divided by 2
					case 0x0006:
						if (chip8.debug) console.log('HELLO FROM 0x8006');
						shiftVxRight(x, y);
						break;

					//Set vX equal to vY - vX, set vF equal to NOT borrow
					//if vY > vX then vF is set to 1, otherwise 0. Then vX - vY and result stored in vX
					case 0x0007:
						if (chip8.debug) console.log('HELLO FROM 0x8007');
						setVxToVyMinVx(x, y);
						break;

					//Set vX equal to vX SHL 1
					//if most significant bit of vX is 1, then vF is set to 1, otherwise 0. Then vX is multiplied by 2.
					case 0x000e:
						if (chip8.debug) console.log('HELLO FROM 0x800e');
						shiftVxLeft(x)
						break;
				}
				break;

			//Skip next instruction if vX is not equal to vY
			case 0x9000:
				if (chip8.debug) console.log('HELLO FROM 0x9000');
				skipInstructionIfVxNeqVy(x, y);
				break;

			//Set i equal to nnn
			case 0xa000: // ANNN : Sets I to address NNN
				if (chip8.debug) console.log('HELLO FROM 0xa000');
				setITonnn(opcode);
				break;

			//Jump to location v0 + nnn
			case 0xb000:
				if (chip8.debug) console.log('HELLO FROM 0xb000');
				jmpToV0Plusnnn(opcode);
				break;

			//Set vX equal to random byte AND kk
			case 0xc000:
				if (chip8.debug) console.log('HELLO FROM 0xc000');
				setVxRandomByte(opcode, x);
				break;

			case 0xd000:
				if (chip8.debug) console.log('HELLO FROM 0xd000');
				drawSprite(opcode, x, y);
				break;

			case 0xe000:
				switch (opcode & 0x00ff) {
					//Skip next instruction if the key with the value vX is pressed
					case 0x009e:
						if (chip8.debug) console.log('HELLO FROM 0xe09e');
						skipInstructionIfVxKeyPressed(x);
						break;
					//Skip next instruction if the key with the value vX is not pressed
					case 0x00a1:
						if (chip8.debug) console.log('HELLO FROM 0xf0a1');
						skipInstructionIfVxKeyNotPressed(x);
						break;
				}
				break;

			case 0xf000:
				switch (opcode & 0x00ff) {
					//Place value of DelayTimer in vX
					case 0x0007:
						if (chip8.debug) console.log('HELLO FROM 0xf007');
						setVxToDelayTimer(x);
						break;

					//Wait for keypress, then store it in vX
					case 0x000a:
						if (chip8.debug) console.log('HELLO FROM 0xf00a');
						waitAndStoreKeyPressInVx(x);
						

					//DelayTimer is set to vX
					case 0x0015:
						if (chip8.debug) console.log('HELLO FROM 0xf015');
						setDelayTimerToVx(x);
						break;

					//Set Sound Timer to vX
					case 0x0018:
						if (chip8.debug) console.log('HELLO FROM 0xf018');
						setSoundTimerToVx(x);
						break;

					//Set i equal to i + vX
					case 0x001e:
						if (chip8.debug) console.log('HELLO FROM 0xf01e');
						setIToIPlusVx(x);
						break;

					//Set i equal to location of sprite for digit vX
					case 0x0029:
						if (chip8.debug) console.log('HELLO FROM 0xf029 ');
						setIToLocationOfSpriteFromVx(x);
						break;

					//Store BCD representation of vX in memory location starting at i
					case 0x0033:
						if (chip8.debug) console.log('HELLO FROM 0xf033');
						// Store binary decimal representation of I
						storeBCDOfVxInI(x);
						break;

					//Store registers v0 through vX in memory at i
					case 0x0055:
						if (chip8.debug) console.log('HELLO FROM 0xf055');
						storeV0ToVxInMemory(x);
						break;

					//Read registers from v0 through vX at i
					case 0x0065:
						if (chip8.debug) console.log('HELLO FROM 0xf065');
						storeMemoryInVRegisters(x);
						break;
				}
				break;

			default:
				console.log('Unknown Opcode: 0x' + opcode.toString(16));
		}
		// chip8.updateRegisters();\
	},

	/******************************************
Backwards, Pause, Forwards, Help


******************************************/
	//Step back in emulator one step
	backwards: function() {
		chip8.paused = false;
		// chip8.render();
		chip8.stop();
		// chip8.emulate();
		
		// Reset chip8 properties to previously saved chip8 object
		chip8.vram = chip8.previousCPU[chip8.previousCPU.length - 1].video.slice();
		chip8.pc = chip8.previousCPU[chip8.previousCPU.length - 1].counter;
		chip8.i = chip8.previousCPU[chip8.previousCPU.length - 1].iRegister;
		chip8.stack = chip8.previousCPU[chip8.previousCPU.length - 1].stack.slice();
		chip8.sp = chip8.previousCPU[chip8.previousCPU.length - 1].stackPointer;
		chip8.memory = chip8.previousCPU[chip8.previousCPU.length - 1].mem.slice();
		console.log(chip8.v);
		chip8.v = chip8.previousCPU[chip8.previousCPU.length - 1].vRegisters.slice();
		console.log(chip8.v);
		chip8.keyBuffer = chip8.previousCPU[chip8.previousCPU.length - 1].keys.slice();
		chip8.soundTimer = chip8.previousCPU[chip8.previousCPU.length - 1].sound;
		chip8.delayTimer = chip8.previousCPU[chip8.previousCPU.length - 1].delay;
		chip8.keyWait = chip8.previousCPU[chip8.previousCPU.length - 1].waitKey;

		chip8.previousCPU.pop();

		// chip8.emulate();
		chip8.render();
		chip8.start();
		chip8.pause();

	},

	//Stop and pause all operations in emulator
	pause: function() {
		if (!chip8.paused) {
			chip8.stop();
			chip8.paused = true;
			if(!chip8.test)
				document.getElementById("pause").innerText = "Play";
		} else {
			chip8.paused = false;
			chip8.start();

			if(!chip8.test)
				document.getElementById("pause").innerText = "Pause";
		}
	},

	//Step forward in emulator one step
	forwards: function() {
		chip8.paused = false;
		chip8.stop();
		chip8.emulate();
		chip8.start();
		chip8.pause();
	},

	help : function()
	{
		var urlk = 'https://github.com/KSSidhu';
		var urlj = 'https://github.com/leafittome';
		var urla = 'https://github.com/adamx37';
		var urlc = 'https://github.com/chamodib';
		confirm(
			"Chip 8 Emulator \n\n Created by: \n Kirat Sidhu " + urlk + " \n James Young " + urlj + " \n Adam Tran " + urla + " \n Chamodi Basnayake " + urlc
			);
	},

/******************************************
Render/Draw


******************************************/
	render: function() {
		let SCALE = 10;
		let ctx = chip8.canvas.getContext('2d');
		ctx.clearRect(0, 0, 64 * SCALE, 32 * SCALE);
		ctx.fillStyle = '#EEEEEE';
		ctx.fillRect(0, 0, 64 * SCALE, 32 * SCALE);

		ctx.fillStyle = '#FFA500';

		for (let i = 0; i < chip8.vram.length; i++) {
			let x = (i % 64) * SCALE;
			let y = Math.floor(i / 64) * SCALE;
			if (chip8.vram[i]) ctx.fillRect(x, y, SCALE, SCALE);
		}
	}
};

module.exports = chip8; // exporting the chip8 object to run tests with JEST.js
