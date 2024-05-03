/** @param {NS} ns */
// STILL UNDER DEVELOPMENT
function get_action(host) {
	var actions = ps(host)
	if (actions.length == 0) {
		print(host, " has no scripts.")
		return null
	}
	return actions[0].filename.replace("/scripts/", "").replace(".script", "")
}

export async function main(ns) {
	action = args[0]
	server = args[1]
	host = args[2]
	if (action == "hack") {
		script = "/scripts/hack.script"
	}
	else if (action == "grow") {
		script = "/scripts/grow.script"
	} else {
		script = "/scripts/weaken.script"
	}
	if (!serverExists(host)) {
		tprint(host + " does not exist. Exiting.")
		exit()
	}

	if (get_action(host) == action) {
		tprint(host + " is already executing action " + action)
		exit()
	}

	killall(host)
	exec("copy_scripts.script", host, 1, SERVER)
	threads = parseInt(getServerMaxRam(host) / getScriptRam(script))
	if (threads == 0) {
		tprint(host + " cannot run script. No RAM")
		exit()
	}
	exec(script, host, threads, server)
	tprint(action, " executed on ", host, " for ", server, " with ", threads, " threads")
}