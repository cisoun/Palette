const COLORS = [
	{ name: 'rosade',    hue: 0.08, chroma: 0.03 },
	{ name: 'orangeade', hue: 0.18, chroma: 0.02 },
	{ name: 'blueade',   hue: 0.7,  chroma: 0.02 },
	{ name: 'purplade',  hue: 0.8,  chroma: 0.04 },
	{ name: 'rosace',    hue: 0.94, chroma: 0.22 },
	{ name: 'rose',      hue: 0.02, chroma: 0.22 },
	{ name: 'red',       hue: 0.08, chroma: 0.22 },
	{ name: 'orange',    hue: 0.18, chroma: 0.22 },
	{ name: 'yellow',    hue: 0.24, chroma: 0.22 },
	{ name: 'lime',      hue: 0.34, chroma: 0.22 },
	{ name: 'green',     hue: 0.45, chroma: 0.22 },
	{ name: 'turquoise', hue: 0.52, chroma: 0.22 },
	{ name: 'water',     hue: 0.58, chroma: 0.22 },
	{ name: 'blue',      hue: 0.7,  chroma: 0.22 },
	{ name: 'purple',    hue: 0.8,  chroma: 0.22 }
];

const LEVELS = [
	0.02,
	0.08,
	0.15,
	0.25,
	0.50,
	0.65,
	0.75,
	0.82,
	0.88,
	0.90
];

const Palette = {
	create: function (palette, levels) {
		const data = {};
		for (const color of palette) {
			data[color.name] = [];
			for (const [i, level] of levels.entries()) {
				const rgb = Color.harmony(color.hue, level, 0.3, color.chroma, 0.2);
				//const cross = Color.crossover(rgb, level);
				data[color.name].push(Color.frgbToHex(...rgb));
			}
		}
		return data;
	}
};

const App = {
	ui: {},
	palette: null,
	root: null,
	timeout: null,

	init: function () {

		document.querySelectorAll('[id]').forEach(e => this.ui[e.id] = e)
		this.root = document.documentElement;
		this.ui.dark.onclick = () => this.root.classList.toggle('dark');
		this.update();
	},

	copyColor: function (value) {
		this.ui.message.innerHTML = `Copied ${value}`;
		this.ui.notification.classList.add('open');

		navigator.clipboard.writeText(value);

		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			this.ui.notification.classList.remove('open');
		}, 3000);
	},

	setCSSColor: function (name, value) {
		this.root.style.setProperty(`--${name}`, value);
	},

	update: function () {
		this.palette = Palette.create(COLORS, LEVELS);

		App.ui.palette.replaceChildren();

		for (const color in this.palette) {
			const levels = this.palette[color];

			const column = document.createElement('div');

			const title = document.createElement('div');
			title.innerHTML = color;
			column.appendChild(title);

			for (const [i, value] of levels.entries()) {
				App.setCSSColor(`${color}-${i}`, value);
				const row = document.createElement('div');
				row.classList.add('color');
				row.onclick = () => this.copyColor(value);
				row.style.backgroundColor = `var(--${color}-${i})`;
				column.appendChild(row);
			}
			App.ui.palette.appendChild(column);
		}
	},
};

App.init();
