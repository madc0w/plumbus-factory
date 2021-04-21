// made by Plumbus & Kimble Inc., subsidiary of Blamf Inc.
// smooth dinglebop with shleem
// recycle shleem for later batches
// push dinglebop through a grumbo
// rub fleeb to get fleeb juice
// schlami spits on it
// cut fleeb.  several hizards in the way.
// blanfs rub against chumbles
// glubus and grumbo are shaved away
// Plumbus is worth 6.5 Brapples 

// equipment:
// dinglebop stamping machine
// shleem recycling belt

// raw materials:
// rolls of dinglebop 
// shleem
// grumbo
// fleeb

// workers:
// regular workers
// schlami

var state = null;
var mainIntervalId = null;
var interval = 500;
var dialogWidth = 420;
var selectedAction = null;
var actions = null;
var events = null;

function initState() {
	state = {
		numSteps : 0,
		plumbuses : {
			stock : 0,
			totalSold : 0,
			totalMade : 0,
			price : 6.5,
			minValue : 0.101,
		},

		dinglebopStampingMachines : {
			num : 0,
			cost : 300,
			rate : 0.2,
			workers : 4,
			power : 0.5,
		},
		shleemRecyclingBelts : {
			num : 0,
			cost : 120,
			rate : 0.02,
			efficiency : 0.7,
			workers : 3,
			power : 0.35,
		},

		dinglebop : {
			num : 0,
			cost : 3.8,
			stamped : 0,
			shleemed : 0,
			shleemRate : 0.2,
			perPlumbus : 0.1,
			isAuto : false,
			minVal : 0.1,
		},
		shleem : {
			num : 0,
			cost : 10.5,
			isAuto : false,
			minVal : 0.2,
		},
		grumbo : {
			num : 0,
			cost : 1.4,
			workers : 2,
			isAuto : false,
			minVal : function() {
				return Math.max(1, Math.min(state.fleeb.num, state.schlami.num));
			},
		},
		fleeb : {
			num : 0,
			cost : 18,
			isAuto : false,
			minVal : function() {
				return Math.max(1, Math.min(state.grumbo.num, state.schlami.num));
			}
		},

		workers : {
			num : 0,
			idlers : 0,
			cost : 0.14
		},
		schlami : {
			num : 0,
			cost : 0.22
		},

		market : {
			demand : 0,
			demandFactor : 0.8,
			demandVariaition : 4,
			baseDemand : 14,
			pricePoint : 6.5,
			marketStepInterval : 6
		},

		insurance : {
			fire : {
				start : null,
				duration : 500,
				cost : 90,
				coverage : 0.8,
				name : "fire",
			},
			grumbo : {
				start : null,
				duration : 1250,
				cost : 2.5,
				coverage : 0.75,
				name : "grumbo",
			},
			tax : {
				start : null,
				duration : 400,
				cost : 140,
				coverage : 0.68,
				name : "tax extortion",
			},
			defense : {
				start : null,
				duration : 1000,
				cost : 25,
				name : "armed defense",
			}
		},

		powerCost : 0.8,
		basePowerUse : 0.15,
		brapples : 2000,
	};
}

function onLoad() {
	//	a2a.init("Plumbus Factory", {
	//		target : ".share-this",
	//		linkname : "Plumbus Factory",
	//	});

	state = localStorage.getItem("state");
	if (state) {
		state = JSON.parse(state);
		actions = getActions();
		events = getEvents();
		mainIntervalId = setInterval(mainLoop, interval);
	} else {
		dialog(
			"Hello, new boss!",
			"<p>Since this is your first day on the job, you might want to begin by watching this brief instructional video.</p>"
				+ "<div id=\"instructional-video-container\"><iframe width=\"420\" height=\"240\" src=\"https://www.youtube.com/embed/eMJk4y9NGvE?start=3&amp;showinfo=0\" ></iframe></div>",
			[ {
				text : "Got it.  Let's roll!",
				action : function() {
					closeDialog();
					initState();
					actions = getActions();
					events = getEvents();
					resume();
				}
			} ]);
	}
	document.getElementById("speed-slider").value = (300000 / (interval + 249)) - 200;
}

function mainLoop() {
	state.numSteps++;

	factoryStep();
	if (state.numSteps % state.market.marketStepInterval == 0) {
		marketStep();
	}
	eventStep();
	autoStep();
	insuranceStep();

	localStorage.setItem("state", JSON.stringify(state));
	updateActionsDisplay();
	updateInsuranceDisplay();
	updateStateDisplay();

	if (state.brapples < -2000) {
		dialog(
			"Loser",
			"First Most Significant and Important Pangalatic Brapple Bank tires of your shit.  Their army of drones seize all your assets.<ul>"
				+ "<li>Your customers rejoice that you are finally out of business.</li>"
				+ "<li>Your blamfs and schlamis swear a blood oath to assasinate you while you sleep.</li>"
				+ "<li>The Pangalactic Taxation Office smirks and moves on to its next victim.</li>"
				+ "</ul>Do try harder next time."
				+ "<div id=\"you-lose-video-container\"><iframe width=\"200\" height=\"120\" src=\"https://www.youtube.com/embed/S_TYom5_gDk?rel=0&amp;controls=0&amp;showinfo=0&amp;start=10\" ></iframe></div>",
			[ {
				text : "One more chance, please?",
				action : function() {
					initState();
					localStorage.setItem("state", JSON.stringify(state));
					interval = 500;
					onLoad();
					updateStateDisplay();
					closeDialog();
					resume();
				}
			} ]);
	}
}

function updateActionsDisplay() {
	var html = "";
	var inactiveActions = [];
	for ( var i in actions) {
		var action = actions[i];
		if (action.condition()) {
			html += "<div class=\"action-description\" onClick=\"displayAction(" + i + ");\">" + action.title + "</div>";
		} else {
			inactiveActions.push(action);
		}
	}
	for ( var i in inactiveActions) {
		var action = inactiveActions[i];
		html += "<div class=\"action-description inactive\" >" + action.title + "</div>";
	}
	var actionsContainer = document.getElementById("actions");
	actionsContainer.innerHTML = html;
}

function updateInsuranceDisplay() {
	var html = "";
	for ( var type in state.insurance) {
		var insurance = state.insurance[type];
		if (insurance.start) {
			var percentRemaining = 100 * (1 - ((state.numSteps - insurance.start) / insurance.duration));
			html += "<div class=\"insurance-name\">" + insurance.name + "</div>";
			html += "<div class=\"insurance-full\" ><div class=\"insurance-remaining\" style=\"width: " + percentRemaining + "%\"></div></div>";
		}
	}
	var insuranceContainer = document.getElementById("insurance-container");
	var insuranceHeader = document.getElementById("insurance-header");
	insuranceContainer.innerHTML = html;
	insuranceHeader.style.display = html ? "block" : "none";
}

function insuranceStep() {
	for ( var type in state.insurance) {
		var insurance = state.insurance[type];
		if (insurance.start && state.numSteps - insurance.start > insurance.duration) {
			insurance.start = null;
		}
	}
}

function eventStep() {
	for ( var i in events) {
		var event = events[i];
		if (event.condition()) {
			var eventsContainer = document.getElementById("events");
			eventsContainer.innerHTML += "<div class=\"event-description\"><span>@ " + state.numSteps + " : </span><span>" + event.title
				+ "</span></div>";
			togglePause();
			event.effect();
			var text = typeof event.text == "function" ? event.text() : event.text;
			dialog(event.title, text, [ {
				text : "Whatever",
				action : function() {
					closeDialog();
					resume();
				}
			} ]);
		}
	}
}

function autoStep() {
	for ( var key in state) {
		var minVal = state[key].minVal;
		if (typeof minVal == "function") {
			minVal = minVal();
		}
		if (state[key].isAuto && state[key].num < minVal && state.brapples >= state[key].cost) {
			state[key].num++;
			state.brapples -= state[key].cost;
		}
	}
}

function factoryStep() {
	var workersAvailable = state.workers.num;
	var numDinglebopStampingMachinesUsed = Math.floor(state.workers.num / state.dinglebopStampingMachines.workers);
	numDinglebopStampingMachinesUsed = Math.min(state.dinglebopStampingMachines.num, numDinglebopStampingMachinesUsed);
	workersAvailable -= numDinglebopStampingMachinesUsed * state.dinglebopStampingMachines.workers;
	var dinglebopStamped = Math.min(state.dinglebop.num, numDinglebopStampingMachinesUsed * state.dinglebopStampingMachines.rate);
	state.dinglebop.stamped += dinglebopStamped;
	state.dinglebop.num -= dinglebopStamped;

	var shleemUsed = Math.min(state.shleem.num, state.dinglebop.stamped * state.dinglebop.shleemRate);
	state.dinglebop.shleemed += shleemUsed / state.dinglebop.shleemRate;
	state.dinglebop.stamped -= shleemUsed / state.dinglebop.shleemRate;
	state.dinglebop.stamped = Math.max(0, state.dinglebop.stamped);
	state.shleem.num -= shleemUsed;

	var numShleemRecyclingBeltsUsed = Math.ceil(Math.min(state.shleemRecyclingBelts.num, Math.floor(workersAvailable
		/ state.shleemRecyclingBelts.workers), shleemUsed / state.shleemRecyclingBelts.rate));
	state.shleem.num += state.shleemRecyclingBelts.efficiency * Math.min(shleemUsed, numShleemRecyclingBeltsUsed * state.shleemRecyclingBelts.rate);
	workersAvailable -= numShleemRecyclingBeltsUsed * state.shleemRecyclingBelts.workers;

	var numPlumusesProduced = Math.floor(Math.min(state.schlami.num, workersAvailable / state.grumbo.workers, state.grumbo.num, state.fleeb.num,
		state.dinglebop.shleemed / state.dinglebop.perPlumbus));
	if (numPlumusesProduced < 0) {
		console.error("numPlumusesProduced ", numPlumusesProduced);
	}

	workersAvailable -= numPlumusesProduced * state.grumbo.workers;
	if (workersAvailable < 0) {
		console.error("workersAvailable ", workersAvailable);
	}
	state.workers.idlers = workersAvailable;
	state.plumbuses.stock += numPlumusesProduced;
	state.plumbuses.totalMade += numPlumusesProduced;
	state.dinglebop.shleemed -= numPlumusesProduced * state.dinglebop.perPlumbus;
	state.grumbo.num -= numPlumusesProduced;

	state.basePowerUse += (Math.random() - 0.5) * 0.01;
	state.basePowerUse = Math.min(Math.max(state.basePowerUse, 0.1), 0.2);

	state.brapples -= state.workers.num * state.workers.cost;
	state.brapples -= state.schlami.num * state.schlami.cost;
	state.brapples -= numShleemRecyclingBeltsUsed * state.shleemRecyclingBelts.power * state.powerCost;
	state.brapples -= numDinglebopStampingMachinesUsed * state.dinglebopStampingMachines.power * state.powerCost;
	state.brapples -= state.basePowerUse * state.powerCost;
}

function marketStep() {
	state.market.demand = state.market.baseDemand + Math.sin(state.numSteps / 400) * state.market.demandVariaition;
	//	console.log("demand ", demand);
	var numSold = state.market.demand * sigmoid(state.market.demandFactor * (state.market.pricePoint - state.plumbuses.price));
	if (Math.random() < numSold - Math.floor(numSold)) {
		numSold++;
	}
	numSold = Math.min(state.plumbuses.stock, Math.floor(numSold));
	//	console.log("numSold ", numSold);
	state.plumbuses.stock -= numSold;
	state.plumbuses.totalSold += numSold;
	state.brapples += numSold * state.plumbuses.price;
}

function updateStateDisplay() {
	for ( var key1 in state) {
		var el1 = document.getElementById(key1);
		if (el1) {
			var val = state[key1];
			if (val != Math.floor(val)) {
				val = val.toFixed(2);
			}
			el1.innerHTML = val;
		}

		var autoButton = document.getElementById(key1 + "-auto");
		if (autoButton) {
			var isAuto = state[key1].isAuto;
			autoButton.innerHTML = isAuto ? "manual" : "auto";
		}

		for ( var key2 in state[key1]) {
			var el2 = document.getElementById(key1 + "-" + key2);
			if (el2) {
				var val = state[key1][key2];
				if (val != Math.floor(val)) {
					val = val.toFixed(2);
				}
				el2.innerHTML = val;
			}
		}
	}

	var valueControls = document.getElementsByClassName("value-control");
	for (var i = 0; i < valueControls.length; i++) {
		var valueControl = valueControls[i];
		var idParts = valueControl.id.split("-");
		var cost = state[idParts[0]].cost;
		if (valueControl.id.endsWith("-inc")) {
			if (cost && state.brapples < cost) {
				if (!valueControl.className.includes("inactive")) {
					valueControl.className += " inactive";
				}
			} else {
				valueControl.className = "value-control";
			}
		} else if (valueControl.id.endsWith("-dec")) {
			if (state[idParts[0]].num <= (state[idParts[0]].minValue || 0)) {
				if (!valueControl.className.includes("inactive")) {
					valueControl.className += " inactive";
				}
			} else {
				valueControl.className = "value-control";
			}
		}
	}
	var valueControl = document.getElementById("plumbuses-price-dec");
	if (state.plumbuses.price <= state.plumbuses.minValue) {
		if (!valueControl.className.includes("inactive")) {
			valueControl.className += " inactive";
		}
	} else {
		valueControl.className = "value-control";
	}
}

function reset() {
	dialog("Reset game", "<p>Seriously?  You will lose all your hard work.</p><p>Don't pretend you didn't know.</p>", [ //
	{
		text : "Burn it down!",
		action : function() {
			initState();
			updateStateDisplay();
			closeDialog();
			resume();
		}
	}, {
		text : "Oops, never mind.",
		action : function() {
			closeDialog();
			resume();
		}
	} //
	]);
}

function closeDialog() {
	var dialogBox = document.getElementById("dialog-box");
	dialogBox.style.display = "none";
	var grayOverlay = document.getElementById("gray-overlay");
	grayOverlay.style.display = "none";
}

function dialog(title, message, buttons) {
	pause();
	var dialogBox = document.getElementById("dialog-box");
	dialogBox.style.width = dialogWidth + "px";
	dialogBox.style.left = (window.innerWidth - dialogWidth) / 2 + "px";
	var grayOverlay = document.getElementById("gray-overlay");
	grayOverlay.style.height = window.innerHeight + "px";

	var dialogMessage = document.getElementById("dialog-message");
	dialogMessage.innerHTML = message;
	var dialogTitle = document.getElementById("dialog-title");
	dialogTitle.innerHTML = title;

	if (buttons && buttons.length > 0) {
		var html = "";
		for ( var i in buttons) {
			var button = buttons[i];
			var funcStr = button.action.toString().replace(/\"/g, "'").replace(/^function ?\(\) \{/, "").replace(/\}$/, "");
			html += "<button onClick=\"" + funcStr + "\">" + button.text + "</button>";
		}
		var dialogButtons = document.getElementById("dialog-buttons");
		dialogButtons.innerHTML = html;
	} else {
		var dialogButtons = document.getElementById("dialog-buttons");
		dialogButtons.innerHTML = "<button onClick=\"closeDialog();\">Whatever</button>";
	}
	dialogBox.style.display = "block";
	grayOverlay.style.display = "block";
}

function pause() {
	clearInterval(mainIntervalId);
	mainIntervalId = null;
	var el = document.getElementById("pause");
	el.innerHTML = "go";
}

function resume() {
	mainIntervalId = setInterval(mainLoop, interval);
	var el = document.getElementById("pause");
	el.innerHTML = "pause";
}

function togglePause() {
	if (mainIntervalId) {
		pause();
	} else {
		resume();
	}
}

function setSpeed(speedSlider) {
	interval = 30000 / (parseFloat(speedSlider.value) / 10 + 20) - 249;
	//	console.log("speedSlider.value ", speedSlider.value);
	//	console.log("interval", interval);
	if (mainIntervalId) {
		clearInterval(mainIntervalId);
		mainIntervalId = setInterval(mainLoop, interval);
	}
}

function updateValue(buttonEl, params) {
	if (!buttonEl.className.includes("inactive")) {
		var delta = params.delta || 1;
		var idParts = buttonEl.id.split("-");
		var action = idParts[idParts.length - 1];
		if (action == "auto") {
			state[idParts[0]].isAuto = !state[idParts[0]].isAuto;
		} else {
			state[idParts[0]][idParts[1]] += action == "inc" ? delta : -delta;
			if (params.isSupplies && action == "inc") {
				state.brapples -= state[idParts[0]].cost;
			}
		}
		updateStateDisplay();
	}
}

var isEventsDisplay = false;
function toggleEventsActions() {
	isEventsDisplay = !isEventsDisplay
	var eventsSection = document.getElementById("events-section");
	var actionsSection = document.getElementById("actions-section");
	document.getElementById("toggle-events-actions-button").innerHTML = isEventsDisplay ? "show actions" : "show events";
	actionsSection.style.display = isEventsDisplay ? "none" : "inline-block";
	eventsSection.style.display = isEventsDisplay ? "inline-block" : "none";
}

function displayAction(i) {
	selectedAction = actions[i];
	var text = typeof selectedAction.text == "function" ? selectedAction.text() : selectedAction.text;
	dialog(selectedAction.title, text, [ {
		text : "Do it!",
		action : function() {
			selectedAction.effect();
			closeDialog();
			resume();
		}
	}, {
		text : "Screw it",
		action : function() {
			closeDialog();
			resume();
		}
	} ]);
}

function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}
