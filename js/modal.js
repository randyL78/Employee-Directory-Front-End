/**
 * modal.js
 * Create a simple Modal class for other programs to display messages to users
 * Particularly for FSJS project #5
 * @author Randy Layne
 */
  
/*jshint esversion: 6 */
'use strict'
  
// ************************************************************
//				Modal HTML
// ************************************************************	
class Modal {
  constructor() {
    this.overlay = document.createElement('div');
    this.createHTML(); 
  }
  createHTML() {
    this.overlay.classList.add('overlay');
    this.overlay.innerHTML = `
      <div class="modal">
        <button class="btn--close">
          <span>Close</span>
          <svg class="icn">
            <use xlink:href="#close"/>
          </svg>
        </button>
        <button class="btn--next">
          <span>Next</span>
          <svg class="icn">
            <use xlink:href="#next"/>
          </svg>
        </button>
        <button class="btn--previous">
          <span>Previous</span>
          <svg class="icn">
            <use xlink:href="#previous"/>
          </svg>
        </button>
        <div class="modal__inner">
          <h2>Attention!</h2>
          <p>This is a test modal</p>
          <button class="btn--modal">Close</button>
        </div>
      </div>	
    `;
    // add modal to the body of index.html
    document.getElementsByTagName('body')[0].appendChild(this.overlay);
  }

  open() {
    this.overlay.classList.add('open');
  }

  close() {
    this.overlay.classList.remove('open');
  }

  set message(message) {
    this.overlay.getElementsByClassName('modal__inner')[0].innerHTML = message;
  }

}
