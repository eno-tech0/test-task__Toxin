export default class Calendar {
	constructor(isVisible) {
		this.isVisible = isVisible;
		this.now = new Date();
		this.year = this.now.getFullYear();
		this.month = this.now.getMonth();
		this.dayOfWeek = this.now.getDay();
		this.day = this.now.getDate();
		this.date = new Date(this.year, this.month, 1);
		this.calendarBody = document.querySelector('.calendar-body .days');
		this.daysOfWeekBody = document.querySelector('.calendar-body .days-of-week');
		this.monthNameBody = document.querySelector('.calendar-title');
		this.prev = document.querySelector('.month-prev');
		this.next = document.querySelector('.month-next');
		this.daysOfWeeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		this.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
		this.renderDaysOfWeek();
		this.renderCalendar();

		this.prev.addEventListener('click', () => this.prevMonth());
		this.next.addEventListener('click', () => this.nextMonth());
		this.calendarBody.addEventListener('click', (e) => this.selectDays(e));
	}

	renderCalendar() {
		this.monthNameBody.textContent = `${this.monthNames[this.month]} ${this.year}`;
		this.renderDays();
	}

	renderDays() {
		this.removeOld('.calendar-day')

		for (let i = 1; i <= 42; i ++) {
			this.createDiv('calendar-day', this.calendarBody);

			const newDays = document.querySelectorAll('.calendar-day');
			let firstDay = new Date(this.year, this.month, 1).getDay();
			if (firstDay > 0) firstDay -= 1;
			else firstDay = 6;

			for (let j = firstDay; j <= new Date(this.year, this.month + 1, 0).getDate() + firstDay - 1; j++) {
				if (newDays.length == 42) {
					newDays[j].textContent = j - firstDay + 1;
					if (newDays[j].innerText == this.day) newDays[j].classList.add('today');
				}
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

	selectDays(e) {
		const target = e.target;
		if (target.classList.contains('calendar-day')) {
			target.classList.add('active-day');
		}
	}

	nextMonth() {
		if (this.month >= 11) {
			this.month = 0;
			this.year++;
		} else {
			this.month++;
		}
		this.renderCalendar();
	}

	prevMonth() {
		if (this.month <= 0) {
			this.month = 11;
			this.year--;
		} else {
			this.month--;
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