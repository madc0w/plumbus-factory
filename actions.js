var lastMarketingTime = 0;
var lastDinglebopStampingMachineUpgrade = 0;
var lastBlamfRenegotiation = 0;
var lastAlienSexAct = 0;

function getActions() {
	return [ //
		{
			title : "Aggressive marketing campaign",
			text : "This will increase market demand for plumbuses, because owning just one is for sissies and fleebs.<br/><br/>"
				+ "Cost: &Delta; 250 brapples",
			condition : function() {
				return state.plumbuses.totalSold > 80 && state.numSteps - lastMarketingTime > 200 && state.brapples >= 250;
			},
			effect : function() {
				lastMarketingTime = state.numSteps;
				state.market.baseDemand *= 1.2;
				state.brapples -= 250;
			}
		},
		{
			title : "Increase shleem recycling efficiency",
			text : "Save the planetoid.  Recycle more shleem.<br/><br/>Cost: &Delta; 420 brapples",
			condition : function() {
				return state.shleemRecyclingBelts.num >= 1 && state.brapples >= 420;
			},
			effect : function() {
				state.shleemRecyclingBelts.efficiency *= 1.08;
				state.brapples -= 420;
			}
		},
		{
			title : "Fire everybody",
			text : "Having a bad day?  This will help.<br/><br/>Cost: &Delta; 0 brapples",
			condition : function() {
				return state.workers.num > 0 || state.schlami.num > 0;
			},
			effect : function() {
				state.workers.num = 0;
				state.schlami.num = 0;
			}
		},
		{
			title : "Buy bulk grumbo",
			text : function() {
				return "Save some money by buying your grumbo in bulk.<br/><br/>Cost: &Delta; " + state.grumbo.cost * 0.85 * 100
					+ " brapples for 100";
			},
			condition : function() {
				return state.brapples >= state.grumbo.cost * 0.85 * 100;
			},
			effect : function() {
				state.brapples -= state.grumbo.cost * 0.85 * 100;
				state.grumbo.num += 100;
			}
		},
		{
			title : "Dingle bop stamping machine upgrade",
			text : "Make all your dingle bop stamping machines faster.<br/><br/>Cost: &Delta; 90",
			condition : function() {
				return state.dinglebopStampingMachines.num >= 2 && state.numSteps - lastDinglebopStampingMachineUpgrade > 180;
			},
			effect : function() {
				state.brapples -= 90;
				state.dinglebopStampingMachines.rate *= 1.2;
				lastDinglebopStampingMachineUpgrade = state.numSteps;
			}
		},
		{
			title : "Renegotiate blamf wages",
			text : "Those lazy fucks are so overpaid.  Renegotiating their contract will require lawyers, which will cost money. "
				+ "Also, there is a chance this will backfire, if their lawyers are better buddies with the judge than yours are."
				+ "<br/><br/>Cost: &Delta; 60",
			condition : function() {
				return state.workers.num >= 18 && state.numSteps - lastBlamfRenegotiation > 800;
			},
			effect : function() {
				state.brapples -= 60;
				state.workers.cost *= Math.random() < 0.7 ? 0.9 : 1.12;
				lastBlamfRenegotiation = state.numSteps;
			}
		},
		{
			title : "Buy fire insurance",
			text : function() {
				return "Yeah, it costs something, but you may be glad you have it!  Don't say we didn't warn you.<br/><br/>Will pay "
					+ state.insurance.fire.coverage * 100 + "% of value of destroyed items in case of a fire.<br/><br/>Cost: &Delta; "
					+ state.insurance.fire.cost + " for " + state.insurance.fire.duration + " hours";
			},
			condition : function() {
				return state.brapples >= state.insurance.fire.cost && !state.insurance.fire.start;
			},
			effect : function() {
				state.brapples -= state.insurance.fire.cost;
				state.insurance.fire.start = state.numSteps;
			}
		},
		{
			title : "Buy grumbo insurance",
			text : function() {
				return "Yeah, it costs something, but you may be glad you have it!  Don't say we didn't warn you.<br/><br/>Will pay "
					+ state.insurance.grumbo.coverage * 100 + "% of value of destroyed grumbo in case of spoilage.<br/><br/>Cost: &Delta; "
					+ state.insurance.grumbo.cost + " for " + state.insurance.grumbo.duration + " hours";
			},
			condition : function() {
				return state.brapples >= state.insurance.grumbo.cost && !state.insurance.grumbo.start;
			},
			effect : function() {
				state.brapples -= state.insurance.grumbo.cost;
				state.insurance.grumbo.start = state.numSteps;
			}
		},
		{
			title : "Raise an army against Dark Plumbus attack",
			text : function() {
				return "Yeah, it costs something, but you may be glad you did!  Don't say we didn't warn you.<br/><br/>Will mitigate "
					+ "the effects of a Dark Plumbus attack.<br/><br/>Cost: &Delta; " + state.insurance.defense.cost + " for "
					+ state.insurance.defense.duration + " hours";
			},
			condition : function() {
				return state.brapples >= state.insurance.defense.cost && !state.insurance.defense.start;
			},
			effect : function() {
				state.brapples -= state.insurance.defense.cost;
				state.insurance.defense.start = state.numSteps;
			}
		},
		{
			title : "Buy a zombie corporate tax attorney",
			text : function() {
				return "This guy ain't cheap, but he knows all the secret incantations to utter in case of a tax attack.<br/><br/>"
					+ "Cost: &Delta; " + state.insurance.tax.cost + " for " + state.insurance.tax.duration + " hours";
			},
			condition : function() {
				return state.brapples >= state.insurance.tax.cost && !state.insurance.tax.start;
			},
			effect : function() {
				state.brapples -= state.insurance.tax.cost;
				state.insurance.tax.start = state.numSteps;
			}
		},
		{
			title : "Sell all your fleebs",
			text : "The fleeb market is fairly fickle, but you might get a good price... who knows?",
			condition : function() {
				return state.fleeb.num >= 1;
			},
			effect : function() {
				state.brapples += Math.sin(state.numSteps / 120) > 0.2 && state.fleeb.num * state.fleeb.cost * (0.8 + Math.random() * 0.7);
				state.fleeb.num = 0;
			}
		},
		{
			title : "Sell all your dingle bop",
			text : "The dingle bop market is fairly fickle, but you might get a good price... who knows?",
			condition : function() {
				return state.dinglebop.num >= 1;
			},
			effect : function() {
				state.brapples += Math.sin(state.numSteps / 120) > 0.4 && state.dinglebop.num * state.dinglebop.cost * (0.8 + Math.random() * 0.7);
				state.dinglebop.num = 0;
			}
		},
		{
			title : "Sell all your grumbo",
			text : "The grumbo market is fairly fickle, but you might get a good price... who knows?",
			condition : function() {
				return state.grumbo.num >= 1;
			},
			effect : function() {
				state.brapples += Math.sin(state.numSteps / 220) > 0.5 && state.grumbo.num * state.grumbo.cost * (0.8 + Math.random() * 0.7);
				state.grumbo.num = 0;
			}
		},
		{
			title : "Sell all your shleem",
			text : "The shleem market is fairly fickle, but you might get a good price... who knows?",
			condition : function() {
				return Math.sin(state.numSteps / 200) > 0.6 && state.shleem.num >= 1;
			},
			effect : function() {
				state.brapples += state.shleem.num * state.shleem.cost * (0.8 + Math.random() * 0.7);
				state.shleem.num = 0;
			}
		},
		{
			title : "Sell a used dingle bop stamping machine",
			text : function() {
				return "There isn't much of a market for used dingle bop stamping machines, but you can get <nobr>&Delta; "
					+ state.dinglebopStampingMachines.cost * 0.6 + "</nobr> brapples for one of yours.";
			},
			condition : function() {
				return state.dinglebopStampingMachines.num >= 1;
			},
			effect : function() {
				state.brapples += state.dinglebopStampingMachines.cost * 0.6;
				state.dinglebopStampingMachines.num--;
			}
		},
		{
			title : "Sell a used shleem recycling belt",
			text : function() {
				return "There isn't much of a market for used shleem recycling belts, but you can get <nobr>&Delta; "
					+ state.shleemRecyclingBelts.cost * 0.6 + "</nobr> brapples for one of yours.";
			},
			condition : function() {
				return state.shleemRecyclingBelts.num >= 1;
			},
			effect : function() {
				state.brapples += state.shleemRecyclingBelts.cost * 0.6;
				state.shleemRecyclingBelts.num--;
			}
		},
		{
			title : "Sleep with power company executive",
			text : "It seems to like you, if you're interpreting that lick it gave you properly.  If you can just look past "
				+ "its twenty-seven tentacles, it has a really nice personality.<br/><br/> This might result in a lower power bill, if you're lucky. "
				+ "If you are unlucky, it will eat you after, and probably raise your power bill, too.",
			condition : function() {
				return state.numSteps - lastAlienSexAct > 317;
			},
			effect : function() {
				lastAlienSexAct = state.numSteps;
				state.powerCost *= 0.8 + Math.random() * 0.25;
			}
		},
		{
			title : "Buy the power plant",
			text : "Be warned: Doing this will anger the powerful chief executive of the power company, who will surely fly into a rage and "
				+ "eat a few of your blamfs in retaliation.  But hey, free power forever, so who cares!  Am I right??<br/><br/> "
				+ "Cost: &Delta; 1200",
			condition : function() {
				return state.brapples >= 1200 && state.workers.num >= 6 && state.plumbuses.totalMade > 200;
			},
			effect : function() {
				state.powerCost = 0;
				state.brapples -= 1200;
				state.workers.num -= 3 + Math.round(Math.random() * 3);
			}
		},

	];
}
