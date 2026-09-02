// Math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// Converted using parseInt and parseFloat
const choice = parseInt("1");
const num1 = parseFloat("10");
const num2 = parseFloat("5");

let operation = "";
let result = 0;

// Determine operation using switch-case
switch (choice) {
  case 1:
    operation = "Penjumlahan";
    result = add(num1, num2);
    break;
  case 2:
    operation = "Pengurangan";
    result = subtract(num1, num2);
    break;
  case 3:
    operation = "Perkalian";
    result = multiply(num1, num2);
    break;
  case 4:
    operation = "Pembagian";
    result = divide(num1, num2);
    break;
  default:
    console.log("Pilihan tidak valid");
}

// Print the output
console.log(`Operasi: ${operation}`);
console.log(`Angka 1: ${num1}`);
console.log(`Angka 2: ${num2}`);
console.log(`Hasil: ${result}`);