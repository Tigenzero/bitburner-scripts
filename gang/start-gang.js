var SERV = "gang-serv"
/** @param {NS} ns */
export async function main(ns) {
	var FACTION = "Slum Snakes"
	if (ns.singularity.checkFactionInvitations().includes(FACTION)){
		ns.tprint(`Joining Faction: ${FACTION}`)
		ns.singularity.joinFaction(FACTION)
	}
	ns.tprint("Creating Gang")
	if (ns.gang.createGang(FACTION) || ns.gang.inGang()){
		if (!ns.serverExists(SERV))
			ns.purchaseServer(SERV, 32)
		ns.scp("/gang/run-gang.js", SERV)
		ns.exec("/gang/run-gang.js", SERV)
	} else {
		ns.tprint("Failed to create gang. Exiting.")
	}
}