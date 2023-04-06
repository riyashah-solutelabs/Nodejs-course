const sum = (a,b) => {
    if( a && b ){
        return a+b;
    }
    throw new Error('Invalid arguments')
}
// console.log(sum(1));

try{
    console.log(sum(1));
}catch(error){
    console.log('Error occured!');
    console.log(error)
}

console.log("hello")
