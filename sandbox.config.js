module.exports = {
	showMenu: true,
	events: {
		"start": [[
			32,
			null,
			":akashic",
			{
				"type": "start",
				"parameters": {
					"totalTimeLimit": 92
				}
			}
		]],
		"start (easy)": [[
			32,
			null,
			":akashic",
			{
				"type": "start",
				"parameters": {
					"totalTimeLimit": 92,
					"difficulty": 1
				}
			}
		]],
		"start (normal)": [[
			32,
			null,
			":akashic",
			{
				"type": "start",
				"parameters": {
					"totalTimeLimit": 92,
					"difficulty": 4
				}
			}
		]],
		"start (hard)": [[
			32,
			null,
			":akashic",
			{
				"type": "start",
				"parameters": {
					"totalTimeLimit": 92,
					"difficulty": 8
				}
			}
		]],
		"start_fixed_seed": [[
			32,
			null,
			":akashic",
			{
				"type": "start",
				"parameters": {
					"totalTimeLimit": 92,
					"randomSeed": 10
				}
			}
		]]
	}
}
