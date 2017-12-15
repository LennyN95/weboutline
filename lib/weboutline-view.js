'use babel';

export default class WeboutlineView {

  parsedFiles = {};
  strip = require('strip-comments');
  cItem = null;

  constructor(serializedState) {
    var me = this;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('weboutline');

    this.boxes = document.createElement('div');
    this.boxes.classList.add('weboutline-boxes');
    this.element.appendChild(this.boxes);

    this.createBox();
    this.createBox();
    this.createBox();

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The Weboutline package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);



    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if(atom.workspace.isTextEditor(item)){
        me.cItem = item;
        me.parseFile(item);
      }
    });

  }

  parseFile(editor){

    /// get file type
    var path = editor.buffer.file.path;
    var ext = path.split('.').slice(-1).pop();

    /// get items from chache or parse file and cache items in parsedFiles
    var items = [];
    if(this.parsedFiles[path]){

      items = this.parsedFiles[path];

    }else{

      var text = editor.getText();

      console.log('ITEM (editor): ', editor);

      switch(ext){

        case 'css':

          /// get css classes / ids
          var match = text.match(/(\.|#)([^{,;]*)[,{]/g);
          for(var i in match){
            items.push(match[i].slice(0, -1));
          }

        break;
        case 'js':

          /// remove comments
          try {
            text = this.strip(text);
          } catch (e) {
            console.log('strip throws error: ', e);
          }

          /// find function definitions
          var match = text.match(/((.*\s?[=:]\s?)?function[\s\(][^{]*)/g);
          for(var i in match){
            items.push(match[i]);
          }

        break;
        case 'html':
        case 'php':


        break;

      }

    }

    console.log('MATCH', items);

    /// display items
    this.clearBoxes();
    this.createBox(items);
  }

  clearBoxes(){
    this.boxes.innerHTML = '';
  }

  createBox(items){
    var me = this;

    var item, box, ul, li, icon, label;
    box = document.createElement('div');
    box.classList.add('weboutline-box');

    ul = document.createElement('ul');
    box.appendChild(ul);

    for(var i in items){
      item = items[i];

      li = document.createElement('li');
      li.dataset.index = i;

      // click event (better on span (label)) ?
      //item.addEventListener('click', this.item__onClick);

      icon = document.createElement('span');
      icon.classList.add('weboutline-icon');
      li.appendChild(icon);

      label = document.createElement('span');
      label.innerText = item;
      li.appendChild(label);

      // click event
      label.addEventListener('click', function(e){me.item__onClick(e,me)});

      ul.appendChild(li);
    }

    this.boxes.appendChild(box);
  }

  item__onClick(e, me){

    console.log('citem: ', me.cItem);

    if(!me.cItem){
      console.log('NO CITEM :///');
      return;
    }

    var target = e.target;
    var li = target.parentElement;
    var index = li.dataset.index;

    var editor = me.cItem;
    var path = editor.buffer.file.path;
    var cachedItems = me.parsedFiles[path];
    var cachedItem = cachedItems[index];

    console.log('ITEM CLICKED');
    console.log(editor.getText(), cachedItem);
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
