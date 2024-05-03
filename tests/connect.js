/** @param {NS} ns */
function get_connections(ns, dest) {
	let args = ns.args
	// let dest = args[0]
	var servers = [["home", []]]
	var serv_set = ["home"]
	var i = 0
	// ns.tprint(servers)
	while (i < servers.length) {
		var tuple = servers[i]
		// ns.tprint(tuple)
		let server = tuple[0]
		let parents = tuple[1]
		if (server == dest){
			return parents
		}
		// parents.push(server)
		var n_p = [...parents]
		n_p.push(server)
		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			// check if we've seen this server
			if (serv_set.indexOf(con) < 0) {
				serv_set.push(con)
				servers.push([con, n_p])
			}
		}
		i += 1
	}
}
export async function main(ns) {
	var server = ns.args[0]
	var parents = get_connections(ns, server)
	for (var i in parents){
		ns.connect(parents[i]) // need a source code!!!! Source-File 4!
	}
	// ns.tprint(parents)
	// ns.connect("joesguns")
	
	
}