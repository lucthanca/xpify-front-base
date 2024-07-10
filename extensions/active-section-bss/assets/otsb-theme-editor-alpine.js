if (!window.otsb_designMode) {
  window.otsb_designMode = {};
}
if (!window.otsb_designMode.loadedScripts) {
  window.otsb_designMode.loadedScripts = [];
}
if (!window.otsb_designMode.loadedScripts.includes('otsb-flashsales.js')) {
  windows.otsb_designMode.loadedScripts.push('otsb-flashsales.js');
  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.store('xHelper', {
        /**
         * Calculates the countdown distance and adjusts the end time if necessary.
         * @param {Object} configs - The configuration object.
         * @param {Date} initialEndTime - The initial end time.
         * @param {Date} endTime - The current end time.
         * @param {Date} currentDateTime - The current date and time.
         * @returns {Array} An array containing the countdown distance and the adjusted end time.
        */
        calculateCountdownDistance(configs, initialEndTime, endTime, deadline) {
          const now = deadline;
          let distance = endTime - now;
          if (distance < 0 && configs.next_timer > 0) {
            if (configs.loop_next_timer === true) {
              const cycleTime = (configs.next_timer + 1) * 1000;
              const timeElapsedSinceInitialEnd = now - initialEndTime;
              const cyclesElapsed = Math.floor(timeElapsedSinceInitialEnd / cycleTime);
              endTime = initialEndTime + (cyclesElapsed + 1) * cycleTime;
              distance = endTime - now;
            } else {
              endTime = initialEndTime + configs.next_timer * 1000;
              distance = endTime - now;
            }
          }
          return [distance, endTime];
        },
        countdown(configs, callback) {
          const calculateAdjustedTime = function (date, tz) {
            return date.getTime() + (-1 * tz * 60 - date.getTimezoneOffset()) * 60 * 1000;
          }
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          );
          const initialEndTime = calculateAdjustedTime(endDate, configs.timezone);
          let endTime = initialEndTime;

          let startTime;
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            );
            startTime = calculateAdjustedTime(startDate, configs.timezone);
          } else {
            startTime = new Date().getTime();
          }
          let last = 0;
          let that = this;
          function updateCountdown () {
            const now = new Date().getTime();
            let distance = -1;
            [distance, endTime] = that.calculateCountdownDistance(configs, initialEndTime, endTime, now);
            if (distance < 0 || startTime > now) {
              callback(false, 0, 0, 0, 0);
              return;
            }
            if (!last || now - last >= 1000) {  
              const days = Math.floor(distance / (1000 * 60 * 60 * 24));
              const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              callback(true, seconds.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), hours, days);
              last = now;
            }
            requestAnimationFrame(updateCountdown);
          }
          requestAnimationFrame(updateCountdown);
        },
        canShow(configs) {
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          );
          const initialEndTime = endDate.getTime() + (-1 * configs.timezone * 60 - endDate.getTimezoneOffset()) * 60 * 1000;
          let endTime = initialEndTime;

          let startTime;
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            );
            startTime = startDate.getTime() + (-1 * configs.timezone * 60 - startDate.getTimezoneOffset()) * 60 * 1000;
          } else {
            startTime = new Date().getTime();
          }
          const now = new Date().getTime();
          let distance = -1;
          [distance, endTime] = this.calculateCountdownDistance(configs, initialEndTime, endTime, now);
          if (distance < 0 || startTime > now) {
            return false;
          }
          return true;
        },
        handleTime(configs) {
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          );
          const initialEndTime = endDate.getTime() + (-1 * configs.timezone * 60 - endDate.getTimezoneOffset()) * 60 * 1000;
          let endTime = initialEndTime;

          let startTime;
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            );
            startTime = startDate.getTime() + (-1 * configs.timezone * 60 - startDate.getTimezoneOffset()) * 60 * 1000;
          } else {
            startTime = new Date().getTime();
          }
          const now = new Date().getTime();
          let distance = -1;
          [distance, endTime] = this.calculateCountdownDistance(configs, initialEndTime, endTime, now);
          return { "startTime": startTime, "endTime": endTime, "now": now, "distance": distance};
        }
      });
    });
  });
}
if (!window.otsb_designMode.loadedScripts.includes('otsb-event-calendar')) {
  window.otsb_designMode.loadedScripts.push('otsb-event-calendar');
  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('xEventCalendar', (event) => ({
        open: false,
        eventDetails: {},
        addToCal(options) {
          let link = "";
          let timeEnd = ""
          this.eventDetails = event;

          if(!event) {
            this.eventDetails = JSON.parse(JSON.stringify(Alpine.store("xEventCalendarDetail").eventDetail))
          }

          let timeStart = this.handleTime(this.eventDetails.start_year, this.eventDetails.month, this.eventDetails.day, this.eventDetails.start_hour, this.eventDetails.start_minute, options);

          if (this.eventDetails.show_end_date) {
            timeEnd = this.handleTime(this.eventDetails.end_year, this.eventDetails.end_month, this.eventDetails.end_day, this.eventDetails.end_hour, this.eventDetails.end_minute, options);
          }
          else if (this.eventDetails.show_end_time) {
            timeEnd = this.handleTime(this.eventDetails.start_year, this.eventDetails.month, this.eventDetails.day, this.eventDetails.end_hour, this.eventDetails.end_minute, options);
          }
          else {
            timeEnd = timeStart;
          }

          switch (options) {
            case 'apple':
              this.createDownloadICSFile(0, timeStart, timeEnd, this.eventDetails.title, this.eventDetails.details, this.eventDetails.location, "apple");
              break;
            case 'google':
              link = "http://www.google.com/calendar/event?action=TEMPLATE&trp=false" + "&text=" + encodeURIComponent(this.eventDetails.title) + "&dates=" + timeStart + "/" +  timeEnd + "&location=" + encodeURIComponent(this.eventDetails.location) + "&details=" + encodeURIComponent(this.eventDetails.details);
              window.open(link);
              break;
            case 'outlook':
              link = "https://outlook.live.com/calendar/action/compose?rru=addevent" + "&startdt=" + timeStart + "&enddt=" + timeEnd + "&subject=" + encodeURIComponent(this.eventDetails.title) + "&location=" + encodeURIComponent(this.eventDetails.location) + "&body=" + encodeURIComponent(this.eventDetails.details);
              window.open(link)
              break;
            case 'yahoo':
              link = "http://calendar.yahoo.com/?v=60" + "&st=" + timeStart + "&et=" +  timeEnd + "&title=" + encodeURIComponent(this.eventDetails.title);
              window.open(link)
              break;
            case 'ical':
              this.createDownloadICSFile(0, timeStart, timeEnd, this.eventDetails.title, this.eventDetails.details, this.eventDetails.location, "ical");
              break;
            default:
              console.log(`Sorry, error`);
          }
        },
        handleTime(year,month,day,hour,minute,options) {
          let date = new Date();

          if (options == 'google' || options == 'yahoo') {
            date = new Date(Date.UTC(year, this.getMonthNumber(month), parseInt(day), parseInt(hour), parseInt(minute)));
            date.setTime(date.getTime() + (-1 * parseInt(this.eventDetails.timezone) * 60 - date.getTimezoneOffset()) * 60 * 1000)
            return date.toISOString().split("Z")[0].replace(".000", "").replace(/[^A-Z0-9]/ig, "");
          } else {
            date = new Date(year, this.getMonthNumber(month), parseInt(day), parseInt(hour), parseInt(minute));
            date.setTime(date.getTime() + (-1 * parseInt(this.eventDetails.timezone) * 60 - date.getTimezoneOffset()) * 60 * 1000)
            if ( options == 'apple' ) {
              return date.toISOString().split("Z")[0].replace(".000", "").replace(/[^A-Z0-9]/ig, "");
            } else {
              return date.toISOString();
            }
          }
        },
        getMonthNumber(month) {
          return new Date(`${month} 1, 2022`).getMonth();
        },
        createDownloadICSFile(timezone, timeStart, timeEnd, title, description, location, type) {
          let icsBody = "BEGIN:VCALENDAR\n" +
                  "VERSION:2.0\n" +
                  "PRODID:Calendar\n" +
                  "CALSCALE:GREGORIAN\n" +
                  "METHOD:PUBLISH\n" +
                  "BEGIN:VTIMEZONE\n" +
                  "TZID:" + timezone + "\n" +
                  "END:VTIMEZONE\n" +
                  "BEGIN:VEVENT\n" +
                  "SUMMARY:" + title + "\n" +
                  "UID:@Default\n" +
                  "SEQUENCE:0\n" +
                  "STATUS:CONFIRMED\n" +
                  "TRANSP:TRANSPARENT\n" +
                  "DTSTART;TZID=" + timezone + ":" + timeStart + "\n" +
                  "DTEND;TZID=" + timezone + ":" + timeEnd + "\n" +
                  "LOCATION:" + location + "\n" +
                  "DESCRIPTION:" + description + "\n" +
                  "END:VEVENT\n" +
                  "END:VCALENDAR\n";

          this.download(title + ".ics", icsBody, type);
        },
        download(filename, fileBody, type) {
          var element = document.createElement("a");

          if (type == "ical") {
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(fileBody));
          } else if (type == "apple") {
            var file = new Blob([fileBody], { type: "text/calendar;charset=utf-8"})
            element.href = window.URL.createObjectURL(file)
          }

          element.setAttribute("download", filename);
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      }));

      Alpine.store('xEventCalendarDetail', {
        show: false,
        eventDetail: {},
        handleEventSelect() {
          var _this = this;
          const eventDetail = JSON.parse(JSON.stringify(this.eventDetail));

          document.addEventListener('shopify:section:select', function(event) {
            if (event.target.classList.contains('section-event-calendar') == false) {
              if (window.Alpine) {
                _this.close();
              } else {
                document.addEventListener('alpine:initialized', () => {
                  _this.close();
                });
              }
            }
          })

          if(eventDetail && eventDetail.blockID && eventDetail.sectionID) {
            this.eventDetail = xParseJSONOTSB(document.getElementById('x-data-event-' + eventDetail.blockID).getAttribute('x-event-data'));
            let element = document.getElementById('EventDescription-' + this.eventDetail.sectionID);
            element.innerHTML = this.eventDetail.description;
            element.innerHTML = element.textContent;
          }
        },
        load(el, blockID) {
          this.eventDetail = xParseJSONOTSB(el.closest('#x-data-event-' + blockID).getAttribute('x-event-data'));
          let element = document.getElementById('EventDescription-' + this.eventDetail.sectionID);
          this.sectionID = this.eventDetail.sectionID;
          element.innerHTML = this.eventDetail.description;
          element.innerHTML = element.textContent;
          this.showEventCalendarDetail();
        },
        showEventCalendarDetail() {
          this.show = true;
          Alpine.store('xPopup').open = true;
        },
        close() {
          this.show = false;
          Alpine.store('xPopup').open = false;
        }
      });
    });
  });
}

function otsbXmapRefreshMapPosition(selector, screen_md, content_position, isContent = true) {
  const targetEl = document.querySelector(selector);
  if (!targetEl) {
    console.error('OT: Map initialized failed.');
    return;
  }
  const invalid = document.documentElement.clientWidth < screen_md;
  if (content_position === 'top-left' || invalid) {
    targetEl.style.width = '100%';
    if (isContent) targetEl.style.display = 'none';
    return;
  }

  const rect = targetEl.parentNode.getBoundingClientRect();
  let right = rect.right;
  let space = document.documentElement.clientWidth - right;
  const compare_position = isContent ? 'left' : 'right';
  if (content_position === compare_position) {
    left = rect.left;
    space = left;
    targetEl.style.left = `-${space}px`;
  }
  
  let width = '100%';
  if (space > 0) {
    width = `calc(100% + ${space}px)`;
  }
  targetEl.style.width = width;

  if (isContent) {
    if (space > 0) {
      targetEl.style.display = 'block';
    } else {
      targetEl.style.display = 'none'
    };
  }
}