chrome.runtime.onInstalled.addListener(() => {
  console.log("installed");
  chrome.contextMenus.create({
    id: "editNote",
    title: "Edit this note",
    contexts: ["all"],
    visible: false,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "customMenuShow") {
    console.log("showing custom menu");
    chrome.contextMenus.update("editNote", { visible: true });
  } else if (message.type === "customMenuHide") {
    console.log("hiding custom menu");
    chrome.contextMenus.update("editNote", { visible: false });
  } else if (message.type === "editNote") {
    console.log("editing note");
    chrome.tabs.update(sender.tab.id, { url: message.link });
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let link = info.linkUrl + "/edit";
  chrome.tabs.create({ url: link });
});

// Omnibox
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  let url = `https://humane.center/notes/search?q=${encodeURIComponent(text)}`;
  if (disposition === "newForegroundTab") {
    chrome.tabs.create({ url });
  } else {
    chrome.tabs.update({ url });
  }
});
