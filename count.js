const fs = require('fs')

function load(folder, cnt) {
	const map = new Map()
	for (let i = 0; i < cnt; ++i) {
		const fData = fs
			.readFileSync(`${folder}out${i}.txt`)
			.toString()
			.split('\n')

		for (const line of fData) {
			if (map.has(line)) {
				const current = map.get(line)
				current.files.add(i)
				current.unique = false
			} else {
				map.set(line, {
					files: new Set().add(i),
					unique: true,
				})
			}
		}
	}

	return map
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
		const lines = load('./full/', 20).entries()
		console.log('Unique values:', uniqueValues(lines))
		console.log('Exist in at least ten:', existInAtLeastTen(lines))
		console.log('Exist in all files:', existInAllFiles(lines))
	} catch (e) {
		console.log(e)
	}
}

start()
