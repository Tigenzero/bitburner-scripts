/** @param {NS} ns */
/*

RAM: 1.02TB
*/
export async function main(ns) {
	division = args[0]
	city = args[1]
	num = args[2]
	// ns.corporation.expandCity(division)
	ns.corporation.upgradeOfficeSize(division, city, num)
	for(i in num){
		employee = ns.corporation.hireEmployee(division, city)
		ns.corporation.assignJob(division, city, employee.name, "Research")
	}
}