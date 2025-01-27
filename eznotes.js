let noteTitle, noteBody, noteList, currNoteID, initialDisplayCheck, insertTitle, titleBox, initialTitle, initialMessage, initialSave, initialDelete, initialColor, 
redColor, blueColor, greenColor, greyColor, infoBox, locID;

initialDisplayCheck = false;

noteList = [];

let noteID = 0;

function newNote() { // Creates a new note when you press the "New Note" button

    // Stuff for adding the new title div.

    insertTitle = document.createElement("div"); 
    titleBox = document.getElementById("titleBox");

    insertTitle.innerHTML = "Untitled Note " + noteID;
    insertTitle.className = "title";
    insertTitle.id = "note" + noteID;

    titleBox.appendChild(insertTitle);

    noteList.push([noteID, new Note(noteID)]) // Pushes new note object along with its permanent ID so I can keep track of it in the array

    // Line below sets an onclick attribute on each title div that allows you to access the correct object in noteList using its permanent ID

    insertTitle.setAttribute("onclick", "noteList[searchNoteList(" + noteID + ")][1].showNote()");

    if (!initialDisplayCheck) { // If display isn't present, generate the elements on the right side
        initialDisplay();
    }

    noteList[searchNoteList(noteID)][1].showNote(); // Show the new note generated on right side
    
    noteID += 1; // New ID every time we generate a note
}

function initialDisplay() { // Generates the info display on the right side for the first time

    // These elements will be reused to simply display the info from notes rather than having to regenerate the elements each time you want to see a note's info

    initialDisplayCheck = true;
    initialTitle = document.createElement("input");
    initialMessage = document.createElement("textarea");
    initialSave = document.createElement("button");
    initialDelete = document.createElement("button");
    initialColor = document.createElement("select");
    redColor = document.createElement("option");
    blueColor = document.createElement("option");
    greenColor = document.createElement("option");
    greyColor = document.createElement("option");

    infoBox = document.getElementById("infoBox");

    initialTitle.className = "title-input";
    initialMessage.className = "message-input";
    initialSave.className = "save-button";
    initialSave.innerHTML = "Save";
    initialDelete.className = "delete-button";
    initialDelete.innerHTML = "Delete";
    initialColor.className = "color-selector";
    initialColor.id = "colorSelector";

    redColor.innerHTML = "Red";
    redColor.value = "rgb(162, 134, 134)";
    blueColor.innerHTML = "Blue";
    blueColor.value = "rgb(134, 136, 162)";
    greenColor.innerHTML = "Green";
    greenColor.value = "rgb(134, 162, 145)";
    greyColor.innerHTML = "Grey";
    greyColor.value = "rgba(211, 211, 211, 0.664)";


    infoBox.appendChild(initialTitle);
    infoBox.appendChild(initialMessage);
    infoBox.appendChild(initialSave);
    infoBox.appendChild(initialDelete);
    infoBox.appendChild(initialColor);

    initialColor.appendChild(greyColor);
    initialColor.appendChild(redColor);
    initialColor.appendChild(blueColor);
    initialColor.appendChild(greenColor);
}

function searchNoteList(id) { // Find note object using its permanent ID
    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i][0] == id) { // When it finds index of permanent ID, return the index so it can be searched
            return i;
        }
    }
}

function download() { // Generates a JSON file containing your saved notes

    if (noteList.length > 0) { // Makes sure you're not saving an empty note set
        let downloadList = [];

        for (let i = 0; i < noteList.length; i++) { // Deconstructs each note object and pushes it into downloadList array
            let obj = noteList[i][1];
            downloadList.push([obj.noteTitle, obj.noteBody, obj.noteColor, obj.noteColorIndex])
        }

        downloadList.push("ezCheck"); // Pushes a check to mark it as a valid save file

        let jsonDL = JSON.stringify(downloadList);
        let blob = new Blob([jsonDL], { type: "application/json" }); // Makes a blob containing the downloadList array

        let date = new Date();

        let saveName = "eznotes-" + date.getDate()+ "-" + date.getMonth() + "-" + date.getFullYear(); 

        downloadFile(blob, saveName + ".JSON");
    } else {
        alert("Error: Note set cannot be empty.");
    }

    
}

function downloadFile(blob, filename) { // Creates download onclick event for button
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

function uploadBtn() { // Allows upload button to pick a save file
    document.getElementById("selectFiles").click();
}

function upload() { // Parses uploaded save file

    let files = document.getElementById("selectFiles").files[0];
    let reader = new FileReader();

    reader.onload = function() { 

        try { // Makes sure save file can be parsed
            let fileContent = JSON.parse(reader.result);

            if (fileContent[fileContent.length - 1] == "ezCheck") { // Makes sure save file is valid JSON
                for (let i = 0; i < noteList.length; i++) {
                    document.getElementById("note" + noteList[i][1].noteID).remove(); // Removes previous titles
                }

                noteList = [];
                noteID = 0;

                for (let i = 0; i < fileContent.length - 1; i++) { // Repopulate note objects
                    newNote();
                    noteList[i][1].noteTitle = fileContent[i][0];
                    noteList[i][1].noteBody = fileContent[i][1];
                    noteList[i][1].noteColor = fileContent[i][2];
                    noteList[i][1].noteColorIndex = fileContent[i][3];
                    noteList[i][1].setTitle();
                }

                noteList[noteList.length - 1][1].showNote();
            } else { // Else give error
                alert("Error: Invalid file. Please upload a valid ezNotes save");
            }
        } catch (err) { // Else give error
            alert("Error: Invalid file. Please upload a valid ezNotes save");
        }

    }
    reader.readAsText(files);
    
}

class Note {
    constructor(noteID) {
        this.noteID = noteID;
        this.noteTitle = "Untitled Note " + this.noteID;
        this.noteBody = "Write your note here...";
        this.noteColor = "rgba(211, 211, 211, 0.664)";
        this.noteColorIndex = 0;
    }

    showNote() { // Changes info on right side to the appropriate note's info
        initialTitle.value = this.noteTitle;
        initialMessage.value = this.noteBody;
        initialColor.selectedIndex = this.noteColorIndex;
        document.getElementById("infoBox").style.backgroundColor = this.noteColor;

        // Sets correct onclick attributes for current note

        initialSave.setAttribute("onclick", "noteList[searchNoteList(" + this.noteID + ")][1].saveNote()"); 
        initialDelete.setAttribute("onclick", "noteList[searchNoteList(" + this.noteID + ")][1].deleteNote()");

        // Make title on left side darker for note that is being shown

        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i][0] == this.noteID) {
                document.getElementById("note" + this.noteID).style.opacity = "0.6";
            } else {
                document.getElementById("note" + noteList[i][0]).style.opacity = "1";
            }
            
        }
    }

    saveNote() { // When they hit save it saves whatever they wrote in for the note or selected color from drop down
        this.noteTitle = initialTitle.value;
        this.noteBody = initialMessage.value;
        this.noteColor = colorSelector.options[colorSelector.selectedIndex].value;
        this.noteColorIndex = initialColor.selectedIndex;

        // Checks if they saved an empty note title and sets title box as untitled note if they did

        if (this.noteTitle === "") {
            document.getElementById("note" + this.noteID).innerHTML = "Untitled Note " + this.noteID;
        } else {
            if (this.noteTitle.length > 45) { // Prevents the title from being too long
                document.getElementById("note" + this.noteID).innerHTML = this.noteTitle.slice(0, 45) + "...";
            } else {
                document.getElementById("note" + this.noteID).innerHTML = this.noteTitle;
            }
        }

        // Set correct color for title and info

        document.getElementById("note" + this.noteID).style.backgroundColor = this.noteColor;
        document.getElementById("infoBox").style.backgroundColor = this.noteColor;
    }

    deleteNote() { // Delete button method
        locID = searchNoteList(this.noteID); // Logs the index of the note that is being deleted
        document.getElementById("note" + this.noteID).remove(); // Removes title div on the left
        noteList.splice(locID, 1); // Removes note at that index
        
        if (noteList.length < 1) { // If the last note is being deleted, the info elements gets removed
            initialTitle.remove();
            initialMessage.remove();
            initialSave.remove();
            initialDelete.remove();
            initialColor.remove();
            document.getElementById("infoBox").style.backgroundColor = greyColor.value;
            initialDisplayCheck = false;
        } else {
            if (locID == 0) { // If note being removed is at the front of the noteList, display info of next one
                noteList[0][1].showNote();
            } else { // If note being removed is not at front, display info of previous one
                noteList[locID - 1][1].showNote();
            }
        }
    }

    setTitle() {
        document.getElementById("note" + this.noteID).style.backgroundColor = this.noteColor;
        document.getElementById("note" + this.noteID).innerHTML = this.noteTitle;
    }
}