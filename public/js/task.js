class Base {
	static create() {
		console.warn("Not Support Method");
	}
	static remove() {
		console.warn("Not Support Method");
	}
	static update() {
		console.warn("Not Support Method");
	}
}

class BaseModel extends Base {
	static task = {
		checkTime: "check_time",
		createTime: "create_time",
		updateTime: "update_time",
		listTime: "list_time",
		IIG: "iig"
	};
	static fetchAPI(method, body) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await fetch("/api/admin/do", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ method, ...body }),
				});

				const json = await data.json();

				if (!json.success) return reject(json);

				resolve(json);
			} catch (e) {
				reject(e);
			}
		});
	}
}
