//Declaring textfile input variables

//Stores a line of textfile 
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

var index;
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
//Function to process and output corresponding hex code
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

    //Switch cases for all possible types    
    var create = document.getElementById('download');
    //Variables to test each input operand
    var test1;
    var test2;
    var test3;

    switch (mneumonic){
        //clear video memory
        case "CLS":
            //Define textbox output text 
            textbox = document.getElementById("textbox").value += "0x00E0" + "\n";
            break;

        //return from subroute
        case "RTS" :
            textbox = document.getElementById("textbox").value += "0x00EE" + "\n";
            break;

        //System call
        case "SYS":
            
            test = firstOperand(1);
            //Assign operands based on position of operands on text file
            if(test === 1) {
                
                NNN = values[1]; 
                //alert(NNN);
                textbox = document.getElementById("textbox").value += "0x0" + NNN + "\n";
                break;
            }else{
                break;
            }

            break;
            
        //Jump to address
        case "JUMP":
            test = firstOperand(1);
            if(test === 1){
                NNN = values[1];
                textbox = document.getElementById("textbox").value += "0x1" + NNN + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //call routine at address
        case "CALL":

            test = firstOperand(1);
            //Assign operands based on position of operands on text file
            if(test === 1) {
                NNN = values[1];
                textbox = document.getElementById("textbox").value += "0x2" + NNN + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //skip next instruction if r1 = NN
        case "SKE":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                NN = values[2];

                textbox = document.getElementById("textbox").value += "0x3" + r1 + NN + "\n";
                break;
            }else{
                break;
            }

            break;

        //Don't skip next instruction if register r1 = NN
        case "SKNE":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                NN = values[2];

                textbox = document.getElementById("textbox").value += "0x4" + r1 + NN + "\n";
                break;
            }else{
                break;
            }

            break;


        //Skip if r1 == r2
        case "SKR":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x5" + r1 + r2 + "0" + "\n";
                break;
            }else{
                break;
            }

            break;

            
        //Load r1 with NN
        case "LOAD":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                NN = values[2];

                textbox = document.getElementById("textbox").value += "0x6" + r1 + NN + "\n";
                break;
            }else{
                break;
            }

            break; 
            
        //Add NN to r1
        case "ADD":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                NN = values[2];

                textbox = document.getElementById("textbox").value += "0x7" + r1 + NN + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //Move value from r1 to r2
        case "MOVE":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 0 + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //logical OR on r1 and r2 and store in r2
        case "OR":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 1 + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //logical AND
        case "AND":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 2 + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //logical XOR
        case "XOR":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 3 + "\n";
                break;
            }else{
                break;
            }

            break; 


        //Add r1 to r2 and store in r1
        case "ADDR":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 4 + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //Subtract r1 from r2 and store in r1
        case "SUB":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 5 + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //shift bits in r1 1 bit to the right
        case "SHR":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + r2 + 5 + "\n";
                break;
            }else{
                break;
            }

            break; 

        //shift bits in r1 1 bit to the left
        case "SHL":

             test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0x8" + r1 + 0 + "E" + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //Skip next instruction if r1 != r2
        case "SKNE":

            test = register(1);
            test2 = register(2);
            //Assign operands based on position of operands on text file
            if(test && test2) {
                r1 = values[1];
                r2 = values[2];

                textbox = document.getElementById("textbox").value += "0x9" + r1 + r2 + 0  + "\n";
                break;
            }else{
                break;
            }

            break; 

        //Load index with NNN
        case "LOADI":

            test = firstOperand(1);
            //Assign operands based on position of operands on text file
            if(test === 1) {
                
                NNN = values[1];

                textbox = document.getElementById("textbox").value += "0xA" + NNN + "\n";
                break;
            }else{
                break;
            }

            break;        

        //Jump to NNN +index
        case "JUMPI":

            test = firstOperand(1);
            //Assign operands based on position of operands on text file
            if(test === 1) {
                
                NNN = values[1];

                textbox = document.getElementById("textbox").value += "0xB" + NNN + "\n";
                break;
            }else{
                break;
            }

            break; 
            

        //Generate random number between 0 and NN and store in r1
        case "RND":

            test = register(1);
            test2 = firstOperand(2);
            //Assign operands based on position of operands on text file
            if(test && test2 === 1) {
                r1 = values[1];
                NN = values[2];

                textbox = document.getElementById("textbox").value += "0xC" + r1 + NN + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //Draw N byte spirit at x r1, y r2
        case "DRW":

            test = register(1);
            test2 = register(2);
            test3 = firstOperand(3);
            //Assign operands based on position of operands on text file
            if(test && test2 && test3 === 1) {
                r1 = values[1];
                r2 = values[2];
                N = values[3];

                textbox = document.getElementById("textbox").value += "0xD" + r1 + r2 + N + "\n";
                break;

            }else{
                break;
            }

            break;
            
        //Skip next instruction if key in r1 is pressed
        case "SKPR":
            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xE" + r1 + 9 + "E" + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //Skip next instruction if key in r1 is not pressed
        case "SKNP":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xE" + r1 + "A" + 1 + "\n";
                break;
            }else{
                break;
            }

            break;
            
        //Move delay timer value to r1
        case "MOVED":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 0 + 7 + "\n";
                break;
            }else{
                break;
            }

            break;
            
        //Wait for keypress and store in r1
        case "KEYD":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 0 + "A" + "\n";
                break;
            }else{
                break;
            }

            break;
            
        //Load delay timer with value in r1
        case "LOADD":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 1 + 5 + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //Load sound timer with value in r1
        case "LOADS":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 1 + 8 + "\n";
                break;
            }else{
                break;
            }

            break;

        //Add value in r1 to index
        case "ADDI":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 1 + "E" + "\n";
                break;
            }else{
                break;
            }

            break;

        //Load index with sprite from r1
        case "LDSPR":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 2 + 9 + "\n";
                break;
            }else{
                break;
            }

            break;

        //Store binary coded decimal of r1 at index
        case "BCD":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 3 + 3 + "\n";
                break;
            }else{
                break;
            }

            break;
            

        //Store value of r1 registers at index
        case "STOR":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 5 + 5 + "\n";
                break;
            }else{
                break;
            }

            break;

        //Read back the stored value at index into registers
        case "READ":

            test = register(1);
            //Assign operands based on position of operands on text file
            if(test) {
                r1 = values[1];

                textbox = document.getElementById("textbox").value += "0xF" + r1 + 6 + 5 + "\n";
                break;

            }else{
                break;
            }

            break;
            
    }
    //Put next hex code in a new line
    //textbox = document.getElementById("textbox").value += '\n';

    //Referenced as cited 
    create.addEventListener('click', function() {
        var downloadLink = document.getElementById('download');
        
        //Call makeTextFile function to create a file with textfile
        downloadLink.href = makeTextFile(textbox);
        //document.getElementById('create').style.display = 'none';
    }, false);
};


function firstOperand(index) {
    if(values[index] === 'undefined') {
        return 0;
    }else if(values[index] === '') {
        return 0;
    }else if (values[index] < 0){
        return 0;
    }else if(!Number.isInteger(+values[index])){
         return 0;
    } else{
        return 1;
    }
}

//Specify the specific values registers should take
var requirements = /^[0-9a-fA-F]+$/;
function register(index) {
    return requirements.test(values[index]);
} 

function resetFunction() {
    var link = document.getElementById('download');
    document.getElementById('download').style.display = 'block';
}


 document.getElementById("files").addEventListener('change', readFile, false)
 //When textbox changes, call resetFunction
 document.getElementById("textbox").onchange = function() {resetFunction()}
