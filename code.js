"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let count = 0;
let selectedNodes;

// Read selected text elements (stickies, text, etc.) from your Figjam

function scanMultipleNodes() {
    const textNodes = [];
    selectedNodes = figma.currentPage.selection;
    if (!selectedNodes.length) {
        figma.notify("Please select elements with text in them!");
        figma.closePlugin();
        return;
    }
    selectedNodes.forEach(node => {
        let nodeText = getNodeText(node);
        if (nodeText)
            textNodes.push(nodeText);
    });
    const fieldNotes = textNodes.join("|");
    if (!fieldNotes) {
        figma.notify("Please select elements with text in them!");
        figma.closePlugin();
        return;
    }
    postCall(JSON.stringify(fieldNotes));
    
}

//Call API function

function postCall(postdata) {
    const url = 'http://127.0.0.1:5000/themes';
    const data = { notes: postdata };
    postData(url, data)
        .then(responseData => {
        parseThemes(responseData['themes']);
        return Promise.resolve("done");
    })
        .catch(error => {
            figma.notify("Sorry! An error occured, please try again!");
            figma.closePlugin();
    });
}

//Process API response and split them into array of themes and their quotes
function parseThemes(inputString) {
    try {
        const data = {};
        const lines = inputString.split('\n');
        let currentTheme = '';
        for (let line of lines) {
            if (line.startsWith('Theme: ')) {
                currentTheme = line.substring('Theme: '.length).trim();
                data[currentTheme] = [];
            }
            else if (line.startsWith('- ')) {
                data[currentTheme].push(line.substring('- '.length).trim());
            }
        }
        createThemeFrame(data);
    }
    catch (e) {
        scanMultipleNodes();
    }
}

//Take the theme data and add it to your figjam board

function createThemeFrame(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodes = [];
        const section = figma.createSection();
        section.x = getRightMostX() + 200;
        section.y = figma.currentPage.selection[0].y;
        let font = { family: "Inter", style: "Medium" };
        figma.loadFontAsync(font).then(() => {
            let headingcount = 1;
            let headingX = 10;
            let headingY = 50;
            let maxValueCount = 0;
            for (const key in data) {
                let valuecount = 0;
                let valueX = headingX;
                let heading = figma.createText();
                heading.fontName = font;
                heading.fontSize = 40;
                heading.characters = key;
                heading.x = headingX;
                heading.y = headingY;
                headingX += heading.width + 300;
                section.appendChild(heading);
                data[key].forEach((value) => {
                    let stickynote = figma.createSticky();
                    let valueparts = value.split('|');
                    if (valueparts.length > 0) {
                        stickynote.text.characters = valueparts[0].trim();  
                        //Switch decides the color of the sticky note based on the sentiment of the quote.
                        switch (valueparts[1].trim()) {
                            case "-1":
                                stickynote.fills = [{ type: 'SOLID', color: { r: 0.99, g: 0.55, b: 0.55 } }];
                                break;
                            case "0":
                                stickynote.fills = [{ type: 'SOLID', color: { r: 0.45, g: 0.77, b: 1 } }];
                                break;
                            case "+1":
                                stickynote.fills = [{ type: 'SOLID', color: { r: 0.54, g: 0.9, b: 0.48 } }];
                                break;
                        }
                    }
                    else {
                        stickynote.text.characters = value;
                        stickynote.fills = [{ type: 'SOLID', color: { r: 0.66, g: 0.66, b: 0.66 } }];
                    }
                    stickynote.x = valueX;
                    stickynote.y = headingY + 300 * valuecount + 100;
                    valuecount++;
                    if (valuecount > maxValueCount)
                        maxValueCount = valuecount;
                    section.appendChild(stickynote);
                });
                headingcount++;
            }
            section.resizeWithoutConstraints(headingX, headingY + 350 * maxValueCount + 240);
            section.name = "Common Themes";

            console.log(section);
            figma.currentPage.appendChild(section);
            nodes.push(section);
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            console.log("themes-added");
            figma.notify("Common Themes added to your FigJam Board!");
            figma.closePlugin();
        });
       
    });
}

//This is a function to make sure your themes come next to your notes! 

function getRightMostX() {
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

//Function that makes the actual API call. 

function postData(url, data) {
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

//Function to extract text out of stickies and shapes in figjam

function getNodeText(node) {
    if (node.type === "TEXT") {
        return node.characters;
    }
    else if (node.type === "STICKY" || node.type === "SHAPE_WITH_TEXT") {
        return node.text.characters;
    }
}

scanMultipleNodes();