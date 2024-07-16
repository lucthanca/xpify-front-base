
if (typeof window.xParseJSONOTSB !== 'function') {
  window.xParseJSONOTSB = (jsonString) => {
    jsonString = String.raw`${jsonString}`;
    jsonString = jsonString.replaceAll("\\","\\\\").replaceAll('\\"', '\"');

    return JSON.parse(jsonString);
  }
}
if (!window.otsb) {
  window.otsb = {};
}
if (!window.otsb.loadedScripts) {
  window.otsb.loadedScripts = [];
}
if (!window.otsb.loadedScript.includes('otsb-popup.js')) {
  window.otsb.loadedScript.push('otsb-popup.js');
  
  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('otsb_xPopups', (data) => ({
        enable: false,
        showMinimal: false,
        show: Shopify.designMode ? ( localStorage.getItem(data.name + '-' + data.sectionId)? xParseJSONOTSB(localStorage.getItem(data.name + '-' + data.sectionId)) : true ) : false,
        delayDays: data.delayDays ? data.delayDays : 0,
        t: '',
        copySuccess: false,
        init() {
          if (Shopify.designMode) {
            var _this = this;
            const handlePopupSelect = (event, isResize = null) => {
              if (event.detail && event.detail.sectionId.includes(data.sectionId) || isResize) {
                if (window.Alpine) {
                  _this.open();
                  localStorage.setItem(data.name + '-' + data.sectionId, JSON.stringify(true));
                } else {
                  document.addEventListener('alpine:initialized', () => {
                    _this.open();
                    localStorage.setItem(data.name + '-' + data.sectionId, JSON.stringify(true));
                  });
                }
              } else {
                if (window.Alpine) {
                  _this.closeSection();
                  localStorage.setItem(data.name + '-' + data.sectionId, JSON.stringify(false));
                } else {
                  document.addEventListener('alpine:initialized', () => {
                    _this.closeSection();
                    localStorage.setItem(data.name + '-' + data.sectionId, JSON.stringify(false));
                  });
                }
              }
            }

            document.addEventListener('shopify:section:select', (event) => {
              handlePopupSelect(event);
            });
  
            document.addEventListener('shopify:block:select', (event) => {
              handlePopupSelect(event);
            });

            //reload popup and display overlay when change screen in shopify admin
            if (data.name != 'popup-age-verification') {
              window.addEventListener('resize', (event)=> {
                handlePopupSelect(event, xParseJSONOTSB(localStorage.getItem(data.name + '-' + data.sectionId)));
              })
            }
          }
          console.log({ show: this.show, newLetterMessage: this.$el.querySelector('.newsletter-message'), $el: this.$el });
  
          if (this.$el.querySelector('.newsletter-message')) {
            this.open();
            return;
          }
        },
        load() {
          //optimize popup load js
          if (window.location.pathname === '/challenge') return;

          const _this= this;
          if (Shopify.designMode) {
            _this.open();
          } else {
            if (data.name == 'popup-promotion' && !this.handleSchedule() && data.showCountdown) return;

            // if (data.name == 'popup-promotion' && document.querySelector("#x-age-popup") && xParseJSONOTSB(localStorage.getItem('popup-age-verification')) == null) {
            //   document.addEventListener("close-age-verification", () => {
            //     setTimeout(() => {
            //       _this.open();
            //     }, data.delays * 1000);
            //   })
            //   return;
            // }

            setTimeout(() => {
              _this.open();
            }, data.delays * 1000);
          }
        },
        open() {
          if (!Shopify.designMode && this.isExpireSave() && !this.show) return;

          var _this = this;
          if (data.name == 'popup-age-verification') {
            if (this.isExpireSave() && !Shopify.designMode && !data.show_popup) return;

            requestAnimationFrame(() => {
              document.body.classList.add("overflow-hidden");
              Alpine.store('xPopup').open = true;
            });
          }

          //Show minimal when
          // 1. enable show minimal on desktop + default style = minimal + window width >= 768
          // 2. enable show minimal on mobile + default style mobile = minimal + window width < 768
          if ((data.showMinimal && data.default_style == "minimal" && window.innerWidth >= 768) 
            || (data.showMinimalMobile && data.default_style_mobile == "minimal" && window.innerWidth < 768)) {
            _this.showMinimal = true;
            _this.show = false;
            if (Shopify.designMode) {
              localStorage.setItem(data.name + '-' + data.sectionId, JSON.stringify(false));
              _this.removeOverlay();
            }
          } else {
            //Show full popup
            if (data.showOnMobile && window.innerWidth < 768 || window.innerWidth >= 768) {
              //Show a full popup for the first time accessing the site; if the customer closes the full popup, display a minimal popup during the session
              if (localStorage.getItem('current-' + data.sectionId) == 'minimal') {
                _this.showMinimal = true;
                _this.show = false;
                _this.removeOverlay();
              } else {
                _this.show = true;
                _this.showMinimal = false;
                _this.setOverlay();
                if (!Shopify.designMode) {
                  _this.saveDisplayedPopup();
                }
              }
            } else {
              //Show nothing when screen < 768 and disable show popup on mobile
              _this.removeOverlay();
            }
          }
        },
        close() {
          if (data.name == 'popup-age-verification') {
            requestAnimationFrame(() => {
              document.body.classList.remove("overflow-hidden");
              Alpine.store('xPopup').open = false;
            });
            document.dispatchEvent(new Event('close-age-verification'));
          }
        var _this = this;
          if (Shopify.designMode) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                _this.showMinimal = true;
              }, 300);
            });
          } else {
            this.removeDisplayedPopup();
            if ((data.showMinimal && window.innerWidth >= 768) || (data.showMinimalMobile && window.innerWidth < 768)) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  _this.showMinimal = true;
                }, 300);
                //Save storage data when closing the full popup (the full popup only shows for the first time accessing the site).
                localStorage.setItem('current-' + data.sectionId, 'minimal');
              });
            } else {
              if (!this.isExpireSave()) {
                this.setExpire()
              }
            }
          }
          requestAnimationFrame(() => {
            setTimeout(() => {
              _this.show = false;
              _this.removeOverlay();
            }, 300);
          });
        },
        closeSection() {
          this.show = false;
          this.showMinimal = false;
          this.removeOverlay();
        },
        setExpire() {
          const item = {
            section: data.sectionId,
            expires: Date.now() + this.delayDays * 24 * 60 * 60 * 1000
          }
          
          localStorage.setItem(data.sectionId, JSON.stringify(item))
          //remove storage data, the full popup will be displayed when the site applies the reappear rule.
          localStorage.removeItem('current-' + data.sectionId);
        },
        isExpireSave() {
          const item = xParseJSONOTSB(localStorage.getItem(data.sectionId));
          if (item == null) return false;

          if (Date.now() > item.expires) {
            localStorage.removeItem(data.sectionId);
            return false;
          }

          return true;
        },
        handleSchedule() {
          if (data.showCountdown) {
            let el = document.getElementById('x-promotion-' + data.sectionId);
            let settings = xParseJSONOTSB(el.getAttribute('x-countdown-data'));
            if (!Alpine.store('xHelper').canShow(settings)) {
              if (!Shopify.designMode && data.schedule_enabled) {
                requestAnimationFrame(() => {
                  this.show = false;
                });

                return false;
              }
            }
          }

          this.enable = true;
          return true;
        },
        clickMinimal() {
          requestAnimationFrame(() => {
            this.show = true;
            this.showMinimal = false;
            if (!Shopify.designMode) {
              this.saveDisplayedPopup()
            }
            this.setOverlay();
          })
        },
        setOverlay() {
          let popupsDiv = document.querySelector("#otsb-popup-exit-intent");
          if (popupsDiv.classList.contains('bg-[#acacac]')) return
          if (data.overlay) {
            popupsDiv.className += ' bg-[#acacac] bg-opacity-30';
          }
        },
        removeOverlay() {
          let popupsDiv = document.querySelector("#otsb-popup-exit-intent")
            displayedPopups = xParseJSONOTSB(localStorage.getItem("promotion-popup")) || [];
          if (popupsDiv.classList.contains('bg-[#acacac]') && displayedPopups.length == 0) {
            popupsDiv.classList.remove('bg-[#acacac]', 'bg-opacity-30');
          }
        },
        //close minimal popup will set expired
        closeMinimal() {
          this.showMinimal = false;
          if (Shopify.designMode) return

          if (!this.isExpireSave()) this.setExpire();
        },
        saveDisplayedPopup() {
          let localStorageArray = xParseJSONOTSB(localStorage.getItem('promotion-popup')) || [];
          if (!localStorageArray.some(item => item == data.name + '-' + data.sectionId)) {
            localStorageArray.push(data.name + '-' + data.sectionId);
            localStorage.setItem('promotion-popup', JSON.stringify(localStorageArray));
          }
        },
        removeDisplayedPopup() {
          let localStorageArray = xParseJSONOTSB(localStorage.getItem('promotion-popup')),
            updatedArray = localStorageArray.filter(item => item != data.name + '-' + data.sectionId);
          localStorage.setItem('promotion-popup', JSON.stringify(updatedArray));
        },
      }))
    })
  })
}
if (!window.otsb.loadedScripts.includes('otsb-flashsales.js')) {
  window.otsb.loadedScripts.push('otsb-flashsales.js');
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
if (!window.otsb.loadedScripts.includes('coupon-code.js')) {
  window.otsb.loadedScripts.push('coupon-code.js');
  
  requestAnimationFrame(() => {
    document.addEventListener("alpine:init", () => {
      Alpine.data("otsb_xCounponCodeList", (sectionId) => ({
        loading: true,
        load() {
          this.loading = true;
          let url = `${window.location.pathname}?section_id=${sectionId}`;
          fetch(url, {
            method: 'GET'
          }).then(
            response => response.text()
          ).then(responseText => {
            const html = (new DOMParser()).parseFromString(responseText, 'text/html');
            const contentId = `x-promo-code-list-${sectionId}`;
            const newContent = html.getElementById(contentId);
            if (newContent && !document.getElementById(contentId)) {
              container.appendChild(newContent);
            }
            this.loading = false;
          })
        }
      }));
      
      Alpine.data("otsb_xCounponCode", () => ({
        coppySuccess: false,
        loading: false,
        disableCoupon: false,
        disableComing: false,
        discountCode: "",
        errorMessage: false,
        appliedDiscountCode: false,
        load(discountCode) {
          this.setAppliedButton(discountCode)
          document.addEventListener(`eurus:cart:discount-code:change`, (e) => {
            this.setAppliedButton(discountCode)
          })
        },
        copyCode() {
          if (this.coppySuccess) return;

          const discountCode = this.$refs.code_value.textContent.trim();
          navigator.clipboard.writeText(discountCode).then(
            () => {
              this.coppySuccess = true;

              setTimeout(() => {
                this.coppySuccess = false;
              }, 5000);
            },
            () => {
              alert('Copy fail');
            }
          );
        },
        applyCouponCode(discountCode, isCart=false) {
          let appliedDiscountCodes = JSON.parse(JSON.stringify(Alpine.store('otsb_xCounponCodeDetail').appliedDiscountCodes))
          if (discountCode && appliedDiscountCodes.indexOf(discountCode) != -1) {
            return true;
          }
          if (discountCode) {
            let discountCodes = appliedDiscountCodes.length > 0 ? [...appliedDiscountCodes, discountCode].join(",") : discountCode;
            document.cookie = `eurus_discount_code=${discountCodes}; path=/`;

            this.loading = true;

            fetch(`/checkout?discount=${discountCodes}`)
            .then(() => {
              fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  "sections":  Alpine.store('xCartHelper').getSectionsToRender().map((section) => section.id)
                }),
              }).then(response=>{
                return response.json();
              }).then((response) => {
                if (response.status != '422') {
                  Alpine.store('xCartHelper').getSectionsToRender().forEach((section => {
                    const sectionElement = document.querySelector(section.selector);
                    if (sectionElement) {
                      if (response.sections[section.id])
                        sectionElement.innerHTML = getSectionInnerHTML(response.sections[section.id], section.selector);
                    }
                  }));

                  Alpine.store('otsb_xCounponCodeDetail').appliedDiscountCodes.push(discountCode)
                  Alpine.store('xCartHelper').currentItemCount = parseInt(document.querySelector('#cart-icon-bubble span').innerHTML);
                  document.dispatchEvent(new CustomEvent(`eurus:cart:discount-code:change`));
                  if (isCart == false) {
                    this.setAppliedButton(discountCode)
                    if (Alpine.store('xCartHelper').currentItemCount == 0) {
                      const elementError = this.$el.closest('.promo-code-item').querySelector('.error-message');
                      this.errorMessage = true;
                      elementError.classList.remove('hidden', 'opacity-0');
                      elementError.classList.add('block', 'opacity-100');
  
                      setTimeout(function() {
                        elementError.classList.remove('block', 'opacity-100');
                        elementError.classList.add('hidden', 'opacity-0');
                      }, 3000);
                    } else {
                      this.errorMessage = false;
                      Alpine.store('xMiniCart').openCart();
                    }
                  }
                }
              }).finally(() => {
                this.loading = false;
              });
            })
            .catch(function(error) {
              console.error('Error:', error);
            })
          }
        },
        handleScheduleCoupon(el) {
          let settings = xParseJSONOTSB(el.getAttribute('x-countdown-data'));
          let timeSettings = Alpine.store('xHelper').handleTime(settings);
          if (timeSettings.distance < 0 && settings.set_end_date) {
            this.disableCoupon = true;
          } else if ( timeSettings.startTime > timeSettings.now) {
            this.disableCoupon = true;
            this.disableComing = true;
          }
        },
        onChange() {
          this.discountCode = this.$el.value;
        },
        applyDiscountToCart() {
          this.applyCouponCode(this.discountCode, true);
        },
        setAppliedButton(discountCode) {
          let appliedDiscountCodes = JSON.parse(JSON.stringify(Alpine.store('otsb_xCounponCodeDetail').appliedDiscountCodes))
          if (discountCode && appliedDiscountCodes.indexOf(discountCode) != -1) {
            this.appliedDiscountCode = true;
          } else {
            this.appliedDiscountCode = false;
          }
        }
      }));

      Alpine.store('otsb_xCounponCodeDetail', {
        show: false,
        promoCodeDetail: {},
        sectionID: "",
        discountCodeApplied: "",
        appliedDiscountCodes: [],
        cachedResults: [],
        loading: false,
        cartEmpty: true,
        handleCouponSelect(shopUrl) {
          var _this = this;
          const promoCodeDetail = JSON.parse(JSON.stringify(this.promoCodeDetail));
  
          document.addEventListener('shopify:section:select', function(event) {
            if (event.target.classList.contains('section-promo-code') == false) {
              if (window.Alpine) {
                _this.close();
              } else {
                document.addEventListener('alpine:initialized', () => {
                  _this.close();
                });
              }
            }
          })

          if(promoCodeDetail && promoCodeDetail.blockID && promoCodeDetail.sectionID) {
            this.promoCodeDetail = xParseJSONOTSB(document.getElementById('x-data-promocode-' + promoCodeDetail.blockID).getAttribute('x-data-promocode'));
            let contentContainer = document.getElementById('PromoCodeContent-' + this.promoCodeDetail.sectionID);
            if (this.cachedResults[this.promoCodeDetail.blockID]) {
              contentContainer.innerHTML = this.cachedResults[this.promoCodeDetail.blockID];
              return true;
            }
            if (this.promoCodeDetail.page != '') {
              let url = `${shopUrl}/pages/${this.promoCodeDetail.page}`;
              fetch(url, {
                method: 'GET'
              }).then(
                response => response.text()
              ).then(responseText => {
                const html = (new DOMParser()).parseFromString(responseText, 'text/html');
                contentContainer.innerHTML = html.querySelector(".page__container .page__body").innerHTML;
              })
            } else if (this.promoCodeDetail.details != '') {
              contentContainer.innerHTML = this.promoCodeDetail.details;
              contentContainer.innerHTML = contentContainer.textContent;
            }
          }
        },
        load(el, blockID, shopUrl) {
          this.promoCodeDetail = xParseJSONOTSB(el.closest('#x-data-promocode-' + blockID).getAttribute('x-data-promocode'));
          let contentContainer = document.getElementById('PromoCodeContent-' + this.promoCodeDetail.sectionID);
          this.sectionID = this.promoCodeDetail.sectionID;
          if (this.cachedResults[blockID]) {
            contentContainer.innerHTML = this.cachedResults[blockID];
            return true;
          }
          if (this.promoCodeDetail.page != '') {
            this.loading = true;
            let url = `${shopUrl}/pages/${this.promoCodeDetail.page}`;
            fetch(url, {
              method: 'GET'
            }).then(
              response => response.text()
            ).then(responseText => {
              const html = (new DOMParser()).parseFromString(responseText, 'text/html');
              const content = html.querySelector(".page__container .page__body").innerHTML;
              contentContainer.innerHTML = content;
              this.cachedResults[blockID] = content;
            }).finally(() => {
              this.loading = false;
            })
          } else if (this.promoCodeDetail.details != '') {
            contentContainer.innerHTML = this.promoCodeDetail.details;
            contentContainer.innerHTML = contentContainer.textContent;
          }
        },
        showPromoCodeDetail() {
          this.show = true;
          Alpine.store('xPopup').open = true;
        },
        close() {
          this.show = false;
          Alpine.store('xPopup').open = false;
        },
        getDiscountCode() {
          let cookieValue = document.cookie.match('(^|;)\\s*' + 'eurus_discount_code' + '\\s*=\\s*([^;]+)');
          let appliedDiscountCodes = cookieValue ? cookieValue.pop() : '';
          if (appliedDiscountCodes) {
            this.appliedDiscountCodes = appliedDiscountCodes.split(",");
          }
        }
      });
    });
  });
}
if (!window.otsb.loadedScripts.includes('otsb-event-calendar')) {
  window.otsb.loadedScripts.push('otsb-event-calendar');
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