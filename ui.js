const UI = {
	root: document.documentElement,

	create: (args = {}) => {
		const e = UI.createElement(args.tag || 'div');
		if (args.html)  e.html = args.html;
		if (args.klass) e.class = args.klass;
		return e;
	},
	createElement: (tag = 'div') => UI.wrap(document.createElement(tag)),
	from: (id) => document.getElementById(id),
	init: () => {
		const o = {};
		document.querySelectorAll('[id]').forEach(e => o[e.id] = UI.wrap(e));
		return o;
	},
	wrap: (e) => {
		e.addChild    = (c) => UI.addChild(e, c);
		e.addClass    = (c) => UI.addClass(e, c);
		e.clear       = ()  => UI.clear(e);
		e.removeClass = (c) => UI.removeClass(e, c);
		e.setClass    = (e) => UI.setClass(e, c);
		e.toggleClass = (c) => UI.toggleClass(e, c);
		Object.defineProperty(e, 'class', {
			get()  {return this.className},
			set(x) { this.className = x },
		});
		Object.defineProperty(e, 'html', {
			get()  {return this.innerHTML},
			set(x) { this.innerHTML = x },
		});
		return e;
	},

	addChild:    (e, c) => e.appendChild(c),
	addClass:    (e, c) => e.classList.add(c),
	clear:       (e)    => e.innerHTML = '',
	removeClass: (e, c) => e.classList.remove(c),
	setClass:    (e, c) => e.className = c,
	setHTML:     (e, h) => e.innerHTML = h,
	toggleClass: (e, c) => e.classList.toggle(c),

	setVariable: (n, v) => UI.root.style.setProperty(`--${n}`, v),

	/* Objects */
	Button:  () => UI.createElement('button'),
	Element: () => UI.createElement(),
};
