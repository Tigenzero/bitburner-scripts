var CRIMES = ["shoplift", "robStore", "mug", "larceny", "homicide"]
/** @param {NS} ns 
 * 16.6GB... uhhh now it's 61.6GB after singularity level 2
*/
export async function main(ns) {
	var best_crime = "shoplifting"
	var best_ratio = 0
	for (var crime of CRIMES){
		var stats = ns.singularity.getCrimeStats(crime)
		var ratio = stats.money / stats.time
		ns.tprint(`${crime}:${ratio}`)
		if (ns.singularity.getCrimeChance(crime) > 0.6 && ratio >= best_ratio){
			best_crime = crime
			best_ratio = ratio
		}
	}
	//ns.alert(`${best_crime} is best crime`)
	ns.singularity.commitCrime(best_crime)
}