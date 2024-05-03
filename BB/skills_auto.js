
/** @param {NS} ns */
export async function UpgradeSkills(ns) {
	var points = ns.bladeburner.getSkillPoints()
	var skillUpgradeName = null
	var skillUpgradeCost = Infinity
	for (var skill of ns.bladeburner.getSkillNames()) {
		var sCost = ns.bladeburner.getSkillUpgradeCost(skill)
		if (sCost <= points && sCost < skillUpgradeCost) {
			skillUpgradeName = skill
			skillUpgradeCost = sCost
		}
	}

	// If skill has been noted as upgradeable, upgrade skill
	if (skillUpgradeName != null) {
		var result = ns.bladeburner.upgradeSkill(skillUpgradeName)
		if (result) {
			ns.toast(`${skillUpgradeName} upgraded`)
			return true
		} else {
			ns.tprint(`CRITICAL: ${skillUpgradeName} failed to upgrade. Points: ${points}. Required Points: ${ns.bladeburner.getSkillUpgradeCost(skillUpgradeName)}`)
			return false
		}
	}
	return false

}


/** @param {NS} ns */
export async function main(ns) {
	var auto = ns.args[0] || false
	do {
		var count = 100
		while (count > 0) {
			if (!UpgradeSkills(ns)) {
				break
			}
			count = count - 1
		}
		if (auto) await ns.sleep(60000)
	} while (auto)
	ns.print("Exiting")
}