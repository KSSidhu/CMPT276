
// case 0x00e0
// 00E0
// CLS
function clearScreen() {
	var op = "0x00E0";
	var instr = "CLS";
	chip8.updateInstruction(op, instr);

	chip8.vram = chip8.vram.map(() => 0);
}

// case 0x00ee
// 00EE
// RET
function returnFromSubroutine() {
	var op = "0x00EE";
	var instr = "RET";
	chip8.updateInstruction(op, instr);

	chip8.sp--;
	chip8.pc = chip8.stack[chip8.sp]; // push PC to top of stack
}

// case 0x1000
// 1nnn
// JP addr
//Jump to Address, location
function jmpToLocation(opcode) {
	var op = "0x1000";
	var instr = "JP addr";
	chip8.updateInstruction(op, instr);

	chip8.pc = opcode & 0x0fff;
}

// case 0x2000
// 2nnn
// CALL addr
//Call Function
function callAddress(opcode) {
	var op = "0x2000";
	var instr = "CALL addr";
	chip8.updateInstruction(op, instr);

	chip8.stack[chip8.sp] = chip8.pc;
	chip8.sp++;
	chip8.pc = opcode & 0x0fff;
}

// case 0x3000
// 3xkk
// SE vX, byte
//Skip to Next Instruction, vX Equal nn
function skipInstruction_VxEqKk(opcode, x) {
	var op = "0x3000";
	var instr = "SE vX, byte";
	chip8.updateInstruction(op, instr);

	if (chip8.v[x] === (opcode & 0x00ff)) {	
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

// case 0x4000
// 4xkk
// SNE vX, byte
//Skip to Next Instruction, if vX Not Equal kk
function skipInstruction_VxNeqKk(opcode, x) {
	var op = "0x4000";
	var instr = "SNE vX, byte";
	chip8.updateInstruction(op, instr);
	if (chip8.v[x] != (opcode & 0x00ff)) {
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

// case 0x5000
// 5xy0
// SE vX, vY
//Skip to Next Instruction, if vX Equals vY
function skipInstruction_VxEqVy(x, y) {
	var op = "0x5000";
	var instr = "SE vX, vY";
	chip8.updateInstruction(op, instr);

	if (chip8.v[x] === chip8.v[y]) {
		chip8.pc += 2;
	}
}

// case 0x6000
// 6xkk
// LD vX, byte
//Set vX to kk
function setVxTonn(opcode, x) {
	var op = "0x6000";
	var instr = "LD vX, byte";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = opcode & 0x00ff;
	chip8.updateRegister(x);
}

// case 0x7000
// 7xkk
// ADD vX, byte
//set vX equal to vX + kk
function addnnToVx(opcode, x) {
	// chip8.v[x] += opcode & 0x00ff;
	var op = "0x7000";
	var instr = "ADD vX, byte";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	let val = (opcode & 0xff) + chip8.v[x];

	chip8.updateRegister(x);

	if(val > 255) {
		val -= 256;
	}

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = val;
	chip8.updateRegister(x);
}

// case 0x8000
// 8xy0
// LD vX, vY
//Store vY in vX
function setVxToVy(x, y) {
	var op = "0x8000";
	var instr = "LD vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8001
// 8xy1
// OR vX, vY
//Set vX equal to vX or vY
function setVxToVxOrVy(x, y) {
	var op = "0x8001";
	var instr = "OR vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] | chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8002
// 8xy2
// AND vX, vY
//Set vX equal to vX and vY
function setVxToVxAndVy(x, y) {
	var op = "0x8002";
	var instr = "AND vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] & chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8003
// 8xy3
// XOR vX, vY
//Set vX equal to vX XOR vY
function setVxToVxXorVy(x, y) {
	var op = "0x8003";
	var instr = "XOR vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] ^ chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8004
// 8xy4
// ADD vX, vY
//Set vX equal to vX + vY, set vF equal to carry
function addVyToVx(x, y) {
	var op = "0x8004";
	var instr = "ADD vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] + chip8.v[y];
	chip8.updateRegister(x);

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = +(chip8.v[x] > 255);
	chip8.updateRegister(0xf);
	
	if(chip8.v[x] > 255) {
		chip8.prevReg = chip8.v[x];
		chip8.v[x] -= 256;
		chip8.updateRegister(x);
	}
}

// case 0x8005
// 8xy5
// SUB vX, vY
//set vX equal to vX - vY, set vF equal to NOT borrow
//if vX > vY then vF is 1, otherwise 0. Then vX - vY and result stored in vX
function subVyFromVx(x, y) {
	var op = "0x8005";
	var instr = "SUB vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = +(chip8.v[x] > chip8.v[y]);
	chip8.updateRegister(0xf);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] -= chip8.v[y]; //Vx = Vx - Vy
	chip8.updateRegister(x);

	if(chip8.v[x] < 0) {
		chip8.prevReg = chip8.v[x];
		chip8.v[x] += 256;
		chip8.updateRegister(x);
	}
}

// case 0x8006
// 8xy6
// SHR vX, vY
//Set vX = vX SHR 1
//if least significant bit of vX is 1, then vF is 1, otherwise 0. Then result divided by 2
function shiftVxRight(x, y) {
	var op = "0x8006";
	var instr = "SHR vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = chip8.v[x] & 0x1;
	chip8.updateRegister(0xf);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] >> 1;
	chip8.updateRegister(x);
}

// case 0x8007
// 8xy7
// SUBN vX, vY
//Set vX equal to vY - vX, set vF equal to NOT borrow
//if vY > vX then vF is set to 1, otherwise 0. Then vX - vY and result stored in vX
function setVxToVyMinVx(x, y) {
	var op = "0x8007";
	var instr = "SUBN vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = +(chip8.v[y] > chip8.v[x]);
	chip8.updateRegister(0xf);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[y] - chip8.v[x]; // Vx = Vy - Vx
	chip8.updateRegister(x);
	if (chip8.v[x] < 0) {
		// Vy > Vx
		chip8.prevReg = chip8.v[x];
		chip8.v[x] += 256;
		chip8.updateRegister(x);
	}
}

// case 0x800e
// 8xyE
// SHL vX, vY
//Set vX equal to vX SHL 1
//if most significant bit of vX is 1, then vF is set to 1, otherwise 0. Then vX is multiplied by 2.
function shiftVxLeft(x) {
	var op = "0x800E";
	var instr = "SHL vX, vY";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = chip8.v[x] & 0x80;
	chip8.updateRegister(0xf);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] << 1;
	chip8.updateRegister(x);

	if(chip8.v[x] > 255) {
		chip8.prevReg = chip8.v[x];
		chip8.v[x] -= 256;
		chip8.updateRegister(x);
	}
}

// case 0x9000
// 9xy0
// SNE vX, vY
//Skip next instruction if vX is not equal to vY
function skipInstructionIfVxNeqVy(x, y) {
	var op = "0x9000";
	var instr = "SNE vX, vY";
	chip8.updateInstruction(op, instr);

	if (chip8.v[x] != chip8.v[y]) {
		chip8.pc += 2;
	}
}

// case 0xa000
// Annn
// LD I, addr
// Sets I to address NNN
function setITonnn(opcode) {
	var op = "0xa000";
	var instr = "LD I, addr";
	chip8.updateInstruction(op, instr);

	chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
}

// case 0xb000
// Bnnn
// JP v0, addr
//Jump to location v0 + nnn
function jmpToV0Plusnnn(opcode) {
	var op = "0xb000";
	var instr = "JP v0, addr";
	chip8.updateInstruction(op, instr);

	chip8.pc = (opcode & 0x0fff) + chip8.v[0];
}

// case 0xc000
// Cxkk
// RND vX, byte
//Set vX equal to random byte AND kk
function setVxRandomByte(opcode, x) {
	var op = "0xC000";
	var instr = "RND vX, byte";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = Math.floor(Math.random() * 256) & (opcode & 0x00ff);
	chip8.updateRegister(x);

}

// case 0xd000
// Dxyn
// DRW vX, vY, nibble
function drawSprite(opcode, x, y) {
	var op = "0xD000";
	var instr = "DRW vX, vY, n";
	chip8.updateInstruction(op, instr);

	//Display n-byte sprite starting at memory location i at (vX, vY), set vF equal to collis
	let height = opcode & 0x000f; // save nibble for height of pixel
	let sprite;

	let v_X = chip8.v[x];
	let v_Y = chip8.v[y];

	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = 0;
	chip8.updateRegister(0xf);

	for (let ylim = 0; ylim < height; ylim++) {
		sprite = chip8.memory[chip8.i + ylim];

		for (let xlim = 0; xlim < 8; xlim++) {
			if ((sprite & 0x80) > 0) {
				if (chip8.checkPixels(v_X + xlim, v_Y + ylim)) {
					// checks if any sprites currently exist at position
					chip8.prevReg = chip8.v[0xf];
					chip8.v[0xf] = 1;
					chip8.updateRegister(0xf);
				}
			}

			sprite = sprite << 1;
		}
	}
}

// case 0xe09e
// Ex8E
// SKP vX
//Skip next instruction if the key with the value vX is pressed
function skipInstructionIfVxKeyPressed(x) {
	var op = "0xE09E";
	var instr = "SKP vX";
	chip8.updateInstruction(op, instr);

	if (chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

// case 0xe0a1
// ExA1
// SKNP vX
//Skip next instruction if the key with the value vX is not pressed
function skipInstructionIfVxKeyNotPressed(x) {
	var op = "0xE0A1";
	var instr = "SKNP vX";
	chip8.updateInstruction(op, instr);

	if (!chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

// case 0xf007
// Fx07
// LD vX, DT
//Place value of DelayTimer in vX
function setVxToDelayTimer(x) {
	var op = "0xF007";
	var instr = "LD vX, DT";
	chip8.updateInstruction(op, instr);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.delayTimer;
	chip8.updateRegister(x);
}

// case 0xf00a
// Fx0A 
// LD vX, K
//Wait for keypress, then store it in vX
function waitAndStoreKeyPressInVx(x) {
	var op = "0xF00A";
	var instr = "LD vX, K";
	chip8.updateInstruction(op, instr);

	let keyPress = false;
	for (let i = 0; i < chip8.keyBuffer.length; i++) {
		if (chip8.keyBuffer[i]) {
			chip8.prevReg = chip8.v[x];
			chip8.v[x] = i;
			chip8.updateRegister(x);
			keyPress = true;
		}
	}

	if (!keyPress) chip8.pc -= 2;
}

// case 0xf015
// Fx15
// LD vX, K
//DelayTimer is set to vX
function setDelayTimerToVx(x) {
	var op = "0xF015";
	var instr = "LD vX, K";
	chip8.updateInstruction(op, instr);

	chip8.delayTimer = chip8.v[x];
}

// case 0xf018
// Fx18
// LD ST, vX
//Set Sound Timer to vX
function setSoundTimerToVx(x) {
	var op = "0xf018";
	var instr = "LD ST, vX";
	chip8.updateInstruction(op, instr);

	chip8.soundTimer = chip8.v[x];
}

// case 0xf01e
// Fx1E
// ADD I, vX
//Set i equal to i + vX
function setIToIPlusVx(x) {
	var op = "0xF01E";
	var instr = "ADD I, vX";
	chip8.updateInstruction(op, instr);

	chip8.i += chip8.v[x];
}

// case 0xf029
// Fx29
// LD F, vX
//Set i equal to location of sprite for digit vX
function setIToLocationOfSpriteFromVx(x) {
	var op = "0xF029";
	var instr = "LD F, vX";
	chip8.updateInstruction(op, instr);

	chip8.i = chip8.v[x] * 5;
}

// case 0xf033
// Fx33
// LD B, vX
//Store BCD representation of vX in memory location starting at i
function storeBCDOfVxInI(x) {
	var op = "0xF033";
	var instr = "LD B, vX";
	chip8.updateInstruction(op, instr);

	var index = chip8.i;
	var value = chip8.v[x] / 100; //Store hundreth's position at location i in memory
	chip8.memory[index] = value; 
	chip8.updateMem(index, value);

	index = chip8.i + 1;
	value = (chip8.v[x] / 10) % 10;
	chip8.memory[index] = value; // Store tens digit into location i + 1 in memory
	chip8.updateMem(index, value);

	index = chip8.i + 2;
	value = (chip8.v[x] % 100) % 10;
	chip8.memory[index] = value // Store ones digit into location i + 2 in memory	
	chip8.updateMem(index, value);
}

// case 0xf055
// Fx55
// LD [I], vX
//Store registers v0 through vX in memory at i
function storeV0ToVxInMemory(x) {
	var op = "0xF055";
	var instr = "LD [I], vX";
	chip8.updateInstruction(op, instr);

	for (let i = 0; i <= x; i++) {
		var index = chip8.i + i;
		var value = chip8.v[i];
		chip8.memory[index] = value;
		chip8.updateMem(index, value);
	}
}

// case 0xf065
// Fx65
// LD vX, [I]
//Read registers from v0 through vX at i
function storeMemoryInVRegisters(x) {
	var op = "0xF065";
	var instr = "LD vX, [I]";
	chip8.updateInstruction(op, instr);

	for (let i = 0; i <= x; i++) {
		chip8.prevReg = chip8.v[i];
		chip8.v[i] = chip8.memory[chip8.i + i];
		chip8.updateRegister(i);
	}
}