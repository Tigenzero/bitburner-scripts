/** @param {NS} ns */
export async function main(ns) {
	var script = "/scripts/weaken.script"
	var server = "home"
	var target = "n00dles"
	ns.tprint(ns.isRunning(script, server ,target))
	// ns.tprint(ns.ps())
}