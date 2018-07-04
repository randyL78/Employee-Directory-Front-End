  /*jshint esversion: 6 */
  'use strict'
  
  // ************************************************************
	//				Modal HTML
	// ************************************************************	
	const overlay = document.createElement('div');
	overlay.classList.add("overlay");
	overlay.innerHTML = `
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
	// add modal to the body off index.html
	document.getElementsByTagName('body')[0].appendChild(overlay);
	// variables for modal components
	const modal = document.querySelector(".modal");
	const modalContent = modal.querySelector(".modal__inner");
	const closeModal = modal.querySelector(".btn--close");
	const nextModal = modal.querySelector(".btn--next");
	const previousModal = modal.querySelector(".btn--previous");