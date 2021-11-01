const readline = require('readline')
const fs = require('fs')

async function load(folder, cnt) {
	try {
		const container = []
		const map = new Map()
		for (let i = 0; i < cnt; ++i) {
			const fStream = fs.createReadStream(`${folder}out${i}.txt`)
			const rl = readline.createInterface({
				input: fStream,
				crlfDelay: Infinity,
			})

			container.push(new Array())
			for await (const line of rl) {
				container[i].push(line)
			}
		}

		for (let i = 0; i < container.length; ++i) {
			for (let j = 0; j < container[i].length; ++j) {
				if (map.has(container[i][j])) {
					const current = map.get(container[i][j])
					current.files.add(i)
					current.unique = false
				} else {
					map.set(container[i][j], {
						files: new Set().add(i),
						unique: true,
					})
				}
			}
		}

		return map
	} catch (e) {
		console.log(e)
		return null
	}
}

function uniqueValues(map) {
	let cnt = 0
	for (const [key, value] of map) {
		cnt += +value.unique
	}
	return cnt
}

function existInAtLeastTen(map) {
	let cnt = 0
	for (const [key, value] of map) {
		cnt += +(value.files.size > 9)
	}
	return cnt
}

function existInAllFiles(map) {
	let cnt = 0
	for (const [key, value] of map) {
		cnt += +(value.files.size == 20)
	}
	return cnt
}

async function start() {
	try {
		const lines = await load('./full/', 20)
		console.log('Unique values:', uniqueValues(lines.entries()))
		console.log(
			'Exist in at least ten:',
			existInAtLeastTen(lines.entries())
		)
		console.log('Exist in all files:', existInAllFiles(lines.entries()))
	} catch (e) {
		console.log(e)
	}
}

start()
