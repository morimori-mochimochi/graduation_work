import { Controller } from "@hotwired/stimulus"
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja';

// Connects to data-controller="calendar"
export default class extends Controller {
  static values = { events: Array }

  connect() {
    const calendarEl = this.element;

    const calendar = new Calendar(calendarEl, {
      // --- プラグイン ---
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',

      // --- 表示設定 ---
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      },
      locale: jaLocale, // 日本語化
      timeZone: 'Asia/Tokyo', // 日本のタイムゾーンに設定
      buttonText: {
        today: '今日',
        month: '月',
      },

      // --- イベントデータ ---
      events: this.eventsValue,
    });

    calendar.render();
  }
}