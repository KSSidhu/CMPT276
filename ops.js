function clearScreen() {
	chip8.vram = chip8.vram.map(() => 0);
}

function returnFromSubroutine() {
	chip8.sp--;
	chip8.pc = chip8.stack[chip8.sp]; // push PC to top of stack
}

function jmpToLocation(opcode) {
	chip8.pc = opcode & 0x0fff;
}

function callAddress(opcode) {
	chip8.stack[chip8.sp] = chip8.pc;
	chip8.sp++;
	chip8.pc = opcode & 0x0fff;
}

function skipInstruction_VxEqKk(opcode, x) {
	if (chip8.v[x] === (opcode & 0x00ff)) {
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

function skipInstruction_VxNeqKk(opcode, x) {
	if (chip8.v[x] != (opcode & 0x00ff)) {
		//compare V[x] to last 8 bits
		chip8.pc += 2;
	}
}

function skipInstruction_VxEqVy(v, y) {
	if (chip8.v[x] === chip8.v[y]) {
		chip8.pc += 2;
	}
}

function setVxTonn(opcode, x) {
	chip8.v[x] = opcode & 0x00ff;
}

function addnnToVx(opcode, x) {
	chip8.v[x] += opcode & 0x00ff;
}

function setVxToVy(x, y) {
	chip8.v[x] = chip8.v[y];
}

function setVxToVxOrVy(x, y) {
	chip8.v[x] = chip8.v[x] | chip8.v[y];
}

function setVxToVxAndVy(x, y) {
	chip8.v[x] = chip8.v[x] & chip8.v[y];
}

function setVxToVxXorVy(x, y) {
	chip8.v[x] = chip8.v[x] ^ chip8.v[y];
}

function addVyToVx(x, y) {
	let val = chip8.v[x] + chip8.v[y];

	if (val > 0xff) {
		chip8.v[0xf] = 1;
	} else {
		chip8.v[0xf] = 0;
	}

	chip8.v[x] = val;
}

function subVyFromVx(x, y) {
	chip8.v[0xf] = +(chip8.v[x] > chip8.v[y]);
	chip8.v[x] -= chip8.v[y]; //Vx = Vx - Vy
}

function shiftVxRight(x, y) {
	chip8.v[0xf] = chip8.v[x] & 0x1;
	chip8.v[x] = chip8.v[x] >> 1;
}

function setVxToVyMinVx(x, y) {
	if (chip8.v[y] > chip8.v[x]) {
		// Vy > Vx
		chip8.v[0xf] = 1;
	} else {
		chip8.v[0xf] = 0;
	}

	chip8.v[x] = chip8.v[y] - chip8.v[x]; // Vx = Vy - Vx
}

function shiftVxLeft(x) {
	chip8.v[0xf] = chip8.v[x] >> 7;
	chip8.v[x] = chip8.v[x] << 1;
}

function skipInstructionIfVxNeqVy(x, y) {
	if (chip8.v[x] != chip8.v[y]) {
		chip8.pc += 2;
	}
}

function setITonnn(opcode) {
	chip8.i = opcode & 0x0fff; // This case grabs the last 12 bits to analyze
}

function jmpToV0Plusnnn(opcode) {
	chip8.pc = (opcode & 0x0fff) + chip8.v[0];
}

function setVxRandomByte(opcode, x) {
	chip8.v[x] = Math.floor(Math.random() * 256) & (opcode & 0x00ff);
}

function drawSprite(opcode, x, y) {
	//Display n-byte sprite starting at memory location i at (vX, vY), set vF equal to collis
	let height = opcode & 0x000f; // save nibble
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
					chip8.v[0xf] = 1;
				}
			}

			sprite = sprite << 1;
		}
	}
}

function skipInstructionIfVxKeyPressed(x) {
	if (chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

function skipInstructionIfVxKeyNotPressed(x) {
	if (!chip8.keyBuffer[chip8.v[x]]) {
		chip8.pc += 2;
	}
}

function setVxToDelayTimer(x) {
	chip8.v[x] = chip8.delayTimer;
}

function waitAndStoreKeyPressInVx(x) {
	let keyPress = false;
	for (let i = 0; i < chip8.keyBuffer.length; i++) {
		if (chip8.keyBuffer[i]) {
			chip8.v[x] = i;
			keyPress = true;
		}
	}

	if (!keyPress) chip8.pc -= 2;
}

function setDelayTimerToVx(x) {
	chip8.delayTimer = chip8.v[x];
}

function setSoundTimerToVx(x) {
	chip8.soundTimer = chip8.v[x];
}

function setIToIPlusVx(x) {
	chip8.i += chip8.v[x];
}

function setIToLocationOfSpriteFromVx(x) {
	chip8.i = chip8.v[x] * 5;
}

function storeBCDOfVxInI(x) {
	chip8.memory[chip8.i] = chip8.v[x] / 100; //Store hundreth's position at location i in memory
	chip8.memory[chip8.i + 1] = (chip8.v[x] / 10) % 10; // Store tens digit into location i + 1 in memory
	chip8.memory[chip8.i + 2] = (chip8.v[x] % 100) % 10; // Store ones digit into location i + 2 in memory
}

function storeV0ToVxInMemory(x) {
	for (let i = 0; i <= x; i++) {
		chip8.memory[chip8.i + i] = chip8.v[i];
	}
}

function storeMemoryInVRegisters(x) {
	for (let i = 0; i <= x; i++) {
		chip8.v[i] = chip8.memory[chip8.i + i];
	}
}
