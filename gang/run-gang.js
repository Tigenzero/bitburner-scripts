/**
 * NOTE: scp gang/run-gang.js gang-serv
 */
// CONFIGS
var ASCEND_LIMIT = 50 //after 50x, gang member wont ascend anymore
var ASCEND_POWER_THRESHOLD = 15 //ascend multiplier gang member should be at before contributing to territory warfare
var POWER_LIMIT = 400 // Territory Power Max. After reaching this, focus on other things
var EXP_LIMIT = 300000 //experience threshold when determining if a member is ready to contribute to territory warfare
var RESPECT_LIMIT = 5000000
// VARS
var TRAINING_TASK = "Train Combat"
var EQUIP_TYPES = ["Weapon", "Armor", "Vehicle", "Augmentation"]
var ACTIONS = {}
var TERRITORY_TASK = "Territory Warfare"
var WANTED_TASK = "Vigilante Justice"
var FOCUS = { "respect": "Respect", "wanted": "Wanted Level", "money": "Money Gain" }
/** @param {NS} ns */
function disable_logs(ns) {
	var logs = ["gang.purchaseEquipment", "gang.setMemberTask"]
	for (var i in logs) {
		ns.disableLog(logs[i])
	}
}

/** @param {NS} ns */
function recruit(ns) {
	while (ns.gang.canRecruitMember()) {
		var name = `G${ns.gang.getMemberNames().length + 1}`
		if (!ns.gang.recruitMember(name)) {
			ns.alert("Could not recruit Member!")
			return
		}
		ACTIONS[name] = TRAINING_TASK
		ns.gang.setMemberTask(name, TRAINING_TASK)
	}
}

/** @param {NS} ns */
function ascend(ns, mem) {
	var info = ns.gang.getMemberInformation(mem)
	if (info.str_asc_mult > ASCEND_LIMIT) { //after limit, stop ascending member
		return
	}
	if (ns.formulas.gang.ascensionMultiplier(ns.formulas.gang.ascensionPointsGain(info.str_exp) + info.str_asc_points) - info.str_asc_mult + 1 > 5) {
		ns.gang.ascendMember(mem)
		ACTIONS[mem] = TRAINING_TASK
		//ns.print(`${mem} has Ascended.`)
	}
}

/** @param {NS} ns 
 * If a member can be recruited and this member can gain enough respect to recruit them
 * in 600 ticks, set that task as their current focus.
*/
function recruit_all(ns, info, mem) {
	var res = info.respectForNextRecruit - info.respect
	if (res == 0) { //all members have been recruited.
		return
	}
	var mem_info = ns.gang.getMemberInformation(mem)
	var best_task = get_best_task(ns, info, mem_info, FOCUS.respect)
	if (best_task == null) {
		return
	}
	var gain = ns.formulas.gang.respectGain(info, mem_info, ns.gang.getTaskStats(best_task))
	ns.print(gain * 60 * 20, "<- gain | respect ->" ,res)
	if ((gain * 60 * 20) >= res) {
		ACTIONS[mem] = best_task
		//ns.gang.setMemberTask(mem, best_task)
	} else if ((gain * 60 * 20) < res && best_task == mem_info.task) {
		ACTIONS[mem] = null
	}
}

/** @param {NS} ns 
 * Requires Source File 5
*/
function get_best_task(ns, gang_info, mem_info, focus) {
	var best_task = null
	var best_gain = 0
	for (var task of ns.gang.getTaskNames()) {
		var t_info = ns.gang.getTaskStats(task)
		if (focus == FOCUS.respect)
			var gain = ns.formulas.gang.respectGain(gang_info, mem_info, t_info)
		else if (focus == FOCUS.money)
			var gain = ns.formulas.gang.moneyGain(gang_info, mem_info, t_info)
		if (gain > best_gain) {
			best_task = task
			best_gain = gain
		}
	}
	return best_task
}

/** @param {NS} ns */
function set_focus(ns, info, mem) {
	var mem_info = ns.gang.getMemberInformation(mem)
	// Gain territory power?
	if (info.power < POWER_LIMIT && mem_info.str_asc_mult >= ASCEND_POWER_THRESHOLD && mem_info.str_exp >= EXP_LIMIT) {
		ACTIONS[mem] = TERRITORY_TASK
		return
	}
	// General Threshold before moving to other endeavors
	if (mem_info.str_asc_mult < ASCEND_LIMIT || mem_info.str_exp < EXP_LIMIT)
		return
	// Focus Respect?
	if (info.respect < RESPECT_LIMIT)
		ACTIONS[mem] = get_best_task(ns, info, mem_info, FOCUS.respect)
	// Focus Money?
	ACTIONS[mem] = get_best_task(ns, info, mem_info, FOCUS.money)
	// gang member is maxed out. Buy equipment
	buy_equipment(ns, mem)
}

/** @param {NS} ns */
function buy_equipment(ns, mem) {
	for (var equip of ns.gang.getEquipmentNames()) {
		if (EQUIP_TYPES.includes(ns.gang.getEquipmentType(equip)) && ns.gang.getEquipmentCost(equip) < ns.getPlayer().money * 2) {
			if (ns.gang.purchaseEquipment(mem, equip)) {
				ns.print(`Bought ${equip} for ${mem}`)
			}
		}
	}
}

/** @param {NS} ns */
function is_wanted(ns, info) {
	//ns.print(`Wanted Level: ${info.wantedLevel} | Penalty: ${info.wantedPenalty}`)
	if (info.wantedLevel > 100 && (1 - info.wantedPenalty) * 100 > 10) {
		ns.print("Wanted level is too high: ", (1 - info.wantedPenalty) * 100)
		return true
	}
	ns.print("not wanted.")
	return false
}

/** @param {NS} ns */
function assign_task(ns, mem) {
	var cur_task = ns.gang.getMemberInformation(mem).task
	if (ACTIONS[mem] == null) {
		//ns.print(`Setting ${mem} to ${TRAINING_TASK}`)
		ACTIONS[mem] = TRAINING_TASK
		//ns.gang.setMemberTask(mem, TRAINING_TASK)
	} else if (ACTIONS[mem] == cur_task) {
		return
	}
	ns.gang.setMemberTask(mem, ACTIONS[mem])
}

/** @param {NS} ns 
 * Run Gang
 * - recruit members (at first there are 3) - Done
 * - start members on combat training - Done
 * - when members can 5x on ascention, ascend - Done
 * - if we have enough money, buy equipment for the members. - Done
 * - If the best respect gain can get us a new member in 5 minutes or less, start task to get new member - Done
 * - Keep an eye out for new members to recruit. - Done
 * - Augments?
 * - Crime for Money?
 * - Watching Wanted Level? - Done
 * - Territory Warfare
 * - Crime for Respect - when to stop?
 * - Rinse/Repeat
*/
export async function main(ns) {
	disable_logs(ns)
	while (true) {
		recruit(ns)
		var info = ns.gang.getGangInformation()
		var wanted = is_wanted(ns, info)
		for (var mem of ns.gang.getMemberNames()) {
			ascend(ns, mem)
			//buy_equipment(ns, mem)
			if (wanted)
				ACTIONS[mem] = WANTED_TASK
			else
			ACTIONS[mem] = null
			recruit_all(ns, info, mem)
			set_focus(ns, info, mem)
			assign_task(ns, mem)
			ns.print(`${mem}: ${ACTIONS[mem]}`)
		}
		if (info.power >= POWER_LIMIT && !info.territoryWarfareEngaged) {
			ns.gang.setTerritoryWarfare(true)
		} else if (info.power < POWER_LIMIT && info.territoryWarfareEngaged) {
			ns.gang.setTerritoryWarfare(false)
		}
		await ns.sleep(60 * 1000)
	}
}