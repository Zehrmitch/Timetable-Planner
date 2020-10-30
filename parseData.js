'use strict';

const fs = require('fs');
const process = require('process');

let rawdata = fs.readFileSync('data.json');
var text = JSON.parse(rawdata);
let subjectDescriptions = [];
let subjectCodes = [];
let uniques = [];
let courseCodes = [];
let timeTableEntries = [];

function getCourseCodes(subjectCode){
    for (var index = 0; index < text.length; ++index){
        if(text[index].subject == subjectCode){
            courseCodes.push(String(text[index].catalog_nbr));
        } 
    }
    if (courseCodes.length == 0 ){
        console.log('Error - No matches found');
    }
}

function getSubjectCodes() {
    for (var index = 0; index < text.length; ++index){
        subjectCodes[index] = text[index].subject;
    }
    uniques = subjectCodes.filter(onlyUnique);  
}

function getSubjectDescriptions() {
    for (var index = 0; index < text.length; ++index){
        subjectDescriptions[index] = text[index].className;
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getTimeTableEntry(SC, CC){
    for (var index = 0; index < text.length; ++index){
        if (SC == text[index].subject && CC == text[index].catalog_nbr){
            timeTableEntries.push(text[index]);
        }
    }
    if (timeTableEntries.length == 0 ){
        console.log('Error - No match found');
    }
}

// getSubjectCodes();
// getCourseCodes("LS");
// getSubjectDescriptions();

getTimeTableEntry("ACTURSCI" , "1021B" );
console.log(timeTableEntries);