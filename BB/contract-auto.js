/** @param {NS} ns */
// BITNODE 7: IN PROGRESS!
//Currently not being used
/*var JOBS = [
	["operation", "Raid"],
	//["operation", "Investigation"],
	// ["contract", "Retirement"],
	// ["contract", "Bounty Hunter"],
	//["contract", "Tracking"]
]*/

var OPERATIONS = []

var CONTRACTS = []

const CITY_MOVE = {
	"Sector-12": "Aevum",
	"Aevum": "Volhaven",
	"Volhaven": "Chongqing",
	"Chongqing": "New Tokyo",
	"New Tokyo": "Ishima",
	"Ishima": "Sector-12"
}
const HEALTH = 8
const SUC_LIMIT = 50
const BLACK_OPS_SUC_LIMIT = 50
var BLACK_OPS_NAMES = []

/** @param {NS} ns */
function start_action(ns, type, action, add_team = false) {
	if (add_team) {
		ns.tprint(`Adding Team to ${action}: ${ns.bladeburner.setTeamSize(type, action, Infinity)}`)
	}
	if (ns.bladeburner.startAction(type, action)) {
		ns.tprint(`Switching to ${type}:${action}`)
		return true
	}
	return false
}

/** @param {NS} ns */
function heal(ns, healths, cur_action) {
	if (healths[0] <= HEALTH || cur_action == "Hyperbolic Regeneration Chamber") {
		if (cur_action != "Hyperbolic Regeneration Chamber") {
			ns.tprint(`player health dropped below ${HEALTH}.`)
			return start_action(ns, "general", "Hyperbolic Regeneration Chamber")
		} else if (healths[0] == healths[1]) {
			ns.bladeburner.stopBladeburnerAction()
			return false
		}
		return true
	}
	return false
}
/** @param {NS} ns */
function train(ns, staminas, cur_action) {
	if (parseInt(staminas[0] / staminas[1] * 100) <= 50 || cur_action == "Training") {
		if (cur_action != "Training") {
			ns.tprint(`Stamina is low.`)
			return start_action(ns, "general", "Training")
			// Checks if stamina is greater or equal to than 90% of the max stamina
		} else if (staminas[0] >= staminas[1] * .9) {
			//ns.bladeburner.stopBladeburnerAction()
			return false
		}
		return true
	}
	return false
}
/** @param {NS} ns */
function do_job(ns, jobs, cur_action) {
	var type = null
	var job_option = null
	var job_succ = 0
	for (var job of jobs) {
		type = job[0]
		var name = job[1]
		//ns.bladeburner.getActionRepGain()
		var success_chance = ns.bladeburner.getActionEstimatedSuccessChance(type, name)[0] * 100
		if (success_chance > SUC_LIMIT && ns.bladeburner.getActionCountRemaining(type, name) > 0) {
			if (success_chance == 100) {
				if (cur_action != name)
					return start_action(ns, type, name)
				else
					return true
			} else if (success_chance > job_succ) {
				job_option = name
				job_succ = success_chance
			}
		}
	}
	if (job_option != null) {
		if (cur_action == job_option)
			return true
		ns.print(`Executing ${job_option}`)
		return start_action(ns, type, job_option)
	}
	ns.print("No Jobs are available")
	return false
}

/** @param {NS} ns */
function do_black_ops(ns, cur_action) {
	if (BLACK_OPS_NAMES.includes(cur_action)) {
		return true
	}
	var next_bo = ns.bladeburner.getNextBlackOp()
	if (next_bo == null) {
		ns.print("BlackOps: Next_BO was null. Let's see if it's Operation Daedalus")
		var name = "Operation Daedalus"
		next_bo = { "rank": ns.bladeburner.getBlackOpRank(name), "name": name }
	}
	if (ns.bladeburner.getRank() >= next_bo.rank && ns.bladeburner.getActionEstimatedSuccessChance("blackops", next_bo.name)[0] * 100 >= BLACK_OPS_SUC_LIMIT) {
		if (!start_action(ns, "blackops", next_bo.name, true)) {
			ns.alert("No More Black Ops. Time to Destroy the World.")
			ns.exit()
		}
		ns.print("BlackOps: Starting Action")
		return true
	}
	return false

}

/** @param {NS} ns */
function get_operation_names(ns) {
	var list = []
	for (var name of ns.bladeburner.getOperationNames().reverse()) {
		list.push(["operation", name])
	}
	return list
}

/** @param {NS} ns */
function get_contract_names(ns) {
	var list = []
	for (var name of ns.bladeburner.getContractNames().reverse()) {
		list.push(["contract", name])
	}
	return list
}

/** @param {NS} ns */
/*
	cost: ~4GB
	checks if city chaos is high, and if so, lowers it to below 50.
*/
function diplomacy(ns, cur_action) {
	var chaos = ns.bladeburner.getCityChaos(ns.bladeburner.getCity())
	if (cur_action == "Diplomacy" && chaos >= 100) {
		return true
	}
	if (chaos < 200) {
		return false
	}
	start_action(ns, "general", "Diplomacy")
}

/** @param {NS} ns */
/*
	cost: ~4GB
	confirms the city has a community. If it does not, checks all cities for communities and moves to one that does.
*/
function community_check(ns, cur_city) {
	if (ns.bladeburner.getCityCommunities(cur_city) > 0) {
		return true
	}
	var city = CITY_MOVE[cur_city]
	while (city != cur_city) {
		if (ns.bladeburner.getCityCommunities(city) > 0) {
			if (ns.bladeburner.switchCity(city)) {
				return true
			}
		}
		city = CITY_MOVE[city]
	}
	return false
}

/** @param {NS} ns */
/*function do_tracking_job(ns, cur_action) {
	if (cur_action != "Tracking" && ns.bladeburner.getActionCountRemaining("contract", "Tracking") > 0) {
		ns.tprint(`Switching to Tracking`)
		//ns.bladeburner.startAction("operation", "Investigation")
		ns.bladeburner.startAction("contract", "Tracking")
	}
	return true
}*/

/** @param {NS} ns */
export async function main(ns) {
	//JOBS = JOBS.concat(get_operation_names(ns)).concat(get_contract_names(ns))
	OPERATIONS = OPERATIONS.concat(get_operation_names(ns))
	CONTRACTS = CONTRACTS.concat(get_contract_names(ns))
	BLACK_OPS_NAMES = ns.bladeburner.getBlackOpNames()
	var cur_city = ns.bladeburner.getCity()
	var test = true
	var skill_check = 0
	while (true) {
		var player = ns.getPlayer()
		var healths = [player.hp.current, player.hp.max]
		var staminas = ns.bladeburner.getStamina()
		var cur_action = ns.bladeburner.getCurrentAction().name
		if (test) {
			ns.tprint(`health: ${healths[0]}\\${healths[1]}. stamina: ${staminas[0]}\\${staminas[1]}. current action: ${cur_action}`)
			test = false
		}
		community_check(ns, cur_city)
		if (heal(ns, healths, cur_action) || train(ns, staminas, cur_action) || do_black_ops(ns, cur_action) || diplomacy(ns, cur_action) || do_job(ns, OPERATIONS, cur_action) || do_job(ns, CONTRACTS, cur_action)) {
			cur_city = ns.bladeburner.getCity()
			await ns.sleep(3000)
			skill_check = skill_check + 1
		} else {
			ns.bladeburner.switchCity(CITY_MOVE[ns.bladeburner.getCity()])
			if (cur_city == ns.bladeburner.getCity()) {
				ns.tprint("Around the World and Nothing to Do. Training.")
				start_action(ns, "general", "Training")
				// ns.bladeburner.startAction("contract", "Tracking")
				// ns.tprint("Around the World and Nothing to Do. Exiting.")
				// ns.exit()
			}
			await ns.sleep(1000)
		}
		if (skill_check >= 10) {
			ns.exec("/BB/skills_auto.js", "home")
			skill_check = 0
		}
	}
}