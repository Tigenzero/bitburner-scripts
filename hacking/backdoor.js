import * as connect from "super-connect.js"
/** @param {NS} ns */
export async function main(ns) {
	var server = ns.args[0]
	connect.connect(ns, connect.super_connect(ns, server), server)
	try {
		var promise = ns.singularity.installBackdoor()
		await promise
		ns.tprint("Backdoor installed.")
	} finally {
		ns.singularity.connect("home")
		ns.tprint("Exiting.")
	}
}