'use babel';

export default class WeboutlineView {

  element: null; // .weboutline
  parsedFiles = {};
  strip = require('strip-comments');
  cItem = null;

  constructor(serializedState) {
    var me = this;

    console.log('serializedState: ', serializedState);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('weboutline');

    var header = document.createElement('div');
    header.classList.add('weboutline-header');
    this.element.appendChild(header);

    /// search
    var search = document.createElement('input');
    search.classList.add('native-key-bindings');
    search.setAttribute('placeholder', 'Search');
    search.addEventListener('input', this.search__onInput);
    header.appendChild(search);

    /// refresh
    var refreshcmd = document.createElement('button');
    refreshcmd.classList.add('btn');
    refreshcmd.innerHTML = '<span class="icon icon-sync"></span>';
    refreshcmd.addEventListener('click', this.refresh);
    header.appendChild(refreshcmd);

    /// boxes
    this.boxes = document.createElement('div');
    this.boxes.classList.add('weboutline-boxes');
    this.element.appendChild(this.boxes);

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The Weboutline package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    /// TODO: refresh on editor.onDidSave()

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if(atom.workspace.isTextEditor(item)){
        me.cItem = item;
        me.parseFile(item);
      }else{
        me.clearBoxes();
      }
    });

  }

  refresh(){
    console.log('refresh');
  }

  parseFile(editor){
    var me = this;

    /// get file type (TODO: use editor.getGrammar() instead)
    var path = editor.buffer.file.path;
    var ext = path.split('.').slice(-1).pop();

    /// get items from chache or parse file and cache items in parsedFiles
    var items = [];
    if(this.parsedFiles[path] && !editor.isModified()){

      items = this.parsedFiles[path];

    }else{

      //var text = editor.getText();

      console.log('ITEM (editor): ', editor);

      switch(ext){

        case 'css':

          /// get css classes / ids
          //var match = text.match(/(\.|#)([^{,;]*)[,{]/g);
          //for(var i in match){
          //  items.push(match[i].slice(0, -1));
          //}

          /// @try via observeActivePaneItem
          items = this.parseCSS(editor);

        break;
        case 'js':

          /// remove comments
          // try {
          //   text = this.strip(text);
          // } catch (e) {
          //   console.log('strip throws error: ', e);
          // }

          items = this.parseJS(editor);

        break;
        case 'html':
        case 'php':

        editor.scan(/(\<style type=\"text\/css\"\>([\s\S]*)\<\/style\>)|(\<script\>([\s\S]*)\<\/script\>)|(\<!\-\-\s?@(.*)\-\-\>)/g, function(match){
          console.log('----> PHP MATCH: ', match);
          var titems = [];
          if(match.match[4] !== undefined){
            titems = me.parseJS(editor, match.range);
          }else if(match.match[2] !== undefined){
            titems = me.parseCSS(editor, match.range);
          }else if(match.match[6] !== undefined){
            items.push({
              text: match.match[6],
              type: 'custom',
              range: match.range
            });
          }
          items = items.concat(titems);
        });

        break;

      }



      this.parsedFiles[path] = items;
    }

    console.log('MATCH', items);

    /// @display items
    this.clearBoxes();
    this.createBox(items);
  }

  parseJS(editor, range){
    var items = [];
    //var regex = /((([^\s\r\n]*)\s?[=:]\s?)?function\s?([^\(\r\n]*)\s*\([^{\r\n]*)|(\/\/[\s]*@(.*))/g;
    var regex = /((([\w]*)\s?[=:]\s?)?function\s?([\w]*)\s*\([\w\s,]*)\)|(\/\/[\s]*@(.*))/g;

    var mcb = function(match){
      if(match.match[6] === undefined){

        var isAnonymous =  !(match.match[3] !== undefined && match.match[3].length) && !( match.match[4] !== undefined &&  match.match[4].length);

        if(!isAnonymous){
          items.push({
            text: match.matchText,
            type: 'function',
            range: match.range
          });
        }
      }else{
        items.push({
          text: match.match[6],
          type: 'custom',
          range: match.range
        });
      }
    };
    if(range === undefined){
      editor.scan(regex, mcb);
    }else{
      editor.scanInBufferRange(regex, range, mcb);
    }
    return items;
  }

  parseCSS(editor, range){
    var items = [];
    var regex = /((\.|#)([^{,;]*)[,{])|(\/\*[\s]*@([^\*]*)\*\/)/g;
    var mcb = function(match){
      if(match.match[5] === undefined){
        items.push({
          text: match.matchText.slice(0, -1),
          type: {".":"class","#":"id"}[match.match[2]],
          range: match.range
        });
      }else{
        items.push({
          text: match.match[5],
          type: 'custom',
          range: match.range
        });
      }
    };
    if(range === undefined){
      editor.scan(regex, mcb);
    }else{
      editor.scanInBufferRange(regex, range, mcb);
    }
    return items;
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
      icon.dataset.type = item.type;
      li.appendChild(icon);

      label = document.createElement('span');
      label.innerText = item.text;
      li.appendChild(label);

      // click event
      label.addEventListener('click', function(e){me.item__onClick(e,me)});

      ul.appendChild(li);
    }

    this.boxes.appendChild(box);
  }

  item__onClick(e, me){

    console.log(me.cItem.getTitle());
    console.log('citem: ', me.cItem);
    console.log('cachedItems', me.parsedFiles, me.cItem.buffer.file.path);

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

    editor.setSelectedBufferRange(cachedItem.range);
  }

  search__onInput(){

    var input = this;
    var q = input.value.toLowerCase();
    var element = input.parentNode.parentNode;
    var boxe_wrapper = element.getElementsByClassName('weboutline-boxes')[0];
    console.log('boxe_wrapper: ', boxe_wrapper);
    var boxes = boxe_wrapper.getElementsByClassName('weboutline-box');
    console.log('boxes: ', boxes);

    for(var i = 0; i < boxes.length; i++){
      var lis = boxes[i].getElementsByTagName('ul')[0].getElementsByTagName('li');

      for(var j = 0; j < lis.length; j++){
          var t = lis[j].innerText.toLowerCase();
          lis[j].style.display = (q.length && t.indexOf(q) < 0) ? 'none' : 'list-item';
      }

    }

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
