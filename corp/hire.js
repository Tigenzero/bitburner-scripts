/** @param {NS} ns */
/*
upgrades the office size for a city and adds all new empoyees to the R&D team
RAM: 1.02TB
*/
export async function main(ns) {
	var division = ns.args[0]
	var city = ns.args[1]
	var num = ns.args[2]
	ns.corporation.upgradeOfficeSize(division, city, num)

	for(let i = 0; i < num; i++){
		var employee = ns.corporation.hireEmployee(division, city)
		await ns.corporation.assignJob(division, city, employee.name, "Research & Development")
	}
}