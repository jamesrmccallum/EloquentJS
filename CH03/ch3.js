//MINIMUM
function min(n, m) {
    return n < m ? n : m;
}
//RECURSION
function isEven(n) {
    n = Math.abs(n);
    if (n == 0) {
        return true;
    }
    else if (n == 1) {
        return false;
    }
    else {
        return isEven(n - 2);
    }
}
//BEAN COUNTING 
function countChar(string, char) {
    let a = string.split('');
    let cnt = 0;
    while (a.indexOf(char) > -1) {
        cnt++;
        a.splice(a.indexOf(char), 1);
    }
    return cnt;
}
