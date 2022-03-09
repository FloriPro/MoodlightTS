function addZero(i: number | string, leng: number) {
    var ii = i.toString();
    while (ii.length<leng){
        ii="0"+ii;
    }
    return ii;
}