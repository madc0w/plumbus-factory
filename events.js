var taxAmount = null;
var bankFuckupAmount = null;

function getEvents() {
	return [ //
		{
			title : "Dead schlami",
			text : "One of your schlamis accidentally ate a bad fleeb and died.",
			condition : function() {
				return Math.random() < 0.0004 && state.schlami.num > 0 && state.fleeb.num > 0;
			},
			effect : function() {
				state.schlami.num--;
				state.fleeb.num--;
			}
		},
		{
			title : "Pangalactic Taxation Office pays a visit",
			text : function() {
				return "The Pangalactic Taxation Office has determined that your factory is delinquent in payment of tax on interest on "
					+ "penalties incurred for late payment of compliance accounting fees imposed in accordance with special article B27a-321.6351 of "
					+ "federation code subsection Q37.2b on plumbus tax accounting practices.  You are therefore required to pay <nobr>&Delta; "
					+ taxAmount.toFixed(2)
					+ "</nobr> brapples.<br/><br/>"
					+ (state.insurance.tax.start ? "Fortunately, you were smart enough to buy tax extortion insurance."
						: "Sadly, you were not smart enough to buy tax extortion insurance.  Too late now!");
			},
			condition : function() {
				return Math.random() < 0.0012;
			},
			effect : function() {
				taxAmount = 400 + Math.random() * 100;
				state.brapples -= taxAmount;
				if (state.insurance.tax.start) {
					state.brapples += state.insurance.tax.coverage * taxAmount;
				}
			}
		},
		{
			title : "Blamfs revolt!",
			text : "The blamfs are all sick and tired of schlamis looking down on them all the time.  They quit en masse, but not before destroying "
				+ "a dingle bop stamping machine.",
			condition : function() {
				return Math.random() < 0.002 && state.workers.num >= 6 && state.dinglebopStampingMachines.num > 0;
			},
			effect : function() {
				state.dinglebopStampingMachines.num--;
				state.workers.num = 0;
			}
		},
		{
			title : "Fire destroys factory (and everything in it)",
			text : function() {
				return "One of your less industrious blamfs was smoking in the shleem warehouse.  The shleem caught fire, destroying the factory, "
					+ "and the blamf was incinerated. That sucks.<br/><br/>"
					+ (state.insurance.fire.start ? "Fortunately, you were smart enough to buy fire insurance."
						: "Sadly, you were not smart enough to buy fire insurance.  Too late now!");
			},
			condition : function() {
				return Math.random() < 0.0003 && state.workers.num > 0 && state.brapples >= 400;
			},
			effect : function() {
				state.workers.num--;
				if (state.insurance.fire.start) {
					state.brapples += state.insurance.fire.coverage * ( //
					state.dinglebopStampingMachines.num * state.dinglebopStampingMachines.cost + //
					state.shleemRecyclingBelts.num * state.shleemRecyclingBelts.cost + //
					state.dinglebop.num * state.dinglebop.cost + //
					state.dinglebop.shleemed * state.dinglebop.cost + //
					state.shleem.num * state.shleem.cost + //
					state.grumbo.num * state.grumbo.cost + //
					state.fleeb.num * state.fleeb.cost + //
					state.plumbuses.stock * state.plumbuses.price //
					);
				}
				state.dinglebopStampingMachines.num = 0;
				state.shleemRecyclingBelts.num = 0;
				state.dinglebop.num = 0;
				state.dinglebop.stamped = 0;
				state.dinglebop.shleemed = 0;
				state.shleem.num = 0;
				state.grumbo.num = 0;
				state.fleeb.num = 0;
				state.plumbuses.stock = 0;
			}
		},
		{
			title : "Spoiled grumbo",
			text : function() {
				return "Due to unsanitary conditions at your factory, half of your grumbo spoiled and had to be thrown out.<br/><br/>"
					+ (state.insurance.grumbo.start ? "Fortunately, you were smart enough to buy grumbo insurance."
						: "Sadly, you were not smart enough to buy grumbo insurance.  Too late now!");
			},
			condition : function() {
				return Math.random() < 0.001 && state.grumbo.num >= 2;
			},
			effect : function() {
				var lostGrumbo = Math.floor(state.grumbo.num / 2);
				if (state.insurance.grumbo.start) {
					state.brapples += state.insurance.grumbo.coverage * lostGrumbo * state.grumbo.cost;
				}
				state.grumbo.num -= lostGrumbo;
			}
		},
		{
			title : "Defective plumbuses returned",
			text : "Angry customers have returned a number of defective plumbuses, for which you had to refund the cost of purchase.  Unfortunately, word "
				+ "got to the press before you could deploy spin control, so now demand for your new plumbuses is down, too.",
			condition : function() {
				return Math.random() < 0.0006 && state.plumbuses.totalSold > 100;
			},
			effect : function() {
				state.brapples -= 40 + Math.random() * 40;
				state.market.baseDemand *= 0.85;
			}
		},
		{
			title : "Contaminated plumbus",
			text : "A contaminated plumbus kills three people at a bachelor party.  Fortunately, they were jerks that nobody cared about, so the press didn't "
				+ "find out, but since the plumbus was still under warranty, you had to send out a replacement anyway.",
			condition : function() {
				return Math.random() < 0.0005 && state.plumbuses.totalSold > 10;
			},
			effect : function() {
				state.brapples -= state.plumbuses.price;
			}
		},
		{
			title : "New bank management really hates you",
			text : "You owe a lot of money to the bank, and you don't seem to be doing much about it.  To help you feel their pain, the management of "
				+ "First Most Significant and Important Pangalatic Brapple Bank has imposed a <nobr>&Delta; 200-brapple</nobr> penalty.",
			condition : function() {
				return Math.random() < 0.012 && state.brapples < -1200;
			},
			effect : function() {
				state.brapples -= 200;
			}
		},
		{
			title : "Dark plumbus attack!",
			text : function() {
				return "Sensing the presence of plumbuses, the forces of Dark Plumbuses have gathered outside your factory.  Long story short, you put up "
					+ "an expensive but fairly pathetic, ineffectual fight, and the Dark Plumbuses stomped all over you.<br/><br/>"
					+ (state.insurance.defense.start ? "Fortunately, you were smart enough to raise an army before this happened."
						: "Sadly, you were not smart enough to raise an army before this happened.  Too late now!");
			},
			condition : function() {
				return Math.random() < 0.00015 && state.plumbuses.stock > 40;
			},
			effect : function() {
				state.brapples -= 120 + Math.random() * 40;
				if (state.insurance.defense.start) {
					state.shleemRecyclingBelts.num = Math.floor(state.shleemRecyclingBelts.num * 0.7);
					state.fleeb.num = Math.floor(state.fleeb.num * 0.5);
					state.plumbuses.stock = Math.floor(state.plumbuses.stock * 0.6);
				} else {
					state.dinglebopStampingMachines.num = Math.min(state.dinglebopStampingMachines.num, 1);
					state.shleemRecyclingBelts.num = 0;
					state.fleeb.num = 0;
					state.plumbuses.stock = Math.min(state.plumbuses.stock, 8);
				}
			}
		},

		// good events follow
		{
			title : "Schlami dies on the job",
			text : "A schlami died of asphyxiation while working at your factory.  His widow sued the plant, but fortuantely, your lawyers were able to "
				+ "proove that his death was due to him eating company fleeb.  You successfully countersued his widow, netting the company a tidy "
				+ "<nobr>&Delta; 150</nobr> brapple profit after legal expenses!",
			condition : function() {
				return Math.random() < 0.0012 && state.schlami.num > 0;
			},
			effect : function() {
				state.brapples += 150;
				state.schlami.num--;
			}
		},
		{
			title : "Bank fucks up",
			text : function() {
				return "First Most Significant and Important Pangalatic Brapple Bank is under new management, which is even more incompetent than the old "
					+ "management.  They meant to send you a bill for <nobr>&Delta; "
					+ bankFuckupAmount.toFixed(2)
					+ "</nobr> brapples in miscellaneous bank fees, but instead sent a check. <br/><br/>Don't look a gift fleeb in the mouth.";
			},
			condition : function() {
				return Math.random() < 0.0004;
			},
			effect : function() {
				bankFuckupAmount = 300 + Math.random() * 200;
				state.brapples += bankFuckupAmount;
			}
		},
		{
			title : "Intoxicated blamf runs factory all night",
			text : "One of your blamfs got high on fleeb juice and, in his overexcited state, ran the entire factory the whole night all by himself. "
				+ "He produced a number of good plumbuses, but now he is demanding overtime pay.",
			condition : function() {
				return Math.random() < 0.0012 && state.workers.num > 12 && state.fleeb.num >= 1;
			},
			effect : function() {
				state.brapples -= state.workers.cost * 6;
				var n = Math.floor(Math.min(state.grumbo.num, state.dinglebop.num / state.dinglebop.perPlumbus));
				state.grumbo.num -= n;
				state.dinglebop.num -= n * state.dinglebop.perPlumbus;
				state.plumbuses.stock += n;
				state.plumbuses.totalMade += n;
			}
		}, {
			title : "Shleem supplier fucks up",
			text : "Your shleem supplier accidentally sent two extra rolls of shleem.  Just keep quiet.  Nobody needs to know about this.",
			condition : function() {
				return Math.random() < 0.0002;
			},
			effect : function() {
				state.shleem.num += 2;
			}
		}, {
			title : "Fleebs breed",
			text : "Your fleebs got busy over night, adding to your fleeb population.  Now who's gonna mop up all this fleeb juice?",
			condition : function() {
				return Math.random() < 0.0002 && state.fleeb.num >= 2;
			},
			effect : function() {
				state.fleeb.num = Math.ceil(state.fleeb.num * 1.2);
			}
		},

	];
}
