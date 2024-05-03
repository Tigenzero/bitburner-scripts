var HASH_SPEND = {
	"money" : "Sell for Money",
	"BB1": "Exchange for Bladeburner Rank",
	"BB2": "Exchange for Bladeburner SP"
}

/** @param {NS} ns */
function buy(ns, reason, count = 0) {
	let cost = ns.hacknet.hashCost(reason)
	if (count == 0) {
		count = Math.floor(ns.hacknet.numHashes()/cost)
	}
	ns.hacknet.spendHashes(reason, "", count)
}

/** @param {NS} ns */
export async function main(ns) {
	if (Object.keys(HASH_SPEND).includes(ns.args[0])) {
		buy(ns, HASH_SPEND[ns.args[0]])
	} else if (ns.args[0] == "BB"){
		while (ns.hacknet.numHashes() > ns.hacknet.hashCost(HASH_SPEND["BB1"])) {
			buy(ns, HASH_SPEND["BB1"], 1)
			buy(ns, HASH_SPEND["BB2"], 1)
		}
	} else {
		ns.alert("Argument Unknown")
	}
}