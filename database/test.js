import { set } from "mongoose"

async function test(){
    console.log('start timer')
    setTimeout(() => {
        console.log('end timer')
    }, 10000);}

console.log('this is befor the function');
test();
console.log('this is after the function');