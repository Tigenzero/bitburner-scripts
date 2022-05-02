/** @param {NS} ns */
/*

RAM:
*/
export async function main(ns) {
	var division = args[0]
	var city = args[1]
	ns.corporation.expandCity(division, city)
}