/** @param {NS} ns */
/*
Opens ports and 

*/
function disable_logs(ns) {
	var logs = ["scan", "run", 'getServerRequiredHackingLevel', 'getHackingLevel', "getServerNumPortsRequired", "fileExists", "hasRootAccess"]
	for (var i in logs) {
		ns.disableLog(logs[i])
	}
}

function run_hacks(ns, server, hacks_dict) {
	var hacks = 0
	for (var hack in hacks_dict) {
		if (hacks_dict[hack]) {
			hacks += 1
			switch (hack) {
				case "brute": ns.brutessh(server); break;
				case "ftp": ns.ftpcrack(server); break;
				case "http": ns.httpworm(server); break;
				case "sql": ns.sqlinject(server); break;
				case "smtp": ns.relaysmtp(server); break;
			}
		}
	}
	return hacks
}

export async function main(ns) {
	disable_logs(ns)
	var hacks_dict = {
		"brute": ns.fileExists("BruteSSH.exe"),
		"ftp": ns.fileExists("FTPCrack.exe"),
		"http": ns.fileExists("HTTPWorm.exe"),
		"sql": ns.fileExists("SQLInject.exe"),
		"smtp": ns.fileExists("relaySMTP.exe"),
	}
	var server = ns.args[0]

	// Running assumption that hacking level is high enough. This is checked in crawler.js
	ns.tprint(server, " hacking level:", ns.getServerRequiredHackingLevel(server))
	var req_ports = ns.getServerNumPortsRequired(server)
	if (req_ports > 0) {
		if (run_hacks(ns, server, hacks_dict) < req_ports) {
			ns.tprint("not enough ports open")
			ns.exit()
		}
	}
	ns.nuke(server)
	if (ns.hasRootAccess(server)) {
		ns.toast(server + " has been hacked")
		// installBackdoor(server) // Takes 32GB?
	}

}