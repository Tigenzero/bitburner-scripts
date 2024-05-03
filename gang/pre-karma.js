/** @param {NS} ns */
export async function main(ns) {
	while (ns.heart.break() > -54000){
		ns.print(`Karma: ${ns.heart.break()}`)
		await ns.sleep(60*1000)
	}
	ns.tprint("Karma over 54K. Starting Gang.")
	ns.run("gang/start-gang.js")
}