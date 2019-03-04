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
	test6 = chip8.keyPressed === false ? true : false;
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

	if (test1 & test2 & test3 & test4 & test5 & test6 & test7 & test8 & test9 & test10 & test11) {
		console.log('SUCCESS: reset function');
	} else {
		console.log('ERROR: reset function');
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
		console.log('SUCCESS: Pause Button');
	} else {
		console.log('ERROR: Pause Button');
	}
}

function test_00e0() {
	let opcode = 0x00e0;
	chip8.runCycle(opcode);
	for (let i = 0; i < chip8.vram.length; i++) {
		// expect(chip8.vram[i]).toEqual(0);
		if (chip8.vram[i] != 0) {
			console.log('ERROR: 0x00e0');
		}
	}

	console.log('SUCCESS: 0x00e0');
}

function test_00ee() {
	chip8.reset();
	let opcode = 0x00ee;
	chip8.sp = 1;
	chip8.runCycle(opcode);
	
	let test = ((chip8.sp === 0) & (chip8.pc === 0)) ? true : false;

	if(test) {
		console.log('SUCCESS: 0x00ee');
	} else {
		console.log("ERROR: 0x00ee");
	}
}

function test_1000() {
	chip8.reset();
	let opcode = 0x1000;
	chip8.runCycle(opcode);
	let test = (chip8.pc === 0) ? true : false;

	if(test) {
		console.log("SUCCESS: 0x1000");
	} else {
		console.log("ERROR: 0x1000");
	}
}

function test_2000() {
	chip8.reset();
	let opcode = 0x2111;
	chip8.runCycle(opcode);

	test1 = ((chip8.sp === 1) & (chip8.pc === 0x0111)) ? true : false;
	test2 = (chip8.stack[0] === 514) ? true : false;

	if(test1 & test2) {
		console.log("SUCCESS: 0x2000");
	} else {
		console.log("ERROR: 0x2000");
	}
}

function test_3000() {
	chip8.reset();
	let opcode = 0x3111;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	let test1 = (chip8.pc === 516) ? true : false;

	chip8.v[x] = 1;
	chip8.runCycle(opcode);

	let test2 = (chip8.pc === 518) ? true : false;

	if(test1 & test2) {
		console.log("SUCCESS: 0x3000");
	} else {
		console.log("ERROR: 0x3000");
	}
}

function test_4000() {
	chip8.reset();
	var opcode = 0x4011;
	var x = (opcode & 0x0f00) >> 8;
	chip8.v[x] = 0x0011;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	let test1 = (chip8.pc === 514) ? true : false;

	chip8.v[x] = 0x0033;
	chip8.runCycle(opcode);
	let test2 = (chip8.pc === 518) ? true : false;

	if(test1 & test2) {
		console.log("SUCCESS: 0x4000");
	} else {
		console.log("ERROR: 0x4000");
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

	chip8.v[y] = 12;
	chip8.v[x] = 0;

	let test2 = (chip8.pc === 516) ? true : false;

	if(test1 & test2) {
		console.log("SUCCESS: 0x5000");
	} else {
		console.log("ERROR: 0x5000");
	}
}

function test_6000() {
	chip8.reset();
	let opcode = 0x6011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.runCycle(opcode);

	let test = ((chip8.v[x] === 17) & (chip8.pc === 514)) ? true : false;

	if(test) {
		console.log("SUCCESS: 0x6000");
	} else {
		console.log("ERROR: 0x6000");
	}
}

function test_7000() {
	chip8.reset();
	let opcode = 0x7011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode);
	let test = ((chip8.v[x] === 34) & (chip8.pc === 514)) ? true : false;

	if(test) {
		console.log("SUCCESS: 0x7000");
	} else {
		console.log("ERROR: 0x7000");
	}
}

function test_8000() {
	console.log("TEST: 0x8000");
	chip8.reset();
	let opcode = 0x8120;

	let y = (opcode & 0x00f0) >> 4;
	let x = (opcode & 0x0f00) >> 8;

	// Opcode: 0x800
	chip8.v[y] = 17;
	chip8.runCycle(opcode);
	let test1 = ((chip8.pc === 514) & (chip8.v[x] === 17)) ? true : false;
	if(test1) {
		console.log(" - SUCCESS: 0x8000");
	} else {
		console.log(" - ERROR: 0x8000");
	}

	// Opcode: 0x8001
	chip8.v[x] = 0;
	chip8.runCycle(0x8121);
	let test2 = ((chip8.pc === 516) & (chip8.v[x] === 17)) ? true : false;
	if(test2) {
		console.log(" - SUCCESS: 0x8001");
	} else {
		console.log(" - ERROR: 0x8001");
	}

	// Opcode: 0x8002
	chip8.v[x] = 0;
	chip8.runCycle(0x8122);
	let test3 = ((chip8.pc === 518) & (chip8.v[x] === 0)) ? true : false;
	if(test3) {
		console.log(" - SUCCESS: 0x8002");
	} else {
		console.log(" - ERROR: 0x8002");
	}

	// Opcode: 0x8003
	chip8.v[x] = 0;
	chip8.runCycle(0x8123);
	let test4 = ((chip8.pc === 520) & (chip8.v[x] === 17)) ? true : false;
	if(test4) {
		console.log(" - SUCCESS: 0x8003");
	} else {
		console.log(" - ERROR: 0x8003");
	}

	// Opcode: 0x8004
	chip8.v[x] = 0;
	chip8.runCycle(0x8124);
	let test5 = ((chip8.pc === 522) & (chip8.v[x] === 17) & (chip8.v[0xf] === 0)) ? true : false;
	if(test5) {
		console.log(" - SUCCESS: 0x8004");
	} else {
		console.log(" - ERROR: 0x8004");
	}

	// Opcode: 0x8005
	chip8.v[x] = 0;
	chip8.runCycle(0x8125);
	let test6 = ((chip8.pc === 524) & (chip8.v[0xf] === 0)) ? true : false;
	if(test6) {
		console.log(" - SUCCESS: 0x8005");
	} else {
		console.log(" - ERROR: 0x8005");
	}

	// Opcode: 0x8006
	chip8.v[x] = 1;
	chip8.runCycle(0x8126);
	let test7 = ((chip8.pc === 526) & (chip8.v[x] === 0) & (chip8.v[0xf] === 1)) ? true : false;
	if(test7) {
		console.log(" - SUCCESS: 0x8006");
	} else {
		console.log(" - ERROR: 0x8006");
	}

	// Opcode: 0x8007
	chip8.reset();
	chip8.v[x] = 0;
	chip8.runCycle(0x8127);
	let test8 = ((chip8.pc === 514) & (chip8.v[x] === 0) & (chip8.v[0xf] === 0) & test7 & test6 & test5 & test4 & test3 & test2 & test1) ? true : false;
	if(test8) {
		console.log(" - SUCCESS: 0x8007");
	} else {
		console.log(" - ERROR: 0x8007");
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

	chip8.v[1] = 1;
	chip8.v[4] = 1;

	chip8.runCycle(opcode);

	let test2 = (chip8.pc === 518) ? true : false;

	if(test2) {
		console.log("SUCCESS: 0x9000");
	} else {
		console.log("ERROR: 0x9000");
	}
}

function test_a000() {
	chip8.reset();
	let opcode = 0xa140;

	chip8.runCycle(opcode);

	let test = ((chip8.i === 0x0140) & (chip8.pc === 514)) ? true : false;

	if(test) {
		console.log("SUCCESS: 0xa000");
	} else {
		console.log("ERROR: 0xa000");
	}
}

function test_b000() {
	chip8.reset();
	let opcode = 0xb123;

	chip8.v[0] = 12;

	chip8.runCycle(opcode);

	let test = (chip8.pc === 0x0123 + 12) ? true : false;

	if(test) {
		console.log("SUCCESS: 0xb000");
	} else {
		console.log("ERROR: 0xb000");
	}
}

function test_c000() {
	chip8.reset();
	let opcode = 0xc123;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[1] = 0;

	chip8.runCycle(opcode);

	let test = ((chip8.v[1] != 0 || chip8.v[1] == 0) & (chip8.pc === 514)) ? true : false;

	if(test) {
		console.log("SUCCESS: 0xc000");
	} else {
		console.log("ERROR: 0xc000");
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
		console.log(" - SUCCESS: DRAWS PIXELS");
	} else {
		console.log(" - ERROR: DOESN'T DRAW PIXELS")
	}


	for(let i = 0; i < chip8.vram.length; i++) {
		chip8.vram[i] = 1;
	}

	chip8.runCycle(0xd122);

	test = (chip8.v[0xf] === 1) ? true : false;

	if(test) {
		console.log(" - SUCCESS: DETECTS EXISTING SPRITES");
	} else {
		console.log(" - ERROR: DOESN'T DETECT EXISTING PIXELS")
	}
}


function test_e09e() {
	chip8.reset();
	console.log("TEST: 0xe09e");


	chip8.pc = 0;
	let opcode = 0xe19e;
	chip8.v[1] = 2;
	chip8.keyBuffer[chip8.v[1]] = true;

	chip8.runCycle(opcode);

	if(chip8.pc === 4) {
		console.log(" - SUCCESS: SKIPS INSTRUCTION IF KEY IN V[X] IS PRESSED");
	} else {
		console.log(" - ERROR: DOESN'T SKIP INSTRUCTION IF KEY IN V[X] IS PRESSED");
	}


	chip8.pc = 0;
	opcode = 0xe29e;
	chip8.v[2] = 2;

	chip8.keyBuffer[chip8.v[2]] = false;

	chip8.runCycle(opcode);

	if(chip8.pc === 2) {
		console.log(" - SUCCESS: DOES NOT SKIP INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	} else {
		console.log(" - ERROR: DOES SKIP INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	}
}

function test_e01a() {
	chip8.reset();
	console.log("TEST: 0xe01a");


	chip8.pc = 0;
	let opcode = 0xe3a1;
	chip8.v[3] = 2;

	chip8.keyBuffer[chip8.v[3]] = false;

	chip8.runCycle(0xe3a1);

	if(chip8.pc === 4) {
		console.log(" - SUCCESS: SKIPS INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	} else {
		console.log(" - ERROR: DOESN'T SKIP INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	}


	chip8.pc = 0;
	opcode = 0xe4a1;
	chip8.v[4] = 2;

	chip8.keyBuffer[chip8.v[4]] = true;

	chip8.runCycle(opcode);
	
	if(chip8.pc === 2) {
		console.log(" - SUCCESS: DOESN'T SKIP INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	} else {
		console.log(" - ERROR: DOES SKIP INSTRUCTION IF KEY IN V[X] IS NOT PRESSED");
	}
}


function test_f000() {
	chip8.reset();
	console.log("TEST: 0xf000");

	// OPCODE: 0xf007;
	let opcode = 0xf007;
	let x = (opcode & 0x0f00) >> 8;
	chip8.delayTimer = 12;
	chip8.runCycle(opcode);

	let test1 = ((chip8.pc === 514) & (chip8.v[x] === 12)) ? true : false;

	if(test1) {
		console.log(" - SUCCESS: 0xf007");
	} else {
		console.log(" - ERROR: 0xf007");
	}

	// OPCODE: 0xf015;
	chip8.v[x] = 11;
	opcode = 0xf015;
	chip8.runCycle(opcode);

	let test2 = ((chip8.pc === 516) & (chip8.delayTimer === 11)) ? true : false;

	if(test2) {
		console.log(" - SUCCESS: 0xf015");
	} else {
		console.log(" - ERROR: 0xf015");
	}

	// OPCODE: 0xf018;
	opcode = 0xf018;
	chip8.runCycle(opcode);

	let test3 = ((chip8.pc === 518) & (chip8.soundTimer === 11)) ? true : false;

	if(test3) {
		console.log(" - SUCCESS: 0xf018");
	} else {
		console.log(" - ERROR: 0xf018");
	}

	// OPCODE: 0xf01e;
	opcode = 0xf01e;
	chip8.runCycle(opcode);

	let test4 = ((chip8.pc === 520) & (chip8.i === 11)) ? true : false;

	if(test4) {
		console.log(" - SUCCESS: 0xf01e");
	} else {
		console.log(" - ERROR: 0xf01e");
	}

	// OPCODE: 0xf029;
	opcode = 0xf029;
	chip8.runCycle(opcode);

	let test5 = ((chip8.pc === 522) & (chip8.i === 55)) ? true : false;

	if(test5) {
		console.log(" - SUCCESS: 0xf029");
	} else {
		console.log(" - ERROR: 0xf029");
	}

	// OPCODE: 0xf033;
	opcode = 0xf033;
	chip8.v[x] = 101;
	chip8.i = 0;
	chip8.runCycle(opcode);

	let test6 = ((chip8.memory[chip8.i] === 1) & (chip8.memory[chip8.i + 1] === 0) & (chip8.memory[chip8.i + 2] === 1)) ? true : false;

	if(test6) {
		console.log(" - SUCCESS: 0xf029");
	} else {
		console.log(" - ERROR: 0xf029");
	}
}