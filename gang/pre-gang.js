var STATS = {
	"Str" : "strength",
	"Def" : "defense",
	"Dex" : "dexterity",
	"Agi" : "agility"
}
/** @param {NS} ns 
 * Sets up requirements for starting gang
 * - gets stats over 100
 * - starts homicide
 * - checks in on karma
 * - once karma hits requirement level (52K?), creates gang and runs gang script
*/
export async function main(ns) {
	var player = ns.getPlayer()
	for (var stat of ["Str", "Def", "Dex", "Agi"]){
		while (player.skills[STATS[stat]] < 100){
			if (player.money > 3000*60){
				ns.singularity.gymWorkout("powerhouse gym", stat, true)
			} else {
				ns.run("gang/pre-crime.js")
			}
			await ns.sleep(60 * 1000)
			player = ns.getPlayer()
		}
	}
	ns.tprint("Stats above 100. Starting Homicide and monitoring Karma.")
	ns.singularity.commitCrime("Homicide")
	
	ns.run("gang/pre-karma.js")
}