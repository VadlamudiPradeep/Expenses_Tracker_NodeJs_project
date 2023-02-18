let num1Element = document.getElementById('numb1') as HTMLInputElement ;
let num2Element = document.getElementById('numb2') as HTMLInputElement;
let buttonElement = document.querySelector('button')!

let numResults:Array<number> = [];
let textResult:string[] = [] ;

type NumOrString = number | string ;
type Result = {val:number; timestamp:Date}

interface ResultObj {
  val :number ,
  timestamp:Date;
}
function add (num1:NumOrString | string ,num2:NumOrString){
  if(typeof num1 ==='number' && typeof num2 ==='number'){ 
  return num1 + num2;
  }else if(typeof num1 === 'string' && typeof num2 === 'string' ){
    return num1 +''+num2;
  }
    return +num1 + +num2;
  
}
function printResult(resultObj: Result){
  console.log(resultObj.val);
}

  buttonElement.addEventListener('click',()=>{
    const num1  = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result as number);

    const stringResults = add(num1 ,num2);
    textResult.push(stringResults as string)

    printResult({val:result as number,timestamp:new Date()})
   console.log(numResults, textResult)
  });

const myPromise = new Promise((resolve reject)=>{
setTimeout(()=>{
  resolve('it worked')
},1000)
});

myPromise.then((result)=>{
  console.log(result);
})