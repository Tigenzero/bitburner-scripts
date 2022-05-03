/** @param {NS} ns */
/*
RAM: 1.02TB
*/
export async function main(ns) {
	var division = ns.args[0]
	var city = ns.args[1]
	await ns.corporation.expandCity(division, city)
}