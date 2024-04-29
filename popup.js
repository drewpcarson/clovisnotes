// popup.js
let editTab = null; // Variable to store the opened edit tab

document.addEventListener("DOMContentLoaded", async function () {
  const queryString = "[class^=notes_noteMasonryGrid] > div > a";
  const titleSelector = "h1[class^=notes_noteTitle]";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractNotes,
    args: [queryString, titleSelector],
  });

  displayNotes(results[0].result);
});

function extractNotes(queryString, titleSelector) {
  var noteElements = document.querySelectorAll(queryString);
  var notes = Array.from(noteElements).map(function (noteElement) {
    var titleElement = noteElement.querySelector(titleSelector);
    return {
      title: titleElement ? titleElement.textContent.trim() : "",
      url: noteElement.href,
    };
  });
  return notes;
}

function displayNotes(notes) {
  var noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  notes.forEach(function (note) {
    var listItem = document.createElement("div");
    listItem.classList.add("note-item");

    var titleElement = document.createElement("span");
    titleElement.classList.add("note-title");
    titleElement.textContent = note.title;
    titleElement.setAttribute("data-url", note.url);

    var actionsElement = document.createElement("div");
    actionsElement.classList.add("note-actions");

    var editButton = document.createElement("button");
    editButton.innerHTML = "&#9998;"; // Pencil icon
    editButton.addEventListener("click", function () {
      editNote(note.url);
    });

    // var deleteButton = document.createElement("button");
    // deleteButton.innerHTML = "&#128465;"; // Trashcan icon
    // deleteButton.addEventListener("click", function () {
    //   deleteNote(note.url);
    // });

    actionsElement.appendChild(editButton);
    // actionsElement.appendChild(deleteButton);

    listItem.appendChild(titleElement);
    listItem.appendChild(actionsElement);

    noteList.appendChild(listItem);
  });
}

function editNote(url) {
  var editUrl = url + "/edit";
  if (editTab) {
    // If an edit tab is already open, update its URL
    chrome.tabs.update(editTab.id, { url: editUrl });
  } else {
    // If no edit tab is open, create a new one
    chrome.tabs.create({ url: editUrl }, function (tab) {
      editTab = tab; // Store the opened edit tab
    });
  }
}

// async function deleteNote(url) {
//   var confirmDelete = confirm("Are you sure you want to delete this note?");
//   if (confirmDelete) {
//     try {
//       await fetch(url, { method: "DELETE" });
//       console.log("Note deleted:", url);
//       // Optionally, you can refresh the note list here
//     } catch (error) {
//       console.error("Error deleting note:", error);
//     }
//   }
// }
