function ensureId(product) {
	if (product.id == null) {
		product.id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
	}
	return product;
}

export class ProductList {
	constructor(products = []) {
		this.products = Array.isArray(products) ? products.map(ensureId) : [];
	}

	// File I/O is not available in browser; these methods throw when used in browser builds.
	static async fromJSONFile() {
		throw new Error('fromJSONFile is not available in the browser build');
	}

	async saveToJSONFile() {
		throw new Error('saveToJSONFile is not available in the browser build');
	}

	add(product) {
		const p = ensureId({ ...product });
		this.products.push(p);
		return p;
	}

	getById(id) {
		return this.products.find((p) => String(p.id) === String(id)) || null;
	}

	updateById(id, patch) {
		const idx = this.products.findIndex((p) => String(p.id) === String(id));
		if (idx === -1) return null;
		this.products[idx] = { ...this.products[idx], ...patch };
		return this.products[idx];
	}

	removeById(id) {
		const idx = this.products.findIndex((p) => String(p.id) === String(id));
		if (idx === -1) return false;
		this.products.splice(idx, 1);
		return true;
	}

	search(query, fields = ['name', 'description']) {
		if (!query) return [...this.products];
		const q = String(query).toLowerCase();
		return this.products.filter((p) =>
			fields.some((f) => {
				const v = p[f];
				return v != null && String(v).toLowerCase().includes(q);
			})
		);
	}

	sortBy(field, direction = 'asc') {
		const dir = direction === 'desc' ? -1 : 1;
		const copy = [...this.products];
		copy.sort((a, b) => {
			const va = a[field];
			const vb = b[field];
			if (va == null && vb == null) return 0;
			if (va == null) return -1 * dir;
			if (vb == null) return 1 * dir;
			if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
			return String(va).localeCompare(String(vb)) * dir;
		});
		return copy;
	}

	paginate(page = 1, perPage = 10, list = null) {
		const arr = Array.isArray(list) ? list : this.products;
		const total = arr.length;
		const p = Math.max(1, parseInt(page, 10) || 1);
		const pp = Math.max(1, parseInt(perPage, 10) || 10);
		const start = (p - 1) * pp;
		const data = arr.slice(start, start + pp);
		return { page: p, perPage: pp, total, totalPages: Math.ceil(total / pp), data };
	}

	toJSON() {
		return JSON.parse(JSON.stringify(this.products));
	}
}

export default ProductList;

