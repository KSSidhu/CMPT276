
const chip8 = require('../chip8');
const ops = require("../ops.js");


let didIncrementPC = function(opcode) {
	test('incremented the PC', () => {
		chip8.pc = 10;
		chip8.runCycle(opcode);
		expect(chip8.pc).toEqual(12);
	});
};

// test reset function
test('reset function works', () => {
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
	expect(chip8).toMatchObject({ pc: 0x200, sp: 0, i: 0, delayTimer: 0, soundTimer: 0 });
	// Check flags
	expect(chip8).toMatchObject({ paused: false, keyPressed: false });
	// Check arrays for memory, registers and vram
	for (let i = 0; i < 80; i++) {
		expect(chip8.memory[i]).toEqual(CHIP8_FONTSET[i]);
		if (i < 16) {
			expect(chip8.v[i]).toEqual(0);
			expect(chip8.stack[i]).toEqual(0);
		} else if (i < 2048) {
			expect(chip8.vram[i]).toEqual(0);
		}
	}

	for (let i = 0; i < chip8.keyBuffer.length; i++) {
		expect(chip8.keyBuffer[i]).toEqual(0);
	}
});

// Rest the chip8 object prior to running any test
beforeEach(() => {
	chip8.reset();
	let cpu = chip8;
});

test('Emulator paused', () => {
	chip8.start(); // Begin emulation cycle

	expect(chip8.paused).toEqual(false); // should not be paused

	chip8.pause(); // simulated clicking pause

	expect(chip8.paused).toEqual(true);

	chip8.pause(); // simulated unclicking pause

	expect(chip8.paused).toEqual(false);
});

test('opcode: 0x00e0 is correct', () => {
	let opcode = 0x00e0;
	chip8.runCycle(opcode);
	// ops.clearScreen();
	for (let i = 0; i < chip8.vram.length; i++) {
		expect(chip8.vram[i]).toEqual(0);
	}
});

// test('opcode: 0x00ee is correct', () => {
// 	let opcode = 0x00ee;
// 	chip8.sp = 1;

// 	chip8.runCycle(opcode);

// 	expect(chip8).toMatchObject({ sp: 0, pc: 0 });
// });

// test('opcode: 0x1000 is correct', () => {
// 	let opcode = 0x1000;
// 	chip8.runCycle(opcode);
// 	let actual = 0;

// 	expect(chip8).toMatchObject({ pc: actual });
// });

// test('opcode: 0x2000 is correct', () => {
// 	let opcode = 0x2111;

// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ sp: 1, pc: 0x0111 });
// 	expect(chip8.stack[0]).toEqual(514);
// });

// test('opcode: 0x3000 is correct', () => {
// 	let opcode = 0x3111;
// 	let x = (opcode & 0x0f00) >> 8;

// 	chip8.v[x] = 17;

// 	chip8.runCycle(opcode); // run iteration with v[x] = 0
// 	expect(chip8).toMatchObject({ pc: 516 });

// 	chip8.v[x] = 1;
// 	chip8.runCycle(opcode);
// 	expect(chip8.pc).toEqual(518);
// });

// test('opcode: 0x4000 is correct', () => {
// 	var opcode = 0x4011;
// 	var x = (opcode & 0x0f00) >> 8;
// 	chip8.v[x] = 0x0011;

// 	chip8.runCycle(opcode); // run iteration with v[x] = 0

// 	expect(chip8.pc).toEqual(514); // run iteration with v[x] = 0

// 	// chip8.reset();

// 	chip8.v[x] = 0x0033;
// 	chip8.runCycle(opcode);
// 	expect(chip8.pc).toEqual(518);
// });

// test('opcode: 0x5000 is correct', () => {
// 	let opcode = 0x5000;
// 	let x = (opcode & 0x0f00) >> 8;
// 	let y = (opcode & 0x00f0) >> 4;

// 	chip8.v[y] = 12;
// 	chip8.v[x] = 12;

// 	chip8.runCycle(opcode);

// 	// expect(chip8.pc).toEqual(514); // run iteration with v[x] = 0

// 	expect(chip8).toMatchObject({ pc: 516 });

// 	chip8.v[y] = 12;
// 	chip8.v[x] = 0;

// 	expect(chip8).toMatchObject({ pc: 516 });
// });

// test('opcode: 0x6000 is correct', () => {
// 	let opcode = 0x6011;
// 	var x = (opcode & 0x0f00) >> 8;

// 	chip8.runCycle(opcode);

// 	expect(chip8.v[x]).toEqual(17);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// test('opcode: 0x7000 is correct', () => {
// 	let opcode = 0x7011;
// 	var x = (opcode & 0x0f00) >> 8;

// 	chip8.v[x] = 17;

// 	chip8.runCycle(opcode);

// 	expect(chip8.v[x]).toEqual(34);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// test('opcode: 0x8000 is correct', () => {
// 	let opcode = 0x8120;

// 	let y = (opcode & 0x00f0) >> 4;
// 	let x = (opcode & 0x0f00) >> 8;

// 	chip8.v[y] = 17;
// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 514 });
// 	expect(chip8.v[x]).toEqual(17);

// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8121);
// 	expect(chip8.v[x]).toEqual(17);
// 	expect(chip8).toMatchObject({ pc: 516 });

// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8122);
// 	expect(chip8.v[x]).toEqual(0);
// 	expect(chip8).toMatchObject({ pc: 518 });

// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8123);
// 	expect(chip8.v[x]).toEqual(17);
// 	expect(chip8).toMatchObject({ pc: 520 });

// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8124);
// 	expect(chip8.v[x]).toEqual(17);
// 	expect(chip8.v[0xf]).toEqual(0);
// 	expect(chip8).toMatchObject({ pc: 522 });

// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8125);
// 	expect(chip8.v[0xf]).toEqual(0);
// 	expect(chip8).toMatchObject({ pc: 524 });

// 	chip8.v[x] = 1;
// 	chip8.runCycle(0x8126);
// 	expect(chip8.v[0xf]).toEqual(1);
// 	expect(chip8.v[x]).toEqual(0);
// 	expect(chip8).toMatchObject({ pc: 526 });

// 	chip8.reset();
// 	chip8.v[x] = 0;
// 	chip8.runCycle(0x8127);
// 	expect(chip8.v[0xf]).toEqual(0);
// 	expect(chip8.v[x]).toEqual(0);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// test('opcode: 0x9000 is correct', () => {
// 	let opcode = 0x9140;

// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// test('opcode: 0xa000 is correct', () => {
// 	let opcode = 0xa140;

// 	chip8.runCycle(opcode);
// 	expect(chip8.i).toEqual(0x0140);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// test('opcode: 0xb000 is correct', () => {
// 	let opcode = 0xb123;

// 	chip8.v[0] = 12;

// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 0x0123 + 12 });
// });

// test('opcode: 0xc000 is correct', () => {
// 	let opcode = 0xc123;
// 	let x = (opcode & 0x0f00) >> 8;

// 	chip8.v[0] = 12;

// 	chip8.runCycle(opcode);
// 	// expect(chip8.v[x]).not.toBe(0);
// 	expect(chip8).toMatchObject({ pc: 514 });
// });

// // ------------------------------------------------------------------------------------------------------------------------------------

// describe('opcode: 0xd000 is correct', () => {
// 	beforeEach(() => {
// 		chip8.i = 0;
// 		for (let i = 0; i < chip8.vram.length; i++) {
// 			for (let j = 0; j < chip8.vram.length; j++) {
// 				chip8.memory[i + j] = 0x80;
// 			}
// 		}

// 		let opcode = 0xd112;
// 		// let x = (opcode & 0x0f00) >> 8;
// 		// let y = (opcode & 0x00f0) >> 4;
// 	});

// 	test('draws a sprite at (vx, vy)', (done) => {
// 		let count = 0;

// 		chip8.checkPixels = function(x, y) {
// 			if (count == 0) {
// 				expect(x).toEqual(5);
// 				expect(y).toEqual(8);

// 				done();
// 				count++;
// 			}
// 		};

// 		chip8.v[1] = 5;
// 		chip8.v[2] = 8;

// 		chip8.runCycle(0xd122);
// 	});

// 	test('draws an N pixel wide sprite', () => {
// 		let ys = [];

// 		chip8.checkPixels = function(x, y) {
// 			ys.push(y);

// 			if (ys.length == 3 * 8) {
// 				let height = ys[ys.length - 1] - ys[0];
// 				expect(height).toEqual(3);
// 				done();
// 			}
// 		};

// 		chip8.v[1] = 5;
// 		chip8.v[2] = 8;

// 		chip8.runCycle(0xd112);
// 	});

// 	test('sets VF to 1 if pixels are flipped', () => {
// 		chip8.checkPixels = function() {
// 			return true;
// 		};

// 		chip8.runCycle(0xd112);
// 	});

// 	test('sets VF to 0 if pixels are not flipped', () => {
// 		chip8.checkPixels = function() {
// 			return false;
// 		};

// 		chip8.runCycle(0xd112);
// 	});

// 	didIncrementPC(0xd122);
// });

// // ------------------------------------------------------------------------------------------------------------------------------------

// describe('opcode: 0xe09e is correct', () => {
// 	test('skip next instruction if key in v[x] is pressed', () => {
// 		chip8.pc = 0;
// 		let opcode = 0xe19e;
// 		chip8.v[1] = 2;
// 		chip8.keyBuffer[chip8.v[1]] = true;

// 		chip8.runCycle(opcode);
// 		expect(chip8.pc).toEqual(4);
// 	});

// 	test("Don't skip next instruction if key isn't pressed", () => {
// 		chip8.pc = 0;
// 		let opcode = 0xe29e;
// 		chip8.v[2] = 2;

// 		chip8.keyBuffer[chip8.v[2]] = false;

// 		chip8.runCycle(opcode);
// 		expect(chip8.pc).toEqual(2);
// 	});
// });

// describe('opcode: 0xe0a1 is correct', () => {
// 	test("skip next instruction if key in v[x] isn't pressed", () => {
// 		chip8.pc = 0;
// 		let opcode = 0xe3a1;
// 		chip8.v[3] = 2;

// 		chip8.keyBuffer[chip8.v[3]] = false;

// 		chip8.runCycle(0xe3a1);
// 		expect(chip8.pc).toEqual(4);
// 	});

// 	test("Don't skip next instruction if key is pressed", () => {
// 		chip8.pc = 0;
// 		let opcode = 0xe4a1;
// 		chip8.v[4] = 2;

// 		chip8.keyBuffer[chip8.v[4]] = true;

// 		chip8.runCycle(opcode);
// 		expect(chip8.pc).toEqual(2);
// 	});
// });

// test('opcode: 0xf000 is correct', () => {
// 	let opcode = 0xf007;
// 	let x = (opcode & 0x0f00) >> 8;
// 	chip8.delayTimer = 12;
// 	chip8.runCycle(opcode);

// 	expect(chip8).toMatchObject({ pc: 514 });
// 	expect(chip8.v[x]).toEqual(12);

// 	chip8.v[x] = 11;
// 	opcode = 0xf015;
// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 516, delayTimer: 11 });

// 	opcode = 0xf018;
// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 518, soundTimer: 11 });

// 	opcode = 0xf01e;
// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 520, i: 11 });

// 	opcode = 0xf029;
// 	chip8.runCycle(opcode);
// 	expect(chip8).toMatchObject({ pc: 522, i: 55 });

// 	opcode = 0xf033;
// 	chip8.v[x] = 101;
// 	chip8.i = 0;
// 	let index = 0;
// 	chip8.runCycle(opcode);
// 	expect(chip8.memory[chip8.i]).toEqual(1);
// 	expect(chip8.memory[chip8.i + 1]).toEqual(0);
// 	expect(chip8.memory[chip8.i + 2]).toEqual(1);
// });
