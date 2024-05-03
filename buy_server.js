/** @param {NS} ns */
export async function main(ns) {
	var hostname = ns.args[0]
	var ram = ns.args[1]
	var cost = ns.getPurchasedServerCost(ram)
	var server = ns.purchaseServer(hostname, ram)
	ns.tprint("server " + server + " purchased for " + cost)
}