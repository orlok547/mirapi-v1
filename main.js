var coso;
let page = 1;
const fetchAllToggle = document.querySelector('#fetch-all-toggle');
const wrapperList = document.querySelector('#wrapper-list');
const btnFetch = document.querySelector('#btn-fetch');

/**
 * fetch all characters
 * @param {number} page - Current page to fetch.
 * @param {boolean} getAll - Ignores fetch limit. Get all characters at once.
*/

const fetchElements = (page = 1, getAll = false)=>{
	getAll = fetchAllToggle.checked;

	// let urlTarget = 'https://webapi.mir4global.com/nft/lists?listType=sale&class=0&levMin=0&levMax=0&powerMin=0&powerMax=0&priceMin=0&priceMax=0&sort=latest&page=1&languageCode=en';
	let urlTarget = `https://webapi.mir4global.com/nft/lists?listType=sale&class=0&levMin=0&levMax=0&powerMin=0&powerMax=0&priceMin=0&priceMax=0&sort=latest&page=${page}&languageCode=en`;
	
	fetch(urlTarget)
	.then((res)=>{
		if (!res.ok) return console.error('fetch failed with status code ', res.status);

		return res.json();
	})
	.then((res)=>{
		console.log('data fetched!');
		// console.log('res.data: ', res.data);

		if (res.data.more == 0) return;

		coso = res.data;
		let list = res.data.lists;

		for (let i = 0; i < list.length; i++) {
			const element = list[i];
			let tempCharacterDiv = document.createElement('div');
			let statsList = document.createElement('ul');
			let skillsList = document.createElement('ul');
			let spiritsList = document.createElement('ul');
			
			tempCharacterDiv.setAttribute('class', 'list-element');
			tempCharacterDiv.setAttribute('data-transport-id', element.transportID);

			element.stat.forEach(stat=>{
				let tempLi = document.createElement('li');
				tempLi.innerHTML = `<span class="stat-name">${stat.statName}</span>: <span class="stat-value"><strong>${stat.statValue}</strong></span>`;
				statsList.append(tempLi);
			});

			fetch(`https://webapi.mir4global.com/nft/character/skills?transportID=${element.transportID}&class=${element.class}&languageCode=en`)
			// fetch(`https://webapi.mir4global.com/nft/character/inven?transportID=${element.transportID}&languageCode=en`)
			// fetch(`https://webapi.mir4global.com/nft/character/spirit?transportID=${element.transportID}&languageCode=en`)
			.then((res)=>{
				return res.json();
			})
			.then((res)=>{
				// console.log(`data skills: `, res.data);
				// coso = res.data;

				let elmDiv = document.querySelector(`[data-transport-id="${element.transportID}"]`);
				elmDiv.innerHTML += '<p><strong>Skills</strong>: </p>';

				for (let i = 0; i < res.data.length; i++) {
					const skill = res.data[i];
					let tempLi = document.createElement('li');
					// skillsList += `<li>${skill.skillName}: ${skill.skillLevel}</li>`;
					tempLi.innerHTML = `<span class="skill-name">${skill.skillName}</span>: <span class="skill-value">${skill.skillLevel}</span>`;
					skillsList.append(tempLi);
				}
				// skillsList += '</ul>';
				elmDiv.append(skillsList);
			});

			/* fetch(`https://webapi.mir4global.com/nft/character/spirit?transportID=${element.transportID}&languageCode=en`)
			.then((res)=>{
				return res.json();
			})
			.then((res)=>{
				console.log(`data spirits: `, res.data);
				coso = res.data;

				let elmDiv = document.querySelector(`[data-transport-id="${element.transportID}"]`);
				elmDiv.innerHTML += '<p><strong>Spirit</strong>: </p>';

				for (let i = 0; i < res.data.length; i++) {
					const spirit = res.data[i];
					let tempLi = document.createElement('li');
					tempLi.innerHTML = `<span class="spirit-name">${spirit.equip}</span>: <span class="spirit-value">${spirit.inven}</span>`;
					spiritsList.append(tempLi);
				}
				elmDiv.append(spiritsList);
			}); */

			// CREATE NFT (character) CARD ELEMENT
			// console.log('element: ', element);
			tempCharacterDiv.innerHTML = `
				<p><strong>Name</strong>: <a href="https://xdraco.com/nft/trade/${element.seq}">${element.characterName}</a></p>
				<p><strong>transportID</strong>: ${element.transportID}</p>
				<p><strong>Price</strong>: <img src="assets/ico-wemix-credit-logo.webp" width="15"> <strong style="text-decoration: underline;">${element.price}</strong></p>
				<p><strong>Class</strong>: ${element.class}</p>
				<p><strong>Level</strong>: ${element.lv}</p>
				<p><strong>Status</strong>:</p>
			`;
			tempCharacterDiv.append(statsList);

			wrapperList.append(tempCharacterDiv);
		}

		btnFetch.classList.remove('loading');

		if (getAll) fetchElements(++page);
	});
};

btnFetch.addEventListener('click', (e)=>{
	e.preventDefault();

	page++;
	fetchElements(page);
	btnFetch.classList.add('loading');
});

window.addEventListener('load', ()=>{
	fetchElements(page);
});