/** @param {NS} ns */
/*
Pulls employees off of R&D into other roles
RAM: 1.02TB
*/
export async function main(ns) {
	var division = ns.args[0]
	var city = ns.args[1]
	var position = ns.args[2]
	var num = ns.args[3]
	var count = 0
	for(let employee of ns.corporation.getEmployees(division, city)){
		if (employee.job == "Research & Development"){
		    await ns.corporation.assignJob(division, city, employee.name, position)
		    count++
		    if (count == num){
		        break
		    }
		}
	}
}