// FullCalendarの本体
import { Calendar } from '@fullcalendar/core'
// カレンダーを月表示や週表示のマス目形式表示のプラグイン
import dayGridPlugin from '@fullcalendar/daygrid'
// 日付をクリックしたり、ドラッグしたりの操作を可能にするプラグイン
import interactionPlugin from '@fullcalendar/interaction'
// カレンダーの文字を日本語にする
import jaLocale from '@fullcalendar/core/locales/ja';

/**
 * これはJSDocというコードの説明書き
 * 
 * FullCalendarのインスタンスを生成し、指定された要素に描画する。
 * @param {HTMLElement} element - カレンダーを描画するDOM要素
 * @param {Array} events - カレンダーに表示するイベントの配列
 * @returns {Calendar} FullCalendarのインスタンス
 */
function initializeCalendar(element, events) {
  const calendar = new Calendar(element, {
    plugins: [dayGridPlugin, interactionPlugin],
    // 最初に表示するカレンダーを月表示に
    initialView: 'dayGridMonth',
    // 上部表示のナビボタンの配置設定
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    // 日本語に
    locale: jaLocale,
    timeZone: 'Asia/Tokyo',
    buttonText: {
      today: '今日',
      month: '月',
    },
    // 予定の配列を渡す
    events: events,
  });

  // 上記設定に基づいて実際にカレンダーを表示
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
    try {
      const events = JSON.parse(calendarEl.dataset.calendarEventsValue);
      initializeCalendar(calendarEl, events);
    } catch (e) {
      console.error("カレンダーイベントのJSONパースに失敗しました:", e);
    }
  }
}