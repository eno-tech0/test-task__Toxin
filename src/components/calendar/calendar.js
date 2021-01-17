export default class Calendar {
	constructor() {
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
		this.monthNameBody.textContent = `${this.monthNames[this.month]} ${this.year}`;
		this.renderDays();
	}

	renderDays() {
		this.removeOld('.calendar-day')

		for (let i = 1; i <= 35; i ++) {
			this.createDiv('calendar-day', this.calendarBody);

			const newDays = document.querySelectorAll('.calendar-day');
			let firstDay = new Date(this.year, this.month, 1).getDay();
			if (firstDay > 0) firstDay -= 1;
			else firstDay = 6;

			const daysOfMonth = new Date(this.year, this.month + 1, 0).getDate();

			for (let j = firstDay; j <= daysOfMonth + firstDay - 1; j++) {
				if (newDays.length == 35) {
					newDays[j].textContent = j - firstDay + 1;
					if (newDays[j].innerText == this.day && this.month == this.now.getMonth()) newDays[j].classList.add('today');
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
			target.classList.toggle('active-day');
		}

		const activeDays = document.querySelectorAll('.calendar-day.active-day'),
				calendarDays = document.querySelectorAll('.calendar-day');

		if (activeDays.length <= 2 && activeDays.length > 0) {
			this.calendarBody.addEventListener('mousemove', this.setHoverEffect);
		} else {
			calendarDays.forEach(item => item.classList.remove('hover'));
			this.calendarBody.removeEventListener('mousemove', this.setHoverEffect);
			activeDays[0].classList.remove('active-day');
		}
	}

	clearDate() {
		const calendarDays = document.querySelectorAll('.calendar-day');

		calendarDays.forEach(item => item.classList.remove('hover', 'active-day'));
	}

	setHoverEffect(e) {
		const target = e.target;
		if (!target.classList.contains('active-day', 'today')) {
			target.classList.add('hover');
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