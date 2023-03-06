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
	ui: null,
	palette: null,
	timeout: null,

	init: function () {
		this.ui = UI.init();
		this.ui.dark.onclick = () => UI.toggleClass(UI.root, 'dark');
		this.update();
	},

	copyColor: function (value) {
		navigator.clipboard.writeText(value);
		this.notify(`Copied ${value}`);
	},

	notify: function (message) {
		this.ui.message.html = message;
		this.ui.notification.class = 'open';

		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			this.ui.notification.removeClass('open');
		}, 3000);
	},

	update: function () {
		const palette = this.ui.palette;

		this.palette = Palette.create(COLORS, LEVELS);

		palette.clear();
		palette.addChild(UI.Element());

		for (let i = 0; i < LEVELS.length; i++) {
			palette.addChild(UI.create({
				html: i.toString(),
				klass: 'level'
			}));
		}

		palette.addChild(UI.Element());

		for (const color in this.palette) {
			const levels = this.palette[color];

			palette.addChild(UI.create({
				html: color,
				klass: 'name'
			}));

			for (const [i, value] of levels.entries()) {
				UI.setVariable(`${color}-${i}`, value);

				const cell   = UI.Element();
				cell.class   = 'color';
				cell.onclick = () => this.copyColor(value);
				cell.style.backgroundColor = `var(--${color}-${i})`;

				palette.addChild(cell);
			}

			const button   = UI.Button();
			button.html    = '<svg viewBox="0 0 24 24"><use href="#iconMoreVert"></svg>';
			button.onclick = () => this.copyColors();

			palette.addChild(button);
		}
	},
};

App.init();
