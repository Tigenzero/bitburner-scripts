/** @param {NS} ns */


function heal(ns){
	ns.bladeburner.startAction("general", "Hyperbolic Regeneration Chamber")
}

function track(ns) {
	ns.bladeburner.startAction("contract", "Tracking")
}

export async function main(ns) {
	var player = ns.getPlayer()
	var action = ns.bladeburner.getCurrentAction()
	ns.tprint(action)
	while (true){
		if (player.hp < 10) {
			heal(ns)
		} else if (player.hp >= 25){
			track(ns)
		}
		await ns.sleep(5000)
	}
	
}