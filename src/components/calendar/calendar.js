export default class Calendar {
	constructor() {
		this.now = new Date(); // Дата выбранная в календаре
		this.today = new Date(); // Сегодняшняя дата
		this.startDate;
		this.endDate;
		this.firstClick = true;

		this.calendarBody = document.querySelector('.calendar-body .days');
		this.daysOfWeekBody = document.querySelector('.calendar-body .days-of-week');
		this.monthNameBody = document.querySelector('.calendar-title');
		this.prev = document.querySelector('.month-prev');
		this.next = document.querySelector('.month-next');
		this.applyBtn = document.querySelector('.apply-btn');
		this.clearBtn = document.querySelector('.clear-btn');

		this.daysOfWeeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		this.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

		this.renderDaysOfWeek();
		this.renderCalendar();

		this.prev.addEventListener('click', () => this.prevMonth());
		this.next.addEventListener('click', () => this.nextMonth());
		this.applyBtn.addEventListener('click', () => this.confirmDate());
		this.clearBtn.addEventListener('click', () => this.clearDate());
		this.calendarBody.addEventListener('click', (e) => this.selectDays(e));
	}

	renderCalendar() {
		this.monthNameBody.textContent = `${this.monthNames[this.now.getMonth()]} ${this.now.getFullYear()}`;
		this.renderDays();
	}

	renderDays() {
		this.removeOld('.calendar-day');

		const firstDay = new Date(this.now.getTime());
		const lastDay = new Date(this.now.getTime());

		firstDay.setDate(1);
		let day = firstDay.getDay();
		day == 0 ? day = 6 : day -= 1; // вс нулевой день в неделе, а в массиве - посследний
		firstDay.setDate(firstDay.getDate() - day); // для отображения дней предыдущего месяца

		lastDay.setMonth(lastDay.getMonth() + 1);
		lastDay.setDate(1);
		lastDay.setDate(lastDay.getDate() - 1);

		while(firstDay < lastDay) {
			for (let i = 0; i < 7; i++) {
				const date = new Date(firstDay.getTime());
				date.setHours(0, 0, 0, 0);

				const elem = this.createDiv('calendar-day', this.calendarBody);
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
		this.removeOld('.days-of-week__item')

		this.daysOfWeeks.forEach(item => {
			const day = this.createDiv('days-of-week__item', this.daysOfWeekBody);
			day.textContent = item;
		})
	}

	selectDays(e, date) {
		const elem = e.target;
		const elems = document.querySelectorAll('.calendar-day');

		if (this.firstClick && date) {
			if (this.endDate) {
				if (this.endDate < date) {
					this.startDate = this.endDate;
					this.endDate = date;
				} else this.startDate = date;
			} else this.startDate = date;

			this.firstClick = !this.firstClick;
		} else {
			if (date) {
				if (this.startDate > date) {
					this.endDate = this.startDate;
					this.startDate = date;
				} else this.endDate = date;
				
				this.firstClick = !this.firstClick;
			}
		}

		elems.forEach(item => {
			item.classList.remove('hover', 'active-day', 'selected-day');

			if (!this.startDate && !this.endDate) {
				item.classList.remove('hover', 'active-day', 'selected-day');
			} else if (this.startDate && this.endDate) {
				let timeStart = this.startDate + 86400000;
				
				while (timeStart < this.endDate) {
					const rangeItem = document.getElementById(timeStart);
					rangeItem.classList.add('hover');
					timeStart += 86400000;
				}

				if (item.id == this.startDate || item.id == this.endDate) {
					item.classList.add('active-day');
					item.classList.remove('hover');
				} 

			} else {
				if (item.id == this.startDate) {
					item.classList.add('active-day');
				}
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
		this.renderCalendar();
	}

	prevMonth() {
		if (this.now.getMonth() <= 0) {
			this.now.setMonth(11);
			this.now.setFullYear(this.now.getFullYear() - 1);
		} else {
			this.now.setMonth(this.now.getMonth() - 1);
		}
		this.renderCalendar();
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
