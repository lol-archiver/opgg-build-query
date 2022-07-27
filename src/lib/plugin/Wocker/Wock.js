class Wock {
	constructor(url, logInfo, logError) {
		this.url = url;

		this.ping = false;
		this.opening = false;

		this.handles_type = {
			$open: [],
			ping: [wock => wock.cast('pong')],
		};
		this.keysHandlesOnce = new Set();

		this.logInfo = typeof logInfo == 'function' ? logInfo : () => { };
		this.logError = typeof logError == 'function' ? logError : () => { };
	}

	/**
	 * @param {string} reason 原因
	 * @returns {Wock}
	 */
	open(reason) {
		if(this.opening) { return; }

		this.wock = new WebSocket(this.url);

		let pingOut;
		let timeOut;
		let outCount = 0;

		let oneOff = false;
		let closeHandle = (reason, ...params) => {
			if(oneOff) { return; }

			oneOff = true;

			this.logInfo(`Wock已关闭，原因：${reason || '无'}`, ...params);

			if(this.ping) {
				clearTimeout(pingOut);
				clearTimeout(timeOut);
			}

			this.opening = false;

			if(this.reopen) {
				setTimeout(async () => {
					await this.open('重连');

					if(typeof this.reopen == 'function') {
						this.reopen(this);
					}
				}, 4000);
			}
		};

		this.wock.addEventListener('error', e => closeHandle('错误', e));
		this.wock.addEventListener('close', e => closeHandle('关闭连接', e));

		return new Promise(resolve => {
			this.wock.addEventListener('open', () => {
				this.opening = true;

				this.logInfo(`Wock已打开，原因：${reason ?? '无'}，URL：${this.url}`);

				this.wock.cast = (type, ...data) => {
					try {
						this.wock.send(JSON.stringify({ type, data }));
					}
					catch(error) {
						if(error.message.indexOf('CLOSED') == -1) {
							this.logError(error.stack);
						}
					}
				};

				let check = (clearCount = true) => {
					clearTimeout(pingOut);
					clearTimeout(timeOut);

					if(clearCount) {
						outCount = 0;
					}

					pingOut = setTimeout(() => {
						this.wock.cast('ping');

						timeOut = setTimeout(() => {
							outCount++;

							if(outCount >= 4) {
								this.wock.close();
							}
							else {
								check(false);
							}
						}, 24000);
					}, 10000);
				};

				this.wock.addEventListener('message', async raw => {
					if(this.ping) { check(); }

					let event = {};
					try {
						event = JSON.parse(raw.data);
					}
					catch(error) { return; }

					const type = event.type;
					const handles = this.handles_type[type];
					if(type && handles) {
						for(let id = 1; id <= handles.length; id++) {
							const handle = handles[id - 1];

							try {
								if(event.data instanceof Array) {
									await handle(...event.data, this.wock);
								}
								else {
									await handle(event.data, this.wock);
								}

								if(this.keysHandlesOnce.has(`${type}:${id + 1}`)) {
									this.del(type, id + 1);
								}
							} catch(error) {
								if(error instanceof Error) {
									(console || {}).error(error.message);
									(console || {}).error(error.stack);
								}
								else {
									(console || {}).error(error);
								}
							}

						}
					}
				});

				if(this.ping) { check(); }

				this.handles_type.$open.forEach((handle, id) => {
					if(!handle) { return; }
					setTimeout(() => handle(this), 0);
					if(this.keysHandlesOnce.has(`$open:${id + 1}`)) {
						this.del('$open', id + 1);
					}
				});


				resolve(this);
			});
		});
	}

	add(type, handle) {
		if(!type && !(handle instanceof Function)) { return 0; }

		const handles = this.handles_type[type] ?? (this.handles_type[type] = []);

		return handles.push(handle);
	}
	one(type, handle) {
		if(!type && !(handle instanceof Function)) { return 0; }

		const id = this.add(type, handle);

		this.keysHandlesOnce.add(`${type}:${id}`);

		return id;
	}
	del(type, id) {
		const handles = this.handles_type[type];

		if(!type || !handles || id > handles.length || !~~id) { return false; }

		const handle = handles[id - 1];

		handles[id - 1] = false;

		return handle;
	}


	cast(type, ...data) { return this.wock.cast(type, ...data); }
	onec(type, handle, ...data) {
		const id = this.one(type, handle);

		this.cast(type, ...data);

		return id;
	}
	addc(type, handle, ...data) {
		const id = this.add(type, handle);

		this.cast(type, ...data);

		return id;
	}
	at(type, handle, once = false) {
		if(type == 'open' && this.opening) {
			setTimeout(() => handle(), 0);
		}
		else if(once) {
			return this.one(`$${type}`, handle);
		}
		else {
			return this.add(`$${type}`, handle);
		}
	}


	get(type, id) {
		return this.handles_type[type]?.[id - 1];
	}
	run(type, id, ...data) {
		const handle = this.handles_type[type]?.[id - 1];

		if(handle instanceof Function) { return handle(...data); }
	}
}

export default Wock;