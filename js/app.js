/*jshint esversion: 6 */

document.addEventListener('DOMContentLoaded', function () {
		"use strict";
	// ************************************************************
	//				Globals
	// ************************************************************		
	const employeeCount = 12;	// adjust this to grab more or less employees from API	
	const wrapper = document.querySelector(".wrapper");
	const overlay = document.querySelector(".overlay");
	const modal = document.querySelector(".modal");
	const modalContent = modal.querySelector(".modal__inner");
	const closeModal = modal.querySelector(".btn--close");
	const nextModal = modal.querySelector(".btn--next");
	const previousModal = modal.querySelector(".btn--previous");
	let employees = [];
	let currentEmployee = 0; // use to display correct employee in modal
	
	// ************************************************************
	//				functions
	// ************************************************************		
	function iterateEmployee() {
		if (currentEmployee > employeeCount -1) {
			currentEmployee = 0;
		} else if (currentEmployee < 0) {
			currentEmployee = employeeCount -1;
		} 
		updateModal();
	}
	
	function openModal(value) {
		console.log(value);
		currentEmployee = value;
		updateModal();
		overlay.classList.add('open');
	}
	
	function updateModal() {
		console.log(currentEmployee);
		let employee = employees[currentEmployee];
		let cardInner = 
		   `<img src="${employee.picture.large}" class="img--profile">
			<div class="card__content--verticle">
				<h2 class="headline--secondary">${employee.name.first} ${employee.name.last}</h2>
				<p>${employee.login.username}</p>
				<a class="link" href="mailto:${employee.email}">${employee.email}</a>
				<hr>
				<a class="link" href="tel:+1${employee.cell}">${employee.cell}</a>
				<p class="address">${employee.location.street} ${employee.location.city}, ${employee.location.state}</p>
				<p>Birthday:${employee.dob}</p>
			</div> `;
		modalContent.innerHTML = cardInner;			
	}
	
	// ************************************************************
	//				Ajax API call and handler
	// ************************************************************	
	
	const urlAPI = 'https://randomuser.me/api/?results=' + 
					employeeCount +
		  			"&inc=name, picture, email, location, cell, login, dob" +
		  			"&noinfo" +
		  			"&nat=US";
	const employeeRequest = new XMLHttpRequest();	
	employeeRequest.onreadystatechange = () => {
		if(employeeRequest.readyState === 4) {
			const data = JSON.parse(employeeRequest.responseText);
			employees = data.results;
			employees.forEach( (employee, index) => { 
				const cardElement = document.createElement('article');
				cardElement.classList.add('card');
				cardElement.setAttribute('data-value', index);
				let cardInner = 
				`	<img src="${employee.picture.medium}" class="img--avatar">
					<div class="card__content--verticle">
						<h2 class="headline--secondary">${employee.name.first} ${employee.name.last}</h2>
						<p>${employee.login.username}</a>
						<p class="address">${employee.location.city}, ${employee.location.state}</p>
					</div>	 `;
				cardElement.innerHTML = cardInner;
				wrapper.appendChild(cardElement);				
			});
		}
	};
	employeeRequest.open('GET', urlAPI);
	employeeRequest.send();
	
	// ************************************************************
	//				Event handlers
	// ************************************************************	
	wrapper.onclick = (e) => {
		let clickedElement = e.target;
		if (!clickedElement.classList.contains('link')) {
			if  (clickedElement.classList.contains('card')) {
				const value = clickedElement.getAttribute('data-value');
				openModal(value); 
			 } else if (clickedElement.parentElement.classList.contains('card')) {
				const value = clickedElement.parentElement.getAttribute('data-value');
				openModal(value); 	 
			 } else if (clickedElement.parentElement.parentElement.classList.contains('card')) {
				const value = clickedElement.parentElement.parentElement.getAttribute('data-value');
				openModal(value); 
			}	
		}
	};
	closeModal.onclick = () => {overlay.classList.remove('open');};	
	nextModal.onclick = () => {
		currentEmployee ++;
		iterateEmployee();
	};	
	previousModal.onclick = () => {
		currentEmployee --;
		iterateEmployee();
	};	
});
	









