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

    // Line below sets an onclick attribute on each title div allows you to access the correct object in noteList using its permanent ID

    insertTitle.setAttribute("onclick", "noteList[searchNoteList(" + noteID + ")][1].showNote()");

    if (!initialDisplayCheck) { // If display isn't present, generate the elements on the right side
        initialDisplay();
    }

    noteList[searchNoteList(noteID)][1].showNote();
    
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
    initialTitle.id = "titleInput";
    initialMessage.className = "message-input";
    initialMessage.id = "messageInput";
    initialSave.className = "save-button";
    initialSave.id = "saveButton";
    initialSave.innerHTML = "Save";
    initialDelete.className = "delete-button";
    initialDelete.id = "deleteButton";
    initialDelete.innerHTML = "Delete";
    initialColor.className = "color-selector";
    initialColor.id = "colorSelector";
    redColor.className = "red-color";
    redColor.id = "redColor";
    redColor.innerHTML = "Red";
    blueColor.className = "blue-color";
    blueColor.id = "blueColor";
    blueColor.innerHTML = "Blue";
    greenColor.className = "green-color";
    greenColor.id = "greenColor";
    greenColor.innerHTML = "Green";
    greyColor.className = "grey-color";
    greyColor.id = "greyColor";
    greyColor.innerHTML = "Grey";

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

class Note {
    constructor(noteID) {
        this.noteID = noteID;
        this.noteTitle = "Untitled Note " + this.noteID;
        this.noteBody = "Write your note here...";
    }

    showNote() { // Changes info on right side to the appropriate note's info
        document.getElementById("titleInput").value = this.noteTitle;
        document.getElementById("messageInput").value = this.noteBody;

        // Sets correct onclick attributes for current note

        initialSave.setAttribute("onclick", "noteList[searchNoteList(" + this.noteID + ")][1].saveNote()"); 
        initialDelete.setAttribute("onclick", "noteList[searchNoteList(" + this.noteID + ")][1].deleteNote()");
    }

    saveNote() { // When they hit save it saves whatever they wrote in for the note
        this.noteTitle = document.getElementById("titleInput").value;
        this.noteBody = document.getElementById("messageInput").value;

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
            initialDisplayCheck = false;
        } else {
            if (locID == 0) { // If note being removed is at the front of the noteList, display info of next one
                noteList[0][1].showNote();
            } else { // If note being removed is not at front, display info of previous one
                noteList[locID - 1][1].showNote();
            }
        }
    }
}