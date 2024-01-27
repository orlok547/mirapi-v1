var coso;
let page = 1;
const fetchAllToggle = document.querySelector('#fetch-all-toggle');
const wrapperList = document.querySelector('#wrapper-list');
const btnFetch = document.querySelector('#btn-fetch');

const fetchAndAppendSkills = (transportID, characterClass)=>{
	let skillsList = document.createElement('ul');
	skillsList.setAttribute('class', ' char-skills-list');

	fetch(`https://webapi.mir4global.com/nft/character/skills?transportID=${transportID}&class=${characterClass}&languageCode=en`)
	// fetch(`https://webapi.mir4global.com/nft/character/inven?transportID=${transportID}&languageCode=en`)
	// fetch(`https://webapi.mir4global.com/nft/character/spirit?transportID=${transportID}&languageCode=en`)
	.then((res)=>{
		return res.json();
	})
	.then((res)=>{
		// console.log(`data skills: `, res.data);
		// coso = res.data;

		let elmDiv = document.querySelector(`[data-transport-id="${transportID}"] .card-body`);
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
};

const fetchAndAppendSpirits = (transportID)=>{
	let spiritsList = document.createElement('ul');
	spiritsList.setAttribute('class', ' char-spirits-list');

	fetch(`https://webapi.mir4global.com/nft/character/spirit?transportID=${transportID}&languageCode=en`)
	.then((res)=>{
		return res.json();
	})
	.then((res)=>{
		// console.log(`data spirits: `, res.data);
		// coso = res.data;

		let elmDiv = document.querySelector(`[data-transport-id="${transportID}"] .card-body`);
		elmDiv.innerHTML += '<p><strong>Spirits</strong>: </p>';
		
		for (const categoryKey in res.data.equip) {
			// console.log(`Category ${categoryKey}:`);
			
			const category = res.data.equip[categoryKey];
		
			for (const spiritKey in category) {
				const spirit = category[spiritKey];
				let tempLi = document.createElement('li');
				
				// console.log(`  spirit ${spiritKey}:`);

				/* console.log(`    Transcend: ${spirit.transcend}`);
				console.log(`    Grade: ${spirit.grade}`);
				console.log(`    spirit Name: ${spirit.petName}`);
				console.log(`    spirit Origin: ${spirit.petOrigin}`);
				console.log(`    Icon Path: ${spirit.iconPath}`); */
				
				tempLi.innerHTML = `<span class="spirit-name">${spirit.petName}<br>Origin: ${spirit.petOrigin}<br>Grade: ${spirit.grade}<br>-------</span>`;
				spiritsList.append(tempLi);
			}
		}

		elmDiv.append(spiritsList);
	});
};

const fetchAndAppendCodex = (transportID)=>{
	let codexList = document.createElement('ul');
	codexList.setAttribute('class', ' char-codex-list');

	fetch(`https://webapi.mir4global.com/nft/character/codex?transportID=${transportID}&languageCode=en`)
	.then((res)=>{
		return res.json();
	})
	.then((res)=>{
		// console.log(`data codex: `, res.data);
		// coso = res.data;

		let elmDiv = document.querySelector(`[data-transport-id="${transportID}"] .card-body`);
		elmDiv.innerHTML += '<p><strong>Codex</strong>: </p>';

		for (const codexKey in res.data) {
			// console.log(`codexKey:`, codexKey);
			
			const codex = res.data[codexKey];
		
			let tempLi = document.createElement('li');
			
			/* console.log(`codexDataKey:`, codexDataKey);
			console.log(`codexDataValue:`, codexDataValue); */
			
			tempLi.innerHTML = `<span class="codex-name"><strong>${codex.codexName}</strong><br>Completed: ${codex.completed}<br>In Progress: ${codex.inprogress}<br>Total Count: ${codex.totalCount}<br>-------</span>`;
			codexList.append(tempLi);
		}
		elmDiv.append(codexList);
	});
};

const fetchAndAppendTraining = (transportID)=>{
	let trainingList = document.createElement('ul');
	trainingList.setAttribute('class', ' char-training-list');

	fetch(`https://webapi.mir4global.com/nft/character/training?transportID=${transportID}&languageCode=en`)
	.then((res)=>{
		return res.json();
	})
	.then((res)=>{
		// console.log(`data training: `, res.data);
		coso = res.data;

		let elmDiv = document.querySelector(`[data-transport-id="${transportID}"] .card-body`);
		elmDiv.innerHTML += '<p><strong>Training</strong>: </p>';

		for (const trainingKey in res.data) {
			// console.log(`trainingKey:`, trainingKey);
			
			const training = res.data[trainingKey];
		
			let tempLi = document.createElement('li');
			
			// console.log(`training:`, training);
			
			if (training.forceName) {
				tempLi.innerHTML = `<span class="training-name"><strong>${training.forceName}</strong><br>Force Level: ${training.forceLevel}<br>forceIdx: ${training.forceIdx}<br>-------</span>`;
			}
			trainingList.append(tempLi);
		}
		elmDiv.append(trainingList);

		fetchAndAppendCodex(transportID);
	});
};

/**
 * fetch all characters
 * @param {number} page - Current page to fetch.
 * @param {boolean} getAll - Ignores fetch limit. Get all characters at once.
*/
const fetchElements = (page = 1, getAll = false)=>{
	getAll = fetchAllToggle.checked;

	let urlTarget = `https://webapi.mir4global.com/nft/lists?listType=sale&class=0&levMin=0&levMax=0&powerMin=0&powerMax=0&priceMin=0&priceMax=0&sort=latest&page=${page}&languageCode=en`;
	
	fetch(urlTarget)
	.then((res)=>{
		if (!res.ok) return console.error('fetch failed with status code ', res.status);

		return res.json();
	})
	.then((res)=>{
		// console.log('data fetched!');
		// console.log('res.data: ', res.data);

		if (res.data.more == 0) return;

		// coso = res.data;
		let list = res.data.lists;

		for (let i = 0; i < list.length; i++) {
			const element = list[i];
			let tempCharacterDiv = document.createElement('div');
			let statsList = document.createElement('ul');
			statsList.setAttribute('class', ' char-stats-list');
			
			// tempCharacterDiv.setAttribute('class', 'list-element');
			tempCharacterDiv.setAttribute('class', 'list-element card');
			tempCharacterDiv.setAttribute('data-transport-id', element.transportID);

			// fetchAndAppendSkills(element.transportID, element.class);

			// fetchAndAppendSpirits(element.transportID);

			// fetchAndAppendCodex(element.transportID);

			fetchAndAppendTraining(element.transportID);

			// CREATE NFT (character) CARD ELEMENT
			// console.log('element: ', element);
			tempCharacterDiv.innerHTML = `
				<div class="card-body">
					<h5 class="card-title char-name"><a href="https://xdraco.com/nft/trade/${element.seq}">${element.characterName}</a></h5>
					<p class="card-text char-transport-id"><strong>transportID</strong>: ${element.transportID}</p>
					<p class="card-text char-price"><strong>Price</strong>: <img src="assets/ico-wemix-credit-logo.webp" width="15"> <strong style="text-decoration: underline;">${element.price}</strong></p>
					<p class="card-text char-class"><strong>Class</strong>: ${element.class}</p>
					<p class="card-text char-level"><strong>Level</strong>: ${element.lv}</p>
				</div>
			`;
			tempCharacterDiv.append(statsList);

			wrapperList.append(tempCharacterDiv);
		}

		btnFetch.classList.remove('loading');

		if (getAll) fetchElements(++page);
	});
};

/* const testCoso = async (page = 1)=>{
	return await fetch('https://www.mir4collection.com:8080/api/player/filter', {
		method: 'POST',
		body: `{"characterName":"","worldName":"","characterIndex":"","level":"","powerScore":"","price":"","physAttack":"","spellAttack":"","physDefense":"","spellDefense":"","codexLength":"","epicSpiritNames":[],"training":[],"inven":[],"legendarySpiritLength":"","legendaryUnsealSpiritLength":"","epicItemLength":"","epicItemLengthTradable":false,"legendaryItemLength":"","legendaryItemLengthTradable":false,"epicSkillTomeLength":"","epicSkillTomeLengthTradable":false,"legendarySkillTomeLength":"","legendarySkillTomeLengthTradable":false,"requiredSkills":[],"requiredItems":[],"requiredEquipItems":[],"spiritNamesUseOr":"false","sort":{"prop":"newest","level":-1},"page":${page},"stats":[],"methodIsSoldPlayers":false}`,
	});
}; */

btnFetch.addEventListener('click', (e)=>{
	e.preventDefault();

	// page++;
	// fetchElements(page);
	fetchElements(++page);
	btnFetch.classList.add('loading');
});

window.addEventListener('load', ()=>{
	fetchElements(page);
});