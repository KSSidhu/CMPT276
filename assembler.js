/////////////////////Declaring textfile input variables///////////////////
var values;
//Mneumonic code
var mneumonic;
//12-bit literal address
var NNN;
//8-bit byte literals
var NN;

//4-bit nibble literals
var N;
//registers (0-F)
var r1;
//registers (0-F)
var r2;
//////////////////////////////////////////////////////////////////////////

//Reading the file 
function readFile(evt) {
    
    // Create FileList object
    var files = evt.target.files; 
    file = files[0];

    var reader = new FileReader();
    
    reader.onload = function(){

        var text = reader.result;
        //Split file into sentences
        var lines = text.split('\r\n');
        
        //Split setences into words
        for (var i = 0; i < lines.length; i++){
            if (lines[i].trim().length == 0) {
                continue;
            } else {
                values = lines[i].split(' ');
            }
            //Let first word be mnemonic string
            mneumonic = values[0];
            //Call function to output the corresponding text
            processText();
            
        }
    };
    reader.readAsText(file);
}

//Function to process and output corresponding hex and binary code
//Referenced as cited below
function processText() {
    
    var file = null,
        makeTextFile = function(text) {
            var data = new Blob([text], {
                type: 'text/plain'
            });

            if (file !== null) {
                window.URL.revokeObjectURL(file);
            }

            file = window.URL.createObjectURL(data);

            return file;
        };

    
    var create = document.getElementById('download');
    var create1 = document.getElementById('downloadb');

    //Store values for the testing for each operand
    var test1;
    var test2;
    var test3;

    var hexcode;
    var binary;

    //Switch cases for all possible types  
    switch (mneumonic){
        //clear video memory
        case "CLS":
            //Define textbox outputs: both for hex and binary
            hexcode = "00E0";
            textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
            //Convert hex to binary by calling function
            binary = hex2bin(hexcode);
            textbox2 = document.getElementById("textbox2").value += binary + "\n";
            break;

        //return from subroute
        case "RTS" :
            hexcode = "00EE";
            textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
            binary = hex2bin(hexcode);
            textbox2 = document.getElementById("textbox2").value += binary + "\n";
            break;

        //System call
        case "SYS":
            
            //Calling test for the operand (check if it's NNN)
            test = NNN_test(1);
            //Assign operands based if test is passed
            if(test === 1) {
                
                NNN = values[1]; 
                hexcode = "0" + NNN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            
        //Jump to address
        case "JUMP":
            
            test = NNN_test(1);
            //Assign operands based if test is passed
            if (test === 1){
                NNN = values[1];
                hexcode = "1" + NNN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            
        //call routine at address
        case "CALL":

            test = NNN_test(1);
            if (test === 1) {

                NNN = values[1];
                hexcode = "2" + NNN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //skip next instruction if r1 = NN
        case "SKE":

            //Testing each operand by calling functions based on type of operand
            test = NandRegister_test(1);
            test2 = NN_test(2);

            if (test && test2 === 1) {
                r1 = values[1];
                NN = values[2];
                hexcode = "3" + r1 + NN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;

        //Don't skip next instruction if register r1 = NN
        case "SKNE":

            test = NandRegister_test(1);
            test2 = NN_test(2);

            if (test && test2 === 1) {
                r1 = values[1];
                NN = values[2];
                hexcode = "4" + r1 + NN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }

            break;


        //Skip if r1 == r2
        case "SKRE":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];

                hexcode = "5" + r1 + r2 + "0";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;

            
        //Load r1 with NN
        case "LOAD":

            test = NandRegister_test(1);
            test2 = NN_test(2);

            if (test && test2 === 1) {
                r1 = values[1];
                NN = values[2];
                hexcode = "6" + r1 + NN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //Add NN to r1
        case "ADD":

            test = NandRegister_test(1);
            test2 = NN_test(2);
            //Assign operands based on position of operands on text file
            if (test && test2 === 1) {
                r1 = values[1];
                NN = values[2];
                hexcode = "7" + r1 + NN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //Move value from r1 to r2
        case "MOVE":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if(test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "0";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //logical OR on r1 and r2 and store in r2
        case "OR":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "1";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //logical AND
        case "AND":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "2";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //logical XOR
        case "XOR":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "3";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 


        //Add r1 to r2 and store in r1
        case "ADDR":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "4";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //Subtract r1 from r2 and store in r1
        case "SUB":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "8" + r1 + r2 + "5";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //shift bits in r1 1 bit to the right
        case "SHR":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "8" + r1 + r2 + "5";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }

            break; 

        //shift bits in r1 1 bit to the left
        case "SHL":

             test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "8" + r1 + 0 + "E";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //Skip next instruction if r1 != r2
        case "SKRNE":
            test = NandRegister_test(1);
            test2 = NandRegister_test(2);

            if (test && test2) {
                r1 = values[1];
                r2 = values[2];
                hexcode = "9" + r1 + r2 + 0; 
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 


        //Load index with NNN
        case "LOADI":

            test = NNN_test(1);

            if (test === 1) {
                
                NNN = values[1];
                hexcode = "A" + NNN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;        

        //Jump to NNN +index
        case "JUMPI":

            test = NNN_test(1);

            if (test === 1) {
                
                NNN = values[1];
                hexcode = "B" + NNN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break; 
            

        //Generate random number between 0 and NN and store in r1
        case "RND":

            test = NandRegister_test(1);
            test2 = NN_test(2);
            //Assign operands based on position of operands on text file
            if (test && test2 === 1) {
                r1 = values[1];
                NN = values[2];
                hexcode = "C" + r1 + NN;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //Draw N byte spirit at x r1, y r2
        case "DRW":

            test = NandRegister_test(1);
            test2 = NandRegister_test(2);
            test3 = NandRegister_test(3);

            if (test && test2 && test3 === 1) {
                r1 = values[1];
                r2 = values[2];
                N = values[3];
                hexcode = "D" + r1 + r2 + N;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;

            }else{
                break;
            }

            break;
            
        //Skip next instruction if key in r1 is pressed
        case "SKPR":
            test = NandRegister_test(1);
            //Assign operands based on position of operands on text file
            if (test) {
                r1 = values[1];
                hexcode = "E" + r1 + 9 + "E";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //Skip next instruction if key in r1 is not pressed
        case "SKNP":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "E" + r1 + "A" + 1;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            
        //Move delay timer value to r1
        case "MOVED":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 0 + 7;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            
        //Wait for keypress and store in r1
        case "KEYD":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 0 + "A";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            
        //Load delay timer with value in r1
        case "LOADD":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 1 + 5;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //Load sound timer with value in r1
        case "LOADS":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 1 + 8;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;

        //Add value in r1 to index
        case "ADDI":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 1 + "E";
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }

            break;

        //Load index with sprite from r1
        case "LDSPR":

            test = NandRegister_test(1);
            
            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 2 + 9;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;

        //Store binary coded decimal of r1 at index
        case "BCD":

            test = NandRegister_test(1);
           
            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 3 + 3; 
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;
            

        //Store value of r1 registers at index
        case "STOR":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 5 + 5;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;
            }else{
                break;
            }
            break;

        //Read back the stored value at index into registers
        case "READ":

            test = NandRegister_test(1);

            if (test) {
                r1 = values[1];
                hexcode = "F" + r1 + 6 + 5;
                textbox = document.getElementById("textbox").value += "0x" + hexcode + "\n";
                binary = hex2bin(hexcode);
                textbox2 = document.getElementById("textbox2").value += binary + "\n";
                break;

            }else{
                break;
            }
            break;
            
    }
    

    //Referenced as cited 
    //Referring to addeventlistener for "textbox" for hex
    create.addEventListener('click', function() {
        var downloadLink = document.getElementById('download');
        downloadLink.href = makeTextFile(textbox);
    }, false);


    //Referring to addeventlistener for "textbox2" for binary
    create1.addEventListener('click', function() {
        var downloadLink = document.getElementById('downloadb');
        downloadLink.href = makeTextFile(textbox2);
    }, false);

};

//Function to get length of a given operand
function getlength(number) {
    return number.toString().length;
}

//Function to test NNN operands (if they have hex values [0-F], number of digits (3))
function NNN_test(index) {
    var string = values[index];
    //If operand is 3 digits, and are all hex values, it's an acceptable operand
    if (getlength(+string) === 3){
        if(test_hex(string[0]) && test_hex(string[1]) && test_hex(string[2]) ){
            return 1;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}

//Function to test NN operand (if they have hex values [0-F], number of digits (2))
function NN_test(index) {
    var string = values[index];
    //If operand is 2 digits, and are all hex values, it's an acceptable operand
    if (getlength(+string) === 2){
        if(test_hex(string[0]) && test_hex(string[1]) ){
            return 1;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}

//Function to test register AND N (if all are hex values [0-F], number of digits (1))
function NandRegister_test(index) {
    var string = values[index];
    //If operand is 1 digit, and are all hex values, it's an acceptable operand
    if (getlength(string) === 1){
        if(test_hex(string[0]) ){
            return 1;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}

//Function to test if the digit is hex, based on requirements
var requirements = /^[0-9a-fA-F]+$/;
function test_hex(number) {
    return requirements.test(number);
} 

//Turn hex codes into binary codes
function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(16, '0');
}

//Reset function for hex values (textbox)
function resetFunction() {
    var link = document.getElementById('download');
    document.getElementById('download').style.display = 'block';
}

//Reset function for binary values (textbox2)
function resetFunction2() {
    var link = document.getElementById('downloadb');
    document.getElementById('downloadb').style.display = 'block';
}


document.getElementById("files").addEventListener('change', readFile, false);
document.getElementById("textbox").onchange = function() {resetFunction()}
document.getElementById("textbox2").onchange = function() {resetFunction2()}


// REFERENCES: 

//     https://stackoverflow.com/questions/52792178/i-want-to-save-textbox-to-txt-file-in-html-using-javascript-but-i-have-an-error?fbclid=IwAR3imyhtf-nizrShgFY1RA1H7CQyIk7_ZgAb2P1kLIjIQePSTCFvUdnj-J0
    
//     https://github.com/Sachini/GPSVisualizer/blob/master/index.html?fbclid=IwAR1EOoSK3ie3SNjfpvuBEMLD0xWB4TZ1sLu2yxJySTFWppgnA4fYUBU74Ec

//     https://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html

//     https://stackoverflow.com/questions/41930538/how-to-get-input-values-from-html-to-text-file

//     https://www.html5rocks.com/en/tutorials/file/dndfiles/

//     https://github.com/craigthomas/Chip8Assembler
