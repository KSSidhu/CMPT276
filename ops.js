
// case 0x00e0
function clearScreen() {
	chip8.vram = chip8.vram.map(() => 0);
}

// case 0x00ee
function returnFromSubroutine() {
	chip8.sp--;
	chip8.pc = chip8.stack[chip8.sp]; // push PC to top of stack
}

// case 0x1000
//Jump to Address, location
function jmpToLocation(opcode) {
	chip8.pc = opcode & 0x0fff;
}

// case 0x2000
//Call Function
function callAddress(opcode) {
	chip8.stack[chip8.sp] = chip8.pc;
	chip8.sp++;
	chip8.pc = opcode & 0x0fff;
}

// case 0x3000
//Skip to Next Instruction, vX Equal nn
function skipInstruction_VxEqKk(opcode, x) {
	if (chip8.v[x] === (opcode & 0x00ff)) {
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

// case 0x4000
//Skip to Next Instruction, if vX Not Equal kk
function skipInstruction_VxNeqKk(opcode, x) {
	if (chip8.v[x] != (opcode & 0x00ff)) {
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

// case 0x5000
//Skip to Next Instruction, if vX Equals vY
function skipInstruction_VxEqVy(x, y) {
	if (chip8.v[x] === chip8.v[y]) {
		chip8.pc += 2;
	}
}

// case 0x6000
//Set vX to kk
function setVxTonn(opcode, x) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = opcode & 0x00ff;
	chip8.updateRegister(x);
}

// case 0x7000
//set vX equal to vX + kk
function addnnToVx(opcode, x) {
	// chip8.v[x] += opcode & 0x00ff;
	let val = (opcode & 0xff) + chip8.v[x];

	if(val > 255) {
		val -= 256;
	}

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = val;
	chip8.updateRegister(x);
}

// case 0x8000
//Store vY in vX
function setVxToVy(x, y) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8001
//Set vX equal to vX or vY
function setVxToVxOrVy(x, y) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] | chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8002
//Set vX equal to vX and vY
function setVxToVxAndVy(x, y) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] & chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8003
//Set vX equal to vX XOR vY
function setVxToVxXorVy(x, y) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] ^ chip8.v[y];

	chip8.updateRegister(x);
}

// case 0x8004
//Set vX equal to vX + vY, set vF equal to carry
function addVyToVx(x, y) {
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
//set vX equal to vX - vY, set vF equal to NOT borrow
//if vX > vY then vF is 1, otherwise 0. Then vX - vY and result stored in vX
function subVyFromVx(x, y) {
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
//Set vX = vX SHR 1
//if least significant bit of vX is 1, then vF is 1, otherwise 0. Then result divided by 2
function shiftVxRight(x, y) {
	chip8.prevReg = chip8.v[0xf];
	chip8.v[0xf] = chip8.v[x] & 0x1;
	chip8.updateRegister(0xf);

	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.v[x] >> 1;
	chip8.updateRegister(x);
}

// case 0x8007
//Set vX equal to vY - vX, set vF equal to NOT borrow
//if vY > vX then vF is set to 1, otherwise 0. Then vX - vY and result stored in vX
function setVxToVyMinVx(x, y) {
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
//Set vX equal to vX SHL 1
//if most significant bit of vX is 1, then vF is set to 1, otherwise 0. Then vX is multiplied by 2.
function shiftVxLeft(x) {
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
//Skip next instruction if vX is not equal to vY
function skipInstructionIfVxNeqVy(x, y) {
	if (chip8.v[x] != chip8.v[y]) {
		chip8.pc += 2;
	}
}

// case 0xa000
// Sets I to address NNN
function setITonnn(opcode) {
	chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
}

// case 0xb000
//Jump to location v0 + nnn
function jmpToV0Plusnnn(opcode) {
	chip8.pc = (opcode & 0x0fff) + chip8.v[0];
}

// case 0xc000
//Set vX equal to random byte AND kk
function setVxRandomByte(opcode, x) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = Math.floor(Math.random() * 256) & (opcode & 0x00ff);
	chip8.updateRegister(x);

}

// case 0xd000
function drawSprite(opcode, x, y) {
	//Display n-byte sprite starting at memory location i at (vX, vY), set vF equal to collis
	let height = opcode & 0x000f; // save nibble for height of pixel
	let sprite;

	let v_X = chip8.v[x];
	let v_Y = chip8.v[y];

	chip8.v[0xf] = 0;

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
//Skip next instruction if the key with the value vX is pressed
function skipInstructionIfVxKeyPressed(x) {
	if (chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

// case 0xe0a1
//Skip next instruction if the key with the value vX is not pressed
function skipInstructionIfVxKeyNotPressed(x) {
	if (!chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

// case 0xf007
//Place value of DelayTimer in vX
function setVxToDelayTimer(x) {
	chip8.prevReg = chip8.v[x];
	chip8.v[x] = chip8.delayTimer;
	chip8.updateRegister(x);
}

// case 0xf00a
//Wait for keypress, then store it in vX
function waitAndStoreKeyPressInVx(x) {
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
//DelayTimer is set to vX
function setDelayTimerToVx(x) {
	chip8.delayTimer = chip8.v[x];
}

// case 0xf018
//Set Sound Timer to vX
function setSoundTimerToVx(x) {
	chip8.soundTimer = chip8.v[x];
}

// case 0xf01e
//Set i equal to i + vX
function setIToIPlusVx(x) {
	chip8.i += chip8.v[x];
}

// case 0xf029
//Set i equal to location of sprite for digit vX
function setIToLocationOfSpriteFromVx(x) {
	chip8.i = chip8.v[x] * 5;
}

// case 0xf033
//Store BCD representation of vX in memory location starting at i
function storeBCDOfVxInI(x) {
	chip8.memory[chip8.i] = chip8.v[x] / 100; //Store hundreth's position at location i in memory
	chip8.memory[chip8.i + 1] = (chip8.v[x] / 10) % 10; // Store tens digit into location i + 1 in memory
	chip8.memory[chip8.i + 2] = (chip8.v[x] % 100) % 10; // Store ones digit into location i + 2 in memory
}

// case 0xf055
//Store registers v0 through vX in memory at i
function storeV0ToVxInMemory(x) {
	for (let i = 0; i <= x; i++) {
		chip8.memory[chip8.i + i] = chip8.v[i];
	}
}

// case 0xf065
//Read registers from v0 through vX at i
function storeMemoryInVRegisters(x) {
	for (let i = 0; i <= x; i++) {
		chip8.prevReg = chip8.v[i];
		chip8.v[i] = chip8.memory[chip8.i + i];
		chip8.updateRegister(i);
	}
}