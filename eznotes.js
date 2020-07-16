let noteTitle, noteBody, noteList, currNoteID, initialDisplayCheck, insertTitle, titleBox, initialTitle, initialMessage, initialSave, infoBox;

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

    // Line below sets an onclick attribute on each title div allows you to access the correct object in noteList using its permanent ID

    insertTitle.setAttribute("onclick", "noteList[searchNoteList(" + noteID + ")][1].showNote()");

    if (!initialDisplayCheck) { // If display isn't present, generate the elements on the right side
        initialDisplay();
    }
    
    noteID += 1; // New ID every time we generate a note
}

function initialDisplay() { // Generates the info display on the right side for the first time

    // These elements will be reused to simply display the info from notes rather than having to regenerate the elements each time you want to see a note's info

    initialDisplayCheck = true;
    initialTitle = document.createElement("input");
    initialMessage = document.createElement("textarea");
    initialSave = document.createElement("button");
    infoBox = document.getElementById("infoBox");

    initialTitle.className = "title-input";
    initialTitle.id = "titleInput";
    initialMessage.className = "message-input";
    initialMessage.id = "messageInput";
    initialSave.className = "save-button";
    initialSave.id = "saveButton";
    initialSave.innerHTML = "Save";

    infoBox.appendChild(initialTitle);
    infoBox.appendChild(initialMessage);
    infoBox.appendChild(initialSave);

    noteList[searchNoteList(noteID)][1].showNote();
}

function searchNoteList(id) { // Find note object using its permanent ID
    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i][0] == id) { // When it finds index of permanent ID, return the index so it can be searched
            return i;
        }
    }
}

class Note {
    constructor(noteID) {
        this.noteID = noteID;
        this.noteTitle = "Untitled Note " + this.noteID;
        this.noteBody = "Write your note here...";
    }

    showNote() { // Changes info on right side to the appropriate note's info
        document.getElementById("titleInput").value = this.noteTitle;
        document.getElementById("messageInput").value = this.noteBody;
        initialSave.setAttribute("onclick", "noteList[searchNoteList(" + this.noteID + ")][1].saveNote()"); // Sets correct onclick attribute for current note
    }

    saveNote() { // When they hit save it saves whatever they wrote in for the note
        this.noteTitle = document.getElementById("titleInput").value;
        this.noteBody = document.getElementById("messageInput").value;

        // Checks if they saved an empty note title and sets title box as untitled note if they did

        if (this.noteTitle === "") {
            document.getElementById("note" + this.noteID).innerHTML = "Untitled Note " + this.noteID;
        } else {
            document.getElementById("note" + this.noteID).innerHTML = this.noteTitle;
        }
    }
}