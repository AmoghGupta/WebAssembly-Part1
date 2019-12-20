
/** creating a custom wasm memory for us */
// initialize wasm with custom memory (array buffer)
// 2*64=128KB (1 page of webassembly memory is 64kb)
const wasmMemory = new WebAssembly.Memory({
    initial: 2 //2 pages
});

// like any other lower level programming languge 
// javascript also has support for binary data operations
const readMemoryString = function(offset,length){
    /** here we are using the default memory of the wasm */
    /** basically here we are relying on the wasm memory, incase the wasm object is not set 
     * when we call this or use this wasm object then this fails, so its not a good practice
     * to go ahead with this approach instead we create our own custom memory/
    // const strbuffer = new Uint8Array(wasm.instance.exports.memory.buffer, offset, length);
    
    /** instead we try to use our own custom memory which we created */
    const strbuffer = new Uint8Array(wasmMemory.buffer, offset, length);
    const str = new TextDecoder().decode(strbuffer);
    // console.log(str);

    window.dispatchEvent(new CustomEvent('wasmvalue', {detail:str}));
}

//listen for the event
window.addEventListener('wasmvalue', (data)=>{
     console.log('Received a new string: '+ data.detail);
});

//Imports Object
// Imports bring functionality into the web assembly i.e calling JS in C
// importing consoleLog and stringLog functions of JS in WASM/C
const imports = {
    env:{
        consoleLog: console.log,
        stringLog: readMemoryString,
        memory: wasmMemory
    }
};
//Load WSM
WebAssembly.instantiateStreaming( fetch('/main.wasm'), imports).then((wasm)=>{
    console.log('Wasm Ready');
    console.log('WASM exports instance memory size: '+wasm.instance.exports.memory.buffer.byteLength)
    // assigning wasm object to window object to make it accessible
    window.wasm = wasm;

    // exports BRING functionality out of web assembly i.e CALLING C FUNCTIONS FROM JAVASCRIPT
    console.log("Listing all the exports in WASM");
    console.log(WebAssembly.Module.exports(wasm.module));

    /** CALLING C FUNCTIONS FROM JAVASCRIPT **/
    // wasm has instance and module, use instance and then exports to run your function
    console.log("Calling functions in WASM and logging output from javascript");
    console.log(window.wasm.instance.exports.main());
    console.log(window.wasm.instance.exports.getNumber());
    
    

    console.log("Listing all the imports in WASM");
    console.log(WebAssembly.Module.imports(wasm.module));

    // calling console.log from C (from inside the compiled wasm)
    console.log("invoking WASM functions and then Calling JS functions from inside WASM");
    window.wasm.instance.exports.getDoubleNumber(22);
    window.wasm.instance.exports.greet();
});