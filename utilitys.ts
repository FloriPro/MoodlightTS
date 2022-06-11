function addZero(i: number | string, leng: number) {
    var ii = i.toString();
    while (ii.length<leng){
        ii="0"+ii;
    }
    return ii;
}
async function delAll(){
    for(var p of alphabet){
        for (var i = 0; i<100;i++){
            await delay(100)
            send("X"+p+addZero(i,2))
        }
    }
}