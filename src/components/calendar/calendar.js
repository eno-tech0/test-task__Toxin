export default class Calendar {
	constructor({container, renderCalendar, renderInputs, applyInputs}) {
		this.now = new Date(); // Дата выбранная в календаре
		this.today = new Date(); // Сегодняшняя дата
		this.startDate;
		this.endDate;
		this.firstClick = true;
		this.containerSelector = container;
		this.container = document.querySelector(container);

		this.daysOfWeeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		this.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
		
		if (renderCalendar) this.onceRender();
		if (renderInputs) {
			this.renderInputs();
		}
		if (renderInputs || applyInputs) {
			this.startInput = document.querySelector(`${container} .start-input`);
			this.endInput = document.querySelector(`${container} .end-input`);
	
			this.startInput.addEventListener('click', () => this.onceRender());
			this.endInput.addEventListener('click', () => this.onceRender());
			this.position = true;
		}
	}

	onceRender() {
		const calendar = document.querySelector(`${this.containerSelector} .calendar`);
		if (calendar) {
			if (calendar.style.display == 'block') calendar.style.display = 'none';
			else calendar.style.display = 'block';
		} else {
			this.renderCalendar();
			this.renderDaysOfWeek();
			this.render();
		}
	}

	render() {
		document.querySelector(`${this.containerSelector} .calendar-title`).textContent = `${this.monthNames[this.now.getMonth()]} ${this.now.getFullYear()}`;
		this.renderDays();

		const prev = document.querySelector(`${this.containerSelector} .month-prev`);
		const next = document.querySelector(`${this.containerSelector} .month-next`);
		const applyBtn = document.querySelector(`${this.containerSelector} .apply-btn`);
		const clearBtn = document.querySelector(`${this.containerSelector} .clear-btn`);

		prev.addEventListener('click', () => this.prevMonth());
		next.addEventListener('click', () => this.nextMonth());
		applyBtn.addEventListener('click', () => this.confirmDate());
		clearBtn.addEventListener('click', () => this.clearDate());
	}

	renderCalendar() {
		const calendar = document.createElement('div');
		calendar.classList.add(`${this.containerSelector.slice(1)}`, 'calendar');
		calendar.style.display = 'block';

		calendar.innerHTML = `
		<div class="calendar-header">
			<div class="month-prev"></div>
			<h2 class="calendar-title"></h2>
			<div class="month-next"></div>
		</div>
		<div class="calendar-body">
			<div class="days-of-week"></div>
			<div class="days"></div>
		</div>
		<div class="calendar-footer">
			<button class="button none-active clear-btn">Очистить</button>
			<button class="button none-active apply-btn">Применить</button>
		</div>
		`;
		this.container.append(calendar);

		if (this.position) {
			this.container.style.position = 'relative';
			calendar.classList.add('position-calendar');
		}
	}

	renderInputs() {
		const inputsBody = document.createElement('div');
		inputsBody.classList.add('forms__date-selects');

		inputsBody.innerHTML = `
			<button class="input-with-arrow start-input">ДД.ММ.ГГГГ</button>
			<button class="input-with-arrow end-input">ДД.ММ.ГГГГ</button>
		`;

		this.container.append(inputsBody);
	}

	renderDays() {
		this.removeOld(`${this.containerSelector} .calendar-day`);

		const firstDay = new Date(this.now.getTime());
		const lastDay = new Date(this.now.getTime());

		firstDay.setDate(1);
		let day = firstDay.getDay();
		day == 0 ? day = 6 : day -= 1; // вс нулевой день в неделе, а в массиве - последний
		firstDay.setDate(firstDay.getDate() - day); // для отображения дней предыдущего месяца

		lastDay.setMonth(lastDay.getMonth() + 1);
		lastDay.setDate(1);
		lastDay.setDate(lastDay.getDate() - 1);

		while(firstDay < lastDay) {
			for (let i = 0; i < 7; i++) {
				const date = new Date(firstDay.getTime());
				date.setHours(0, 0, 0, 0);

				const elem = this.createDiv('calendar-day', document.querySelector(`${this.containerSelector} .calendar-body .days`));
				elem.textContent = firstDay.getDate();
				elem.setAttribute('id', date.getTime());
				
				elem.addEventListener('click', (e) => this.selectDays(e, date.getTime()));

				if (date.setHours(0, 0, 0, 0) == this.today.setHours(0, 0, 0, 0)) elem.classList.add('today');
				if (date.getMonth() != this.now.getMonth()) elem.classList.add('prev-day');

				firstDay.setDate(firstDay.getDate() + 1);
			} 
		}
	}

	renderDaysOfWeek() {
		this.removeOld(`${this.containerSelector} .days-of-week__item`)

		this.daysOfWeeks.forEach(item => {
			const day = this.createDiv('days-of-week__item', document.querySelector(`${this.containerSelector} .calendar-body .days-of-week`));
			day.textContent = item;
		})
	}

	selectDays(e, date) {
		const elem = e.target;

		if (this.firstClick && date) {
			if (this.endDate) {
				if (this.endDate < date) {
					this.startDate = this.endDate;
					this.endDate = date;
				} else this.startDate = date;
			} else this.startDate = date;

			this.firstClick = !this.firstClick;
		} else {
			if (date && this.endDate) {
				if (this.startDate > date) {
					this.endDate = this.startDate;
					this.startDate = date;
				} else this.endDate = date;
			} else {
				if (this.startDate > date) {
					this.endDate = this.startDate;
					this.startDate = date;
				} else this.endDate = date;
			}
			this.firstClick = !this.firstClick;
		}

		this.addDaysClasses();
	}

	addDaysClasses() {
		const elems = document.querySelectorAll(`${this.containerSelector} .calendar-day`);
		
		elems.forEach(item => {
			item.classList.remove('calendar-day_hover', 'calendar-day_active', 'calendar-day_selected-start', 'calendar-day_selected-end');

			if (!this.startDate && !this.endDate) {
				item.classList.remove('calendar-day_hover', 'calendar-day_active', 'calendar-day_selected');
			} else if (this.startDate && this.endDate) {
				let timeStart = this.startDate + 86400000;
				
				while (timeStart < this.endDate) {
					const rangeItem = document.getElementById(timeStart);
					rangeItem.classList.add('calendar-day_hover');
					timeStart += 86400000;
				}

				if (item.id == this.startDate || item.id == this.endDate) {
					item.classList.add('calendar-day_active');
					if (item.id == this.startDate) {
						item.classList.add('calendar-day_selected-start');
					} else {
						item.classList.add('calendar-day_selected-end');
					}
					if (item.id == this.startDate && item.id == this.endDate) {
						item.classList.remove('calendar-day_selected-start', 'calendar-day_selected-end');
					}
				} 

				if (item.classList.contains('today')) item.classList.remove('today');

			} else {
				if (item.id == this.startDate) {
					item.classList.add('calendar-day_active');
				}
			}
			if (item.id == this.today.setHours(0, 0, 0, 0) && 
				!item.classList.contains('calendar-day_hover') &&
				!item.classList.contains('calendar-day_active')) {
				item.classList.add('today');
			}
		});
	}

	nextMonth() {
		if (this.now.getMonth() >= 11) {
			this.now.setMonth(0);
			this.now.setFullYear(this.now.getFullYear() + 1);
		} else {
			this.now.setMonth(this.now.getMonth() + 1);
		}
		this.render();
	}

	prevMonth() {
		if (this.now.getMonth() <= 0) {
			this.now.setMonth(11);
			this.now.setFullYear(this.now.getFullYear() - 1);
		} else {
			this.now.setMonth(this.now.getMonth() - 1);
		}
		this.render();
	}

	confirmDate() {
		if (this.renderInputs) {
			const start = new Date(this.startDate);
			const end = new Date(this.endDate);

			this.startInput.textContent = this.createDateString(start);
			this.endInput.textContent = this.createDateString(end);
		}
	}

	clearDate() {
		const elems = document.querySelectorAll(`${this.containerSelector} .calendar-day`);
		elems.forEach(item => {
			item.classList.remove('calendar-day_hover', 'calendar-day_active', 'calendar-day_selected-start', 'calendar-day_selected-end');
		});
		this.startDate = null;
		this.endDate = null;
		this.firstClick = true;
		this.now = new Date();

		if (this.renderInputs) {
			this.startInput.textContent = 'ДД.ММ.ГГГГ';
			this.endInput.textContent = 'ДД.ММ.ГГГГ';
		}
	}

	createDateString(date) {
		return `${this.checkZero(date.getDate())}.${this.checkZero(date.getMonth())}.${date.getFullYear()}`;
	}

	checkZero(int) {
		if (int < 10) {
			return `0${int}`;
		} else return int;
	}

	removeOld(selector) {
		const oldDay = document.querySelectorAll(selector);
		if (oldDay.length > 0) oldDay.forEach(item => item.remove());
	}
	createDiv(selector, body) {
		const item = document.createElement('div');
		item.classList.add(selector);
		body.append(item);

		return item;
	}
}
