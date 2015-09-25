
//MINIMUM

function min(n: number, m: number): number {
	return n<m? n:m 
}

//RECURSION

function isEven(n: number): boolean {
	n = Math.abs(n);
	
	if (n==0) {
		return true;
	} else if (n==1) {
		return false 
	} else {
		return isEven(n-2);
	}
}

//BEAN COUNTING 

function countChar(string: string,char: string): number {
	var a = string.split('');
	var cnt: number = 0;
	while(a.indexOf(char)>-1){
		cnt ++;
		a.splice(a.indexOf(char),1);
	}
	
	return cnt;
}