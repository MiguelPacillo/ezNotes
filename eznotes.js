let noteTitle, noteBody, noteList, currNoteID;

noteList = [];

let noteID = 0;

function newNote() {

    // Stuff for adding the new title div.

    let insertTitle = document.createElement("div"); 
    let titleBox = document.getElementById("titleBox");

    insertTitle.innerHTML = "Untitled Note";
    insertTitle.className = "title";
    insertTitle.id = "note" + noteID;

    titleBox.appendChild(insertTitle);

    noteList.push(new Note(noteID)) // Pushes new note object into the noteList.

    insertTitle.setAttribute("onclick", "noteList[" + noteID + "].showNote()"); // Implement noteID like this so that it logs the noteID at the time rather than the variable

    noteID += 1;
}

/*
CURRENT ISSUE: Need to find a way to access the note within the array that isn't dependent on the noteID being the index of the array. Reason why is because deleting
a note would shift the array indexes (eg. note at index 1 would now be at index 0)

OTHER IDEAS: Make it so that when a note gets deleted it is simply turned into a 0 or something within the array in order to subtitute for the object, kinda ugly though
*/

class Note {
    constructor(noteID) {
        this.noteID = noteID;
        this.noteTitle = "Untitled Note";
        this.noteBody = "Write your note here...";
    }

    showNote() {
        console.log(this.noteID);
        console.log(this.noteTitle);
        console.log(this.noteBody);
    }
}