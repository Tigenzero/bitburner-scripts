/** @param {NS} ns */


export async function execute_crime(ns, event, crime) {
	ns.tprint("Starting " + crime)
	while (true) {
		if (event && event.key == "ArrowRight") {
			ns.exit()
		}
		if (ns.isBusy()) {
			ns.tprint("Is Busy")
			await ns.sleep(3000)
		} else {
			ns.commitCrime(crime)
		}

	}
}

export async function main(ns) {
	var crime = ns.args[0]
	if (ns.isBusy()) {
		ns.tprint("You are already busy")
		ns.exit()
	}
	
	while (true) {
		if (ns.isBusy()) {
			await ns.sleep(3000)
		} else {
			ns.commitCrime(crime)
		}

	}
	// addEventListener("keydown", execute_crime(ns, event, crime), true)

}