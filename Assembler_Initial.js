//https://github.com/craigthomas/Chip8Assembler

var opcode_table = {
		0x00E0 : "CLS", //
		0x00EE : "RTS", //
		0x0000 : "SYS", //0nnn
		0x1000 : "JUMP", // 1nnn
		0x2000 : "CALL", // 2nnn
		0x3000 : "SKE", // 3snn - s, nn
		0x4000 : "SKNE", // 4snn - s, nn
		0x5000 : "SKR", // 5st0 - s, t
		0x6000 : "LOAD", // 6snn - s, nn
		0x7000 : "ADD", // 7snn - s, nn
		0x8000 : "MOVE", // 8st0 - s,t
		0x8001 : "OR", // 8st1 - s, t
		0x8002 : "AND",
		0x8003 : "XOR",
		0x8004 : "ADDR",
		0x8005 : "SUB ",
		0x8006 : "SHR ",
		0x8007 : "SUBN",
		0x800E : "SHL ",
		0x9000 : "SNRNE ",
		0xA000 : "LOADI  ",
		0xB000 : "JUMPI  ",
		0xC000 : "RND ",
		0xD000 : "DRW ",
		0xE09E : "SKPR ",
		0xE0A1 : "SKNP",
		0xF007 : "MOVED  ",
		0xF00A : "KEYD  ",
		0xF015 : "LOADD",
		0xF018 : "LOADS",
		0xF01E : "ADDI",
		0xF029 : "LDSPR",
		0xF033 : "BCD",
		0xF055 : "STOR",
		0xF065 : "READ"
}

// Have a file reader that reads in CODE, either NNN, NN or N, and one or two registers

var code = "CLS";
var NNN;
var NN;
var N;
var reg;
var reg2;

switch (code) {
	case CLS:
		return "00E0";

	case RTS:
		return "00EE";

	case SYS:
		return "" + 0 + NNN;

	case JUMP:
		return "" + 1 + NNN;

	case CALL:
		return "" + 2 + NNN;

	case SKE:
		return "" + 3 + reg + NN;

	case SKNE:
		return "" + 4 + reg + NN;

	case SKR:
		return "" + 5 + reg + reg2 + 0;

	case LOAD:
		return "" + 6 + reg + NN;

	case ADD:
		return "" + 7 + reg + NN;

	case MOVE:
		return "" + 8 + reg + reg2 + 0;

	case OR:
		return "" + 8 + reg + reg2 + 1;

	case AND:
		return "" + 8 + reg + reg2 + 2;

	case XOR:
		return "" + 8 + reg + reg2 + 3;

	case ADDR:
		return "" + 8 + reg + reg2 + 4;

	case SUB:
		return "" + 8 + reg + reg2 + 5;

	case SHR:
		return "" + 8 + reg + 0 + 6;

	case SHL:
		return "" + 8 + reg + 0 + "E";

	case SKNE:
		return "" + 9 + reg + reg2 + 0;

	case LOADI:
		return "A" + "" + NNN;

	case JUMPI:
		return "B" + "" + NNN;

	case RND:
		return "C" + "" + reg + NN;

	case DRW:
		return "D" + "" + reg + reg2 + N;

	case SKPR:
		return "E" + "" + reg + 9 + "E";

	case SKNP:
		return "E" + "" + reg + "A" + 1;

	case MOVED:
		return "F" + "" + reg + 0 + 7;

	case KEYD:
		return "F" + "" + reg + 0 + "A";

	case LOADD:
		return "F" + "" + reg + 1 + 5;

	case LOADS:
		return "F" + "" + reg + 1 + 8;

	case ADDI:
		return "F" + "" + reg + 1 + "E";

	case LDSPR:
		return "F" + "" + reg + 2 + 9;

	case BCD:
		return "F" + "" + reg + 3 + 3;

	case STOR:
		return "F" + "" + reg + 5 + 5;

	case READ:
		return "F" + "" + reg + 6 + 5;
}
