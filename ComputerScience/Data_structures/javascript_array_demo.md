from https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc

node --allow-natives-syntax

const arr1=[];
for (let i=0; i<100; i++) {
    arr1.push(1);
}

%DebugPrint(arr1);

 - elements: 0x00f95f8030f1 <FixedArray[140]> [PACKED_SMI_ELEMENTS]

arr1[1_000_000]=1;

%DebugPrint(arr1);

 - elements: 0x014da9e313e1 <NumberDictionary[772]> [DICTIONARY_ELEMENTS]

arr1.push(1)

%DebugPrint(arr1);

 - elements: 0x00f95f8013e1 <NumberDictionary[772]> [DICTIONARY_ELEMENTS]

for (let i=1; i<1_000_000; i++) {
    arr1[i]=1;
}

%DebugPrint(arr1);

 - elements: 0x007168601149 <FixedArray[1000002]> [HOLEY_SMI_ELEMENTS]



