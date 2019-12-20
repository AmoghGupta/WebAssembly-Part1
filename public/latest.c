#include<stdio.h>
#include<string.h>

/** importing consoleLog and stringLog methods from javascript **/
void consoleLog(int n);
void stringLog(char* offset,int length);
/** ----import end---- **/


int main() { 
  return 42;
}

int getNumber(){
  return 23;
}

void greet(){
  char* str =  "Hello from C!";
  stringLog(str, strlen(str));
}

void getDoubleNumber(int x){
    consoleLog(x*2);
}