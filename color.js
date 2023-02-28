const Color = {
	gamma: function (x) {
		return x > 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x;
	},

	oklabToRGB: function (l, a, b) {
		const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
		const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
		const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
		const L = l_ * l_ * l_;
		const M = m_ * m_ * m_;
		const S = s_ * s_ * s_;

		return [
			255 * this.gamma(+4.0767245293 * L - 3.3072168827 * M + 0.2307590544 * S),
			255 * this.gamma(-1.2681437731 * L + 2.6093323231 * M - 0.3411344290 * S),
			255 * this.gamma(-0.0041119885 * L - 0.7034763098 * M + 1.7068625689 * S)
		];
	},

	frgbToHex: function (r, g, b) {
		r = r > 255 ? 255 : r < 0 ? 0 : r;
		g = g > 255 ? 255 : g < 0 ? 0 : g;
		b = b > 255 ? 255 : b < 0 ? 0 : b;
		return '#' + [r, g, b].map(e => Math.floor(e).toString(16).padStart(2, 0)).join('');
	},

	/**
	 * Crossover effect.
	 *
	 * Apply a vintage photo effect on the given colors.
	 *
	 * It consists of raising the brighter red/green tones and lowering the darkers.
	 * Blue tones are also raised a bit.
	 */
	crossover: function (rgb, level) {
		return [
			rgb[0] + 0.4 * (Math.sin(2 * Math.PI * (level - 0.5)) * 0.1 * 255),
			rgb[1] + 0.4 * (Math.sin(2 * Math.PI * (level - 0.5)) * 0.06 * 255),
			rgb[2] + 0.4 * ((1 - level) * 0.08 * 255)
		];
	},

	/**
	 * Harmony algorithm.
	 *
	 * Create a palette of a given amount of steps for a specific hue.
	 * The chroma and luminance values can be changed as well.
	 *
	 * As the Lab chromatic space set every color to the same luminance, yellow
	 * tones tend to look a bit washed out. The yellow preservation parameter
	 * allows you to rectify this issue.
	 *
	 * Arguments:
	 *   hue (float):        Hue value from 0.0 to 1.0.
	 *   step (float):       Step value from 0.0 (dark) to 1.0 (light).
	 *   ypres (float):      Yellow preservation value from 0.0 to 1.0.
	 *                       Add more luminance to the yellow tones.
	 *                       0.7 provides good results for brighter results.
	 *   baseChroma (float): Base chroma value from 0.0 to 1.0.
	 *   baseLumi (float):   Base luminance value from 0.0 to 1.0.
	 */
	harmony: function (hue, step, ypres = 0.0, baseChroma = 0.22, baseLumi = 0.3) {
		// Shift dark tones toward blue.
		let u = hue - 0.2;
		if (u <= 0) u += 1;

		let d = u - 0.5;
		//let d = 0.3; // Max shift.
		if (hue - 0.2 <= 0)
			d = -d;

		//const blueShift = (0.7 - hue) * (1 - step) * -0.4;
		const blueShift = d * (1 - step) * 0.3;

		const h = 2 * Math.PI * hue + blueShift;

		const c = Math.max(baseChroma * Math.sin((step + 0.2) * Math.PI * 0.85), 0);// * (0.9 - Math.cos(hue * Math.PI * 2) * 0.2);
		const a = c * Math.cos(h);
		const b = c * Math.sin(h);

		const varL = Math.max(ypres * Math.sin(hue * Math.PI * 2), 0) * step;
		//const l = (baseLumi + varL) * (1 - step) + step;
		//const l = (baseLumi + varL) + easeOutSine(step) * (1 - baseLumi - varL);
		const l = (baseLumi + varL) + step * (1 - baseLumi - varL) * 1.1;

		return this.oklabToRGB(l, a, b);
	}
};
