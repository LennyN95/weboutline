'use babel';

import WeboutlineView from './weboutline-view';
import {CompositeDisposable, Disposable} from 'atom';

export default {

  //weboutlineView: null,
  //modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://weboutline-sidepane') {
          return new WeboutlineView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'weboutline:toggle': () => this.toggle()
      }),

      // Destroy any WeboutlineView when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof WeboutlineView) {
            item.destroy();
            atom.sweetprojects.removeInputs('weboutline');
          }
        });
      })
    );

    /// sweetprojects api https://github.com/LennyN95/sweetprojets/
    atom.sweetprojects.setInputs('weboutline', {
      package: 'weboutline',
      label: 'Weboutline',
      inputs: [
        {name: 'SupportBabelLikeFunctions', label: 'Support Babel Functions', value: false, type: 'checkbox'},
        {name: 'myInput', label: 'My Input', value: 'hi', type: 'text'}
      ]
    });

    if(atom.sweetprojects.isActive('weboutline')){
      if(atom.sweetprojects.getValue('weboutline', 'SupportBabelLikeFunctions')){
        atom.config.set('weboutline.SupportBabelLikeFunctions', true);
      }else{
        atom.config.set('weboutline.SupportBabelLikeFunctions', false);
      }
    }

    /*
    this.weboutlineView = new WeboutlineView(state.weboutlineViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.weboutlineView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'weboutline:toggle': () => this.toggle()
    }));
    */
  },

  deactivate() {
    //this.modalPanel.destroy();
    this.subscriptions.dispose();
    //this.weboutlineView.destroy();
  },

  // serialize() {
  //   return {
  //     weboutlineViewState: this.weboutlineView.serialize()
  //   };
  // },

  deserializeWeboutlineView(serialized) {
    return new WeboutlineView();
  },

  toggle() {
    atom.workspace.toggle('atom://weboutline-sidepane');
  },

  config: {
    "showAnonymousJsFunctions": {
      "description": "Check if you want to display anonymous java script functions as well.",
      "type": "boolean",
      "default": "false"
    },
    "SupportBabelLikeFunctions": {
      "description": "For javascript files also support functions whithout the keyword 'function' (experimental feature).",
      "type": "boolean",
      "default": "false"
    },
    "showAnonymousPhpFunctions": {
      "description": "Check if you want to display anonymous php functions as well.",
      "type": "boolean",
      "default": "false"
    }
  }

};
