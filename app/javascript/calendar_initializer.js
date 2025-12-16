import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja';

/**
 * FullCalendarのインスタンスを生成し、指定された要素に描画する。
 * @param {HTMLElement} element - カレンダーを描画するDOM要素
 * @param {Array} events - カレンダーに表示するイベントの配列
 * @returns {Calendar} FullCalendarのインスタンス
 */
function initializeCalendar(element, events) {
  const calendar = new Calendar(element, {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    locale: jaLocale,
    timeZone: 'Asia/Tokyo',
    buttonText: {
      today: '今日',
      month: '月',
    },
    events: events,
  });

  calendar.render();
  return calendar;
}

/**
 * barba.jsから呼び出されるための初期化関数。
 * @param {HTMLElement} container - barba.jsが管理するコンテナ要素
 */
export function initCalendar(container) {
  const calendarEl = container.querySelector('#calendar');
  if (calendarEl && calendarEl.dataset.calendarEventsValue) {
    const events = JSON.parse(calendarEl.dataset.calendarEventsValue);
    initializeCalendar(calendarEl, events);
  }
}