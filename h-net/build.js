var HASH_SPEND = {
	"money" : "Sell for Money"
}

/** @param {NS} ns */
function buy(ns, reason) {
	let cost = ns.hacknet.hashCost(reason)
	let count = Math.floor(ns.hacknet.numHashes()/cost)
	//ns.print(count)
	ns.hacknet.spendHashes(reason, "", count)
}

/** @param {NS} ns */
function optimal_upgrade(ns) {
	let hacknet = ns.hacknet
	let o_node = 0
	let o_upgrade = null
	let o_gain = 0.0
	let multi = ns.getHacknetMultipliers().production
	for (let node = 0; node < ns.hacknet.numNodes(); node++) {
		if (ns.formulas.hacknetServers.hashGainRate(stats.level,stats.ramUsed, stats.ram + 1, stats.cores, multi) / hacknet.getRamUpgradeCost(node) > o_gain) {
			o_node = node
			o_upgrade = ram
			
		}
		ns.formulas.hacknetServers.hashGainRate(stats.level,stats.ramUsed, stats.ram, stats.cores + 1, multi) / hacknet.getCoreUpgradeCost(node)
		ns.formulas.hacknetServers.hashGainRate(stats.level + 1,stats.ramUsed, stats.ram, stats.cores, multi) / hacknet.getLevelUpgradeCost(node)
		let stats = hacknet.getNodeStats(node)
		//ns.print(`${node}: cur - ${stats.production} | formula - ${ns.formulas.hacknetServers.hashGainRate(stats.level,stats.ramUsed, stats.ram, stats.cores, multi)}`)
		//ns.formulas.hacknetServers.hashGainRate()
	}
}

/** @param {NS} ns */
export async function main(ns) {
	while(true){
		//ns.print(`${ns.hacknet.hashCapacity()/ns.hacknet.numHashes()*100}`)
		if ((ns.hacknet.hashCapacity()/ns.hacknet.numHashes()*100) > 50) {
			buy(ns, HASH_SPEND["money"])
		}
		//ns.print(optimal_upgrade(ns))
		await ns.sleep(60*1000)
	}
}