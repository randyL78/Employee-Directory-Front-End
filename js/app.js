/*jshint esversion: 6 */

document.addEventListener('DOMContentLoaded', function () {
		"use strict";

	// ************************************************************
	//				Globals
	// ************************************************************		
	const employeeCount = 12;	// adjust this to grab more or less employees from API	
	const wrapper = document.querySelector(".wrapper");
	const sortUL = document.querySelector(".sort");
	const searchBar = document.querySelector(".input__search");
	const modal = new Modal();
	let employees = []; // all employees
	let filteredEmployees = []; // the working array for the employees to display
	let currentEmployee = 0; // use to display correct employee in modal
	let sortType = "first";  // use to tell what method to sort employees by
	
	// ************************************************************
	//				functions
	// ************************************************************		
	// change which employee the modal displays
	function iterateEmployee() {
		if (currentEmployee > filteredEmployees.length -1) {
			currentEmployee = 0;
		} else if (currentEmployee < 0) {
			currentEmployee = filteredEmployees.length -1;
		} 
		updateModal();
	}
	
	// use the sortType variable to determine what object properties to sort by
	function sortEmployees() {
		if (sortType === "first") {
			sortEmployeesByType("name", "first");
		} else if (sortType === "user") {
			sortEmployeesByType("login","username");
		}
		displayEmployees();
		
	}
	
	// sort the employees array by properties passed to function
	function sortEmployeesByType(mainProp, subProp) {
		let employeeNames = [];

		filteredEmployees.forEach((employee) => {
			employeeNames.push(employee[mainProp][subProp]);
		});

		employeeNames.sort();
		filteredEmployees.sort((firstVal, nextVal) => {
			firstVal = employeeNames.indexOf(firstVal[mainProp][subProp]);
			nextVal = employeeNames.indexOf(nextVal[mainProp][subProp]);
			return firstVal - nextVal;
		});
	}	

	function filterEmployees(value) {
		if (value) {
			filteredEmployees = [];
			employees.forEach(employee => {
				const name = `${employee.name.first} ${employee.name.last}`;
				const username = employee.login.username;
				if (name.toLowerCase().includes(value) || username.toLowerCase().includes(value) ) {
					filteredEmployees.push(employee);
				}
			});
		} else {
			filteredEmployees = employees;
		}
		sortEmployees();
	}
	
	// use a single employee's info to create a "card" in html
	function displayEmployees() {
		wrapper.innerHTML = "";
		filteredEmployees.forEach( (employee, index) => { 
			const cardElement = document.createElement('article');
			cardElement.classList.add('card');
			cardElement.setAttribute('data-value', index);
			let cardInner = 
			`	<img src="${employee.picture.medium}" class="img--avatar">
				<div class="card__content--verticle">
					<h2 class="headline--secondary name">${employee.name.first} ${employee.name.last}</h2>
					<p class= "username" >${employee.login.username}</p>
					<a class="link" href="mailto:${employee.email}">${employee.email}</a>
					<p class="address">${employee.location.city}, ${employee.location.state}</p>
				</div>	 `;
			cardElement.innerHTML = cardInner;
			wrapper.appendChild(cardElement);				
		});
	}
	
	// display the modal by changing overlay's display property
	function openModal(value) {
		currentEmployee = value;
		updateModal();
		modal.open();
	}
	
	// 	load employee info into modal window
	function updateModal() {
		let employee = filteredEmployees[currentEmployee];
		// manipulate birthday string to get format we want
		let bDayChars = employee.dob.date
			.slice(0, employee.dob.date.indexOf("T")) // remove time from birthday
			.split("-"); // split birthday into seperate strings to reorder them
		bDayChars[0] = bDayChars[0].slice(2,4); // extract 2 digit year from string
		const bDay = ` ${bDayChars[1]}/${bDayChars[2]}/${bDayChars[0]}`; // reorder into mm/dd/yy format
			
		modal.message = 
			`<img src="${employee.picture.large}" class="img--profile">
			<div class="card__content--verticle">
				<h2 class="headline--secondary">${employee.name.first} ${employee.name.last}</h2>
				<p>${employee.login.username}</p>
				<a class="link" href="mailto:${employee.email}">${employee.email}</a>
				<hr>
				<a class="link" href="tel:+1${employee.cell}">${employee.cell}</a>
				<p class="address">${employee.location.street} ${employee.location.city}, ${employee.location.state}</p>
				<p>Birthday:${bDay}</p>
			</div> `;		
	}
	
	// ************************************************************
	//				Ajax API call and handler
	// ************************************************************	
	
	// adjust settings for API
	const urlAPI = `https://randomuser.me/api/?results=${employeeCount}&inc=name, picture, email, location, cell, login, dob&noinfo&nat=US`;


	/**
	 * Fetch Employee data 
	 */
	const fetchEmployees = () => {
		fetch(urlAPI)
			.then(checkStatus)
			.then(res => res.json())
			.then(data => {
				employees = data.results;
				/* Uncomment to troubleshoot data coming in */
				// console.log(employees);
				filterEmployees();
			})
			.catch(handleError);
	}
	fetchEmployees();

	function checkStatus (res) { 
		return res.ok ? 
			Promise.resolve(res) : 
			Promise.reject(new Error(res.statusText)) ;
	}

	function handleError (err) {
		console.log("Error fetching Employees", err);
		wrapper.innerHTML = `
			<h2 style="width: 100%; text-align: center" >Unable to fetch employee data</h2>
			<p style="width: 100%; text-align: center" >Please try again later</p>
		`
	}

	/**
	 * fetch employee data using XMLHttpRequest
	 * May update as a fallbcak for browsers that don't use fetch()
	 * @deprecated as of 7/3/2018
	 */
	const employeeRequest = new XMLHttpRequest();	
	// wait until data has been retrieved
	employeeRequest.onreadystatechange = () => {
		if(employeeRequest.readyState === 4) {
			const data = JSON.parse(employeeRequest.responseText);
			employees = data.results;
			sortEmployees();
			/* Uncomment to troubleshoot data coming in */
			// console.log(employees);
		}
	};
	// employeeRequest.open('GET', urlAPI);
	// employeeRequest.send();


	

	
	// ************************************************************
	//				Event handlers
	// ************************************************************	

	// radio buttons
	sortUL.onchange = (e) => {
		sortType = e.target.value;
		sortEmployees();
	};

	// search bar
	searchBar.addEventListener('keyup', e => filterEmployees(e.currentTarget.value.toLowerCase()));

	// cards
	wrapper.onclick = (e) => {
		let clickedElement = e.target;
		
		// filter through parents of the clicked element until the data-value attribute is found
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
	
	// modal buttons
	modal.nextButton.onclick = () => {
		currentEmployee ++;
		iterateEmployee();
	};	
	modal.previousButton.onclick = () => {
		currentEmployee --;
		iterateEmployee();
	};	
	

});
	









