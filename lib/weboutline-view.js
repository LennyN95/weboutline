'use babel';

export default class WeboutlineView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('weboutline');

    //this.createBox();
    //this.createBox();

    // Create message element

    const message = document.createElement('div');
    message.textContent = 'The Weboutline package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);



    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (!atom.workspace.isTextEditor(item)) {
        message.innerText = 'Open a file to see important information about it.';
        return;
      }
      message.innerHTML = `
        <h2>${item.getFileName() || 'untitled'}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
        </ul>
      `;
    });

  }

  createBox(){
    var box, ul, li;
    box = document.createElement('div');
    box.classList.add('weboutline-box');

    ul = document.createElement('ul');
    box.appendChild(ul);

    for(var i = 0; i < 10; i ++){
      li = document.createElement('li');
      li.innerHTML = 'Item ' + (i+1);
      ul.appendChild(li);
    }

    this.element.appendChild(box);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'weboutline/WeboutlineView'
    };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Weboutline';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://weboutline-sidepane';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom'];
  }

}
