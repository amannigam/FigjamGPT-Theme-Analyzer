"use strict";

interface PostMessage {
  type: any;
  value: any;
}

let count = 0;
interface ThemeData {
  [key: string]: string[];
}
let selectedNodes;

  


function scanMultipleNodes(){

const textNodes: string[] = [];
selectedNodes = figma.currentPage.selection;
if(!selectedNodes.length)
  {
    figma.ui.postMessage(0);
    return;
  }

selectedNodes.forEach(node=>{
        let nodeText=getNodeText(node);
        if(nodeText)
        textNodes.push(nodeText);
})
console.log(textNodes);
const fieldNotes=textNodes.join("|");

if(!fieldNotes){
  figma.ui.postMessage(1);
    return;
}
postCall(JSON.stringify(fieldNotes));
}

function postCall(postdata: string){
const url = 'http://127.0.0.1:5000/getthemes';
const data = { notes: postdata };


postData(url, data)
.then(responseData => {
    parseThemes(responseData['themes']);
    console.log("returned");// Do something with the response data
})
.catch(error => {
    // Handle the error
});

}

function parseThemes(inputString: string){

try{
const data: ThemeData = {};
const lines: string[] = inputString.split('\n');
let currentTheme: string = '';

for (let line of lines) {
  if (line.startsWith('Theme: ')) {
    currentTheme = line.substring('Theme: '.length).trim();
    data[currentTheme] = [];
  } else if (line.startsWith('- ')) {
    data[currentTheme].push(line.substring('- '.length).trim());
  }
}
createThemeFrame(data);
}catch(e){
scanMultipleNodes();
}
}

async function createThemeFrame(data: ThemeData){

const nodes: SceneNode[]=[];
const section =figma.createSection();


section.x=getRightMostX()+200;

section.y=figma.currentPage.selection[0].y;

  let font = {family: "Inter", style: "Medium"};
    figma.loadFontAsync(font).then(() => {

      let headingcount=1;
      let headingX=10;
      let headingY=50;
      let maxValueCount=0;
      for (const key in data) {
    
              let valuecount=0;
              let valueX=headingX;
              let heading = figma.createText();
              heading.fontName = font;
              heading.fontSize=40;
              heading.characters=key;
              heading.x=headingX;
              heading.y=headingY;

              headingX+=heading.width+300;
              section.appendChild(heading);
              
              data[key].forEach((value: any) => 
              {
                let stickynote=figma.createSticky();
                let valueparts=value.split('|');
                if(valueparts.length>0){
                  stickynote.text.characters=valueparts[0].trim();

                  switch(valueparts[1].trim()){
                    case "-1": stickynote.fills=[{ type: 'SOLID', color: { r: 0.99, g: 0.55, b: 0.55 } }];
                    break;
                    case "0": stickynote.fills=[{ type: 'SOLID', color: { r: 0.45, g: 0.77, b: 1 } }];
                    break;
                    case "+1": stickynote.fills=[{ type: 'SOLID', color: { r: 0.54, g: 0.9, b: 0.48 } }];
                    break;
                  }
                }
                else{
                  stickynote.text.characters=value;
                  stickynote.fills=[{ type: 'SOLID', color: { r: 0.66, g: 0.66, b: 0.66 } }];
                }
                
                
                
                
                stickynote.x=valueX;
                stickynote.y=headingY+300*valuecount+100;
                valuecount++;
                if(valuecount>maxValueCount)
                  maxValueCount=valuecount;
                section.appendChild(stickynote);
              }
              );
              headingcount++;
          }

          section.resizeWithoutConstraints(headingX,headingY+350*maxValueCount+240);
          section.name="Common Themes";

    });



console.log(section);

figma.currentPage.appendChild(section);
nodes.push(section);
figma.currentPage.selection=nodes;
figma.viewport.scrollAndZoomIntoView(nodes);
figma.ui.postMessage("themes-yes")
}

function getRightMostX(){
const selections = figma.currentPage.selection;
let rightmostX = -Infinity;
for (const node of selections) {
  const rightX = node.x + node.width;
  if (rightX > rightmostX) {
    rightmostX = rightX;
  }
}
return rightmostX;
}


function postData(url: string, data: { notes: any; }) {

return fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  return data;
})
.catch((error) => {
  console.error('Error:', error);
  throw error;
});
}


function getNodeText(node: SceneNode){
if (node.type === "TEXT") {
    return node.characters;
  } else if (node.type === "STICKY" || node.type === "SHAPE_WITH_TEXT") {
       return node.text.characters;
    
}
}


scanMultipleNodes();


