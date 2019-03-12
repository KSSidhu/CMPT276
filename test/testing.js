function resetTest() {
	// console.log("reset function");
	let test1 = true;
	let test2 = true;
	let test3 = true;
	let test4 = true;
	let test5 = true;
	let test6 = true;
	let test7 = true;
	let test8 = true;
	let test9 = true;
	let test10 = true;
	let test11 = true;

	chip8.reset();

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


	// Check static variables
	// expect(chip8).toMatchObject({pc: 0x200, sp: 0, i: 0, delayTimer: 0, soundTimer: 0});
	test1 = chip8.pc === 0x200 ? true : false;
	test2 = chip8.sp === 0 ? true : false;
	test3 = chip8.delayTimer === 0 ? true : false;
	test4 = chip8.soundTimer === 0 ? true : false;
	test5 = chip8.paused === false ? true : false;
	// Check flags
	// expect(chip8).toMatchObject({paused: false, keyPressed: false});
	// Check arrays for memory, registers and vram
	for (let i = 0; i < 80; i++) {
		if (chip8.memory[i] != CHIP8_FONTSET[i]) {
			test7 = false;
		}
		if (i < 16) {
			if (chip8.v[i] != 0) {
				test8 = false;
			}
			if (chip8.stack[i] != 0) {
				test9 = false;
			}
		} else if (i < 2048) {
			// expect(chip8.vram[i]).toEqual(0)
			if (chip8.vram[i] != 0) {
				test10 = false;
			}
		}
	}

	for (let i = 0; i < chip8.keyBuffer.length; i++) {
		// expect(chip8.keyBuffer[i]).toEqual(0);
		if (chip8.keyBuffer[i] != 0) {
			test11 = false;
		}
	}

	if (test1) {
		document.getElementById("checkPC").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkPC").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test2) {
		document.getElementById("checkSP").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkSP").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test3 & test4) {
		document.getElementById("checkTimers").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkTimers").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test5) {
		document.getElementById("checkPaused").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkPaused").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test7) {
		document.getElementById("checkMemory").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkMemory").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test8) {
		document.getElementById("checkVRegisters").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkVRegisters").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test9) {
		document.getElementById("checkStack").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkStack").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test10) {
		document.getElementById("checkVram").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkVram").innerHTML = '<i class="fas fa-times"></i>';
	}

	if (test11) {
		document.getElementById("checkKeyBuffer").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkKeyBuffer").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function pauseTest() {
	let test1 = true;
	let test2 = true;
	let test3 = true;
	chip8.start(); // Begin emulation cycle

	// expect(chip8.paused).toEqual(false); // should not be paused
	if (chip8.paused != false) {
		test1 = false;
	}

	chip8.pause(); // simulated clicking pause
	if (chip8.paused != true) {
		test2 = false;
	}

	chip8.pause(); // simulated unclicking pause
	if (chip8.paused != false) {
		test3 = false;
	}

	if (test1 & test2 & test3) {
		document.getElementById("checkPause").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("checkPause").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_00e0() {
	let opcode = 0x00e0;
	chip8.runCycle(opcode);
	for (let i = 0; i < chip8.vram.length; i++) {
		// expect(chip8.vram[i]).toEqual(0);
		if (chip8.vram[i] != 0) {
			document.getElementById("check0x00e0").innerHTML = '<i class="fas fa-times"></i>';
			return;
		}
	}

	document.getElementById("check0x00e0").innerHTML = '<i class="fas fa-check"></i>';
}

function test_00ee() {
	chip8.reset();
	let opcode = 0x00ee;
	chip8.sp = 1;
	chip8.runCycle(opcode);
	
	let test = (chip8.sp === 0) ? true : false;
	let test2 = chip8.pc === 0 ? true : false;

	if(test) {
		document.getElementById("check0x00EEi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x00EEi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0x00EEii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x00EEii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_1000() {
	chip8.reset();
	let opcode = 0x1000;
	chip8.runCycle(opcode);
	let test = (chip8.pc === 0) ? true : false;

	if(test) {
		document.getElementById("check0x1NNN").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x1NNN").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_2000() {
	chip8.reset();
	let opcode = 0x2111;
	chip8.runCycle(opcode);

	test1 = ((chip8.sp === 1) & (chip8.pc === 0x0111)) ? true : false;
	if(test1) {
		document.getElementById("check0x2NNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x1NNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	test2 = (chip8.stack[0] === 514) ? true : false;
	if(test2) {
		document.getElementById("check0x2NNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x1NNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_3000() {
	chip8.reset();
	let opcode = 0x3111;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	let test1 = (chip8.pc === 516) ? true : false;
	if(test1) {
		document.getElementById("check0x3NNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x3NNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	chip8.v[x] = 1;
	chip8.runCycle(opcode);

	let test2 = (chip8.pc === 518) ? true : false;
	if(test2) {
		document.getElementById("check0x3NNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x3NNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_4000() {
	chip8.reset();
	var opcode = 0x4011;
	var x = (opcode & 0x0f00) >> 8;
	chip8.v[x] = 0x0011;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	let test1 = (chip8.pc === 514) ? true : false;
	if(test1) {
		document.getElementById("check0x4NNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x4NNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	chip8.v[x] = 0x0033;
	chip8.runCycle(opcode);
	let test2 = (chip8.pc === 518) ? true : false;

	if(test2) {
		document.getElementById("check0x4NNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x4NNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_5000() {
	chip8.reset();
	let opcode = 0x5000;
	let x = (opcode & 0x0f00) >> 8;
	let y = (opcode & 0x00f0) >> 4;

	chip8.v[y] = 12;
	chip8.v[x] = 12;

	chip8.runCycle(opcode);
	let test1 = (chip8.pc === 516) ? true : false;

	if(test1) {
		document.getElementById("check0x5XYNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x5XYNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	chip8.v[y] = 12;
	chip8.v[x] = 0;

	let test2 = (chip8.pc === 516) ? true : false;

	if(test2) {
		document.getElementById("check0x5XYNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x5XYNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_6000() {
	chip8.reset();
	let opcode = 0x6011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.runCycle(opcode);

	let test1 = (chip8.v[x] === 17) ? true : false;
	let test2 = (chip8.pc === 514) ? true : false

	if(test1) {
		document.getElementById("check0x6XNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x6XNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0x6XNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x6XNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_7000() {
	chip8.reset();
	let opcode = 0x7011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode);
	let test = (chip8.v[x] === 34) ? true : false;
	let test2 = chip8.pc === 514 ? true : false;

	if(test1) {
		document.getElementById("check0x7XNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x7XNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0x7XNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x7XNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_8000() {
	chip8.reset();
	let opcode = 0x8120;

	let y = (opcode & 0x00f0) >> 4;
	let x = (opcode & 0x0f00) >> 8;

	// Opcode: 0x8000
	chip8.v[y] = 17;
	chip8.runCycle(opcode);
	let test = (chip8.pc === 514) ? true : false;
	let test1 = (chip8.v[x] === 17) ? true : false;
	if(test1) {
		document.getElementById("check0x8XY0i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY0i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY0ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY0ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8001
	chip8.v[x] = 0;
	chip8.runCycle(0x8121);
	test = (chip8.pc === 516)? true : false;
	let test2 = (chip8.v[x] === 17) ? true : false;

	if(test2) {
		document.getElementById("check0x8XY1i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY1i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY1ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY1ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8002
	chip8.v[x] = 0;
	chip8.runCycle(0x8122);
	let test3 = (chip8.v[x] === 0) ? true : false;
	test = (chip8.pc === 518) ? true : false;

	if(test3) {
		document.getElementById("check0x8XY2i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY2i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY2ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY2ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8003
	chip8.v[x] = 0;
	chip8.runCycle(0x8123);
	test = (chip8.pc === 520) ? true : false;
	let test4 = (chip8.v[x] === 17) ? true : false;
	
	if(test4) {
		document.getElementById("check0x8XY3i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY3i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY3ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY3ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8004
	chip8.v[x] = 0;
	chip8.runCycle(0x8124);
	test = (chip8.pc === 522)  ? true : false;
	let test5 = (chip8.v[x] === 17) ? true : false;
	let test5Sub = (chip8.v[0xf] === 0) ? true : false;
	
	if(test5) {
		document.getElementById("check0x8XY4i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY4i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test5Sub) {
		document.getElementById("check0x8XY4ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY4ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY4iii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY4iii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8005
	chip8.v[x] = 20;
	chip8.runCycle(0x8125);
	let test6 = (chip8.pc === 524) ? true : false;
	test = (chip8.v[0xf] === 1) ? true : false;
	let test6Sub = (chip8.v[x] === 3) ? true : false;

	
	if(test6) {
		document.getElementById("check0x8XY5i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY5i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test6Sub) {
		document.getElementById("check0x8XY5ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY5ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY5iii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY5iii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8006
	chip8.v[x] = 1;
	chip8.runCycle(0x8126);
	test = (chip8.pc === 526) ? true : false;
	let test7Sub = (chip8.v[0xf] === 1) ? true : false;
	let test7 = (chip8.v[x] === 0) ? true : false;
	
	if(test7) {
		document.getElementById("check0x8XY6i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY6i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test7Sub) {
		document.getElementById("check0x8XY6ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY6ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY6iii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY6iii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8007
	chip8.reset();
	chip8.v[x] = 0;
	chip8.runCycle(0x8127);
	test = (chip8.pc === 514) ? true : false;
	let test8 = (chip8.v[0xf] === 0) ? true : false;
	let test8Sub = (chip8.v[x] === 0) ? true : false;

	if(test8) {
		document.getElementById("check0x8XY7i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY7i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test8Sub) {
		document.getElementById("check0x8XY7ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY7ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XY7iii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XY7iii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// Opcode: 0x8006
	chip8.v[x] = 255;
	chip8.runCycle(0x8126);
	test = (chip8.pc === 516) ? true : false;
	let testESub = (chip8.v[0xf] === 1) ? true : false;
	let testE = (chip8.v[x] === 127) ? true : false;
	
	if(testE) {
		document.getElementById("check0x8XYEi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XYEi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(testESub) {
		document.getElementById("check0x8XYEii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XYEii").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test) {
		document.getElementById("check0x8XYEiii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x8XYEiii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_9000() {
	chip8.reset();
	let opcode = 0x9140;

	let y = (opcode & 0x00f0) >> 4;
	let x = (opcode & 0x0f00) >> 8;
	chip8.v[1] = 4;
	chip8.v[4] = 1;

	chip8.runCycle(opcode);

	let test1 = (chip8.pc === 516) ? true : false;

	if(test1) {
		document.getElementById("check0x9XY0i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x9XY0i").innerHTML = '<i class="fas fa-times"></i>';
	}

	chip8.v[1] = 1;
	chip8.v[4] = 1;

	chip8.runCycle(opcode);

	let test2 = (chip8.pc === 518) ? true : false;

	if(test2) {
		document.getElementById("check0x9XY0ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0x9XY0ii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_a000() {
	chip8.reset();
	let opcode = 0xa140;

	chip8.runCycle(opcode);

	let test = (chip8.i === 0x0140) ? true : false;
	let test2 = (chip8.pc === 514) ? true : false;

	if(test) {
		document.getElementById("check0xANNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xANNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xANNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xANNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_b000() {
	chip8.reset();
	let opcode = 0xb123;

	chip8.v[0] = 12;

	chip8.runCycle(opcode);

	let test = (chip8.pc === 0x0123 + 12) ? true : false;

	if(test) {
		document.getElementById("check0xBNNN").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xBNNN").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_c000() {
	chip8.reset();
	let opcode = 0xc123;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[1] = 0;

	chip8.runCycle(opcode);

	let test = (chip8.v[1] != 0 || chip8.v[1] == 0) ? true : false;
	let test2 = (chip8.pc === 514) ? true : false;

	if(test) {
		document.getElementById("check0xCNNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xCNNNi").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xCNNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xCNNNii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_d000() {

	chip8.reset();

	for(let i = 0; i < chip8.vram.length; i++) {
		chip8.vram[i] = 0;
	}

	chip8.runCycle(0xd122);

	let test = (chip8.v[0xf] === 0) ? true : false;

	if(test) {
		document.getElementById("check0xDNNNi").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xDNNNi").innerHTML = '<i class="fas fa-times"></i>';
	}


	for(let i = 0; i < chip8.vram.length; i++) {
		chip8.vram[i] = 1;
	}

	chip8.runCycle(0xd122);

	test = (chip8.v[0xf] === 1) ? true : false;

	if(test) {
		document.getElementById("check0xDNNNii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xDNNNii").innerHTML = '<i class="fas fa-times"></i>';
	}

	test = chip8.pc === 516 ? true : false;

	if(test) {
		document.getElementById("check0xDNNNiii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xDNNNiii").innerHTML = '<i class="fas fa-times"></i>';
	}
}


function test_e09e() {
	chip8.reset();


	chip8.pc = 0;
	let opcode = 0xe19e;
	chip8.v[1] = 2;
	chip8.keyBuffer[chip8.v[1]] = true;

	chip8.runCycle(opcode);

	if(chip8.pc == 4) {
		document.getElementById("check0xEX9Ei").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xEX9Ei").innerHTML = '<i class="fas fa-times"></i>';
	}


	chip8.pc = 0;
	opcode = 0xe29e;
	chip8.v[2] = 2;

	chip8.keyBuffer[chip8.v[2]] = false;

	chip8.runCycle(opcode);

	if(chip8.pc == 2) {
		document.getElementById("check0xEX9Eii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xEX9Eii").innerHTML = '<i class="fas fa-times"></i>';
	}
}

function test_e01a() {
	chip8.reset();


	chip8.pc = 0;
	let opcode = 0xe3a1;
	chip8.v[3] = 2;

	chip8.keyBuffer[chip8.v[3]] = false;

	chip8.runCycle(0xe3a1);

	if(chip8.pc == 4) {
		document.getElementById("check0xEXA1i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xEXA1i").innerHTML = '<i class="fas fa-times"></i>';
	}


	chip8.pc = 0;
	opcode = 0xe4a1;
	chip8.v[4] = 2;

	chip8.keyBuffer[chip8.v[4]] = true;

	chip8.runCycle(opcode);
	
	if(chip8.pc == 2) {
		document.getElementById("check0xEXA1ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xEXA1ii").innerHTML = '<i class="fas fa-times"></i>';
	}
}


function test_f000() {
	chip8.reset();

	// OPCODE: 0xf007;
	let opcode = 0xf007;
	let x = (opcode & 0x0f00) >> 8;
	chip8.delayTimer = 12;
	chip8.runCycle(opcode);

	let test1 = (chip8.pc === 514) ? true : false;
	let test2 = (chip8.v[x] === 12) ? true : false;

	
	if(test2) {
		document.getElementById("check0xFX07i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX07i").innerHTML = '<i class="fas fa-times"></i>';
	}


	if(test1) {
		document.getElementById("check0xFX07ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX07ii").innerHTML = '<i class="fas fa-times"></i>';
	}



	//OPCODE: 0xf00a
	opcode = 0xf10a
	chip8.runCycle(opcode);
	test1 = chip8.paused == false ? true : false;
	test2 = chip8.pc === 514 ? true : false;

	if(test1) {
		document.getElementById("check0xFX0Ai").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX0Ai").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX0Aii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX0Aii").innerHTML = '<i class="fas fa-times"></i>';
	}




	// OPCODE: 0xf015;
	chip8.v[x] = 11;
	opcode = 0xf015;
	chip8.runCycle(opcode);

	test1 = chip8.delayTimer === 11 ? true : false
	test2 = (chip8.pc === 516) ? true : false;


	if(test1) {
		document.getElementById("check0xFX15i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX15i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX15ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX15ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// OPCODE: 0xf018;
	opcode = 0xf018;
	chip8.runCycle(opcode);

	test1 = (chip8.soundTimer === 11) ? true : false
	test2 = (chip8.pc === 518) ? true : false;

	if(test1) {
		document.getElementById("check0xFX18i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX18i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX18ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX18ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// OPCODE: 0xf01e;
	opcode = 0xf01e;
	chip8.runCycle(opcode);

	test1 = (chip8.i === 11) ? true : false;
	test2 = (chip8.pc === 520) ? true : false;

	if(test1) {
		document.getElementById("check0xFX1Ei").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX1Ei").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX1Eii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX1Eii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// OPCODE: 0xf029;
	opcode = 0xf029;
	chip8.runCycle(opcode);

	test1 = chip8.i === 55 ? true : false;
	test2 = (chip8.pc === 522) ? true : false;

	if(test1) {
		document.getElementById("check0xFX29i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX29i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX29ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX29ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	// OPCODE: 0xf033;
	opcode = 0xf033;
	chip8.v[x] = 101;
	chip8.i = 0;
	chip8.runCycle(opcode);

	test1 = ((chip8.memory[chip8.i] === 1) & (chip8.memory[chip8.i + 1] === 0) & (chip8.memory[chip8.i + 2] === 1)) ? true : false;
	test2 = chip8.pc === 524 ? true : false;

	if(test1) {
		document.getElementById("check0xFX33i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX33i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX33ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX33ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	//OPCODE: 0xf055
	opcode = 0xf855;
	chip8.i = 5;
	chip8.runCycle(opcode);

	test =  true;
	test2 = chip8.pc === 526 ? true : false;

	for(let i = 0; i < 8; i++) {
		if(chip8.v[i] != chip8.memory[chip8.i + i]) {
			test = false;
		}
	}

	if(test) {
		document.getElementById("check0xFX55i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX55i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX55ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX55ii").innerHTML = '<i class="fas fa-times"></i>';
	}

	//OPCODE: 0xf065
	opcode = 0xf865;
	chip8.runCycle(opcode);

	test = true;
	test2 = chip8.pc === 528 ? true : false;

	for(let i = 0; i < 8; i++) {
		if(chip8.v[i] != chip8.memory[chip8.i + i]) {
			test = false;
		}
	}

	if(test) {
		document.getElementById("check0xFX65i").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX65i").innerHTML = '<i class="fas fa-times"></i>';
	}

	if(test2) {
		document.getElementById("check0xFX65ii").innerHTML = '<i class="fas fa-check"></i>';
	} else {
		document.getElementById("check0xFX65ii").innerHTML = '<i class="fas fa-times"></i>';
	}
}