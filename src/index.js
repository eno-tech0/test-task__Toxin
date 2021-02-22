
import './assets/fonts/fonts.scss';
import './index.scss';
import './pagesUI/wrapper/wrapper.scss';
import './components/components-style';
import './blocks/blocks-style';
import './pagesUI/cards/index.scss';
import './pagesUI/color-type/index.scss';
import './pagesUI/form-elements/index.scss';
import './pagesUI/headers-footers/index.scss';

import Calendar from './components/calendar/calendar';

new Calendar({
	container: '.search-of-numbers',
	applyInputs: true
})
new Calendar({
	container: '.booking-form',
	applyInputs: true
})
new Calendar({
	container: '.calendar-here',
	renderCalendar: true
});

