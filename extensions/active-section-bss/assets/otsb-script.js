window.otsb = {
  sliderScript: 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.3/dist/js/splide.min.js',
  loadedScript: window?.otsb?.loadedScript || [],
  components: {
    splides: {},
  },
};
if (typeof window.xParseJSONOTSB != 'function') {
  window.xParseJSONOTSB = (jsonString) => {
    jsonString = String.raw`${jsonString}`;
    jsonString = jsonString.replaceAll('\\', '\\\\').replaceAll('\\"', '"');

    return JSON.parse(jsonString);
  };
}
if (typeof window.deferScriptLoadOTSB != 'function') {
  window.deferScriptLoadOTSB = (name, src, onload, requestVisualChange = false) => {
    window.otsb.loadedScript.push(name);

    ((events) => {
      const loadScript = () => {
        events.forEach((type) => window.removeEventListener(type, loadScript));
        clearTimeout(autoloadScript);

        const initScript = () => {
          const script = document.createElement('script');
          script.setAttribute('src', src);
          script.setAttribute('defer', '');
          script.onload = () => {
            document.dispatchEvent(new CustomEvent(`otsb__${name}-loaded`));
            onload();
          };

          document.head.appendChild(script);
        };

        if (requestVisualChange) {
          if (window.requestIdleCallback) {
            requestIdleCallback(initScript);
          } else {
            requestAnimationFrame(initScript);
          }
        } else {
          initScript();
        }
      };

      let autoloadScript;
      if (Shopify.designMode) {
        loadScript();
      } else {
        const wait = window.innerWidth > 767 ? 2000 : 5000;
        events.forEach((type) => window.addEventListener(type, loadScript, { once: true, passive: true }));
        autoloadScript = setTimeout(() => {
          loadScript();
        }, wait);
      }
    })(['touchstart', 'mouseover', 'wheel', 'scroll', 'keydown']);
  };
}
requestAnimationFrame(() => {
  document.addEventListener('alpine:init', () => {
    Alpine.store('otsb_xCartAnalytics', {
      viewCart() {
        fetch('/cart.js')
          .then((response) => {
            return response.text();
          })
          .then((cart) => {
            cart = JSON.parse(cart);
            if (cart.items.length > 0) {
              Shopify.analytics.publish('view_cart', { cart: cart });
            }
          });
      },
    });
    Alpine.store('otsb_xModal', {
      activeElement: '',
      setActiveElement(element) {
        this.activeElement = element;
      },
      focus(container, elementFocus) {
        Alpine.store('otsb_xFocusElement').trapFocus(container, elementFocus);
      },
      removeFocus() {
        const openedBy = document.getElementById(this.activeElement);
        Alpine.store('otsb_xFocusElement').removeTrapFocus(openedBy);
      },
    });
    Alpine.store('otsb_xFocusElement', {
      focusableElements: ['button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'],
      listeners: {},
      trapFocus(container, elementFocus) {
        if (window.innerWidth < 1025) return;

        let c = document.getElementById(container);
        let e = document.getElementById(elementFocus);
        this.listeners = this.listeners || {};
        const elements = Array.from(c.querySelectorAll(this.focusableElements));
        var first = elements[0];
        var last = elements[elements.length - 1];

        this.removeTrapFocus();

        this.listeners.focusin = (event) => {
          if (event.target !== c && event.target !== last && event.target !== first) {
            return;
          }
          document.addEventListener('keydown', this.listeners.keydown);
        };

        this.listeners.focusout = () => {
          document.removeEventListener('keydown', this.listeners.keydown);
        };

        this.listeners.keydown = (e) => {
          if (e.code.toUpperCase() !== 'TAB') return;

          if (e.target === last && !e.shiftKey) {
            e.preventDefault();
            first.focus();
          }

          if ((e.target === first || e.target == c) && e.shiftKey) {
            e.preventDefault();
            last.focus();
          }
        };
        document.addEventListener('focusout', this.listeners.focusout);
        document.addEventListener('focusin', this.listeners.focusin);
        e.focus();
      },
      removeTrapFocus(elementToFocus = null) {
        if (window.innerWidth < 1025) return;

        document.removeEventListener('focusin', () => {
          document.addEventListener('keydown', this.listeners.focusin);
        });
        document.removeEventListener('focusout', () => {
          document.removeEventListener('keydown', this.listeners.focusout);
        });
        document.removeEventListener('keydown', this.listeners.keydown);
        if (elementToFocus) elementToFocus.focus();
      },
    });
    Alpine.store('xPopup', {
      open: false,
    });
    Alpine.store('xScrollPromotion', {
      load(el) {
        let scroll = el.getElementsByClassName('el_animate');
        for (let i = 0; i < scroll.length; i++) {
          scroll[i].classList.add('animate-scroll-banner');
        }
      },
    });
    Alpine.store('xCustomerEvent', {
      fire(eventName, el, data) {
        if (Shopify.designMode) return;

        const formatedData = data ? data : xParseJSONOTSB(el.getAttribute('x-customer-event-data'));
        Shopify.analytics.publish(eventName, formatedData);
      },
    });
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
        };
        let endDate = new Date(configs.end_year, configs.end_month - 1, configs.end_day, configs.end_hour, configs.end_minute);
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
        function updateCountdown() {
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
        let endDate = new Date(configs.end_year, configs.end_month - 1, configs.end_day, configs.end_hour, configs.end_minute);
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
        let endDate = new Date(configs.end_year, configs.end_month - 1, configs.end_day, configs.end_hour, configs.end_minute);
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
        return { startTime: startTime, endTime: endTime, now: now, distance: distance };
      },
    });
    Alpine.data('xParallax', () => ({
      debounce(func, wait) {
        var timeout;
        return function () {
          var context = this,
            args = arguments;
          var later = function () {
            timeout = null;
            func.apply(context, args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },
      load(disable) {
        if (disable) return;

        if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
          const observerOptions = {
            root: null,
            rootMargin: '0px 0px',
            threshold: 0,
          };

          var observer = new IntersectionObserver(handleIntersect, observerOptions);
          var el;
          function handleIntersect(entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                el = entry.target;
                window.addEventListener('scroll', parallax, { passive: true, capture: false });
              } else {
                window.removeEventListener('scroll', parallax, { passive: true, capture: false });
              }
            });
          }

          observer.observe(this.$el);

          var parallax = this.debounce(function () {
            var rect = el.getBoundingClientRect();
            var speed = (window.innerHeight / el.parentElement.offsetHeight) * 20;
            var shiftDistance = (rect.top - window.innerHeight) / speed;
            var maxShiftDistance = el.parentElement.offsetHeight / 11;

            if (shiftDistance < -maxShiftDistance || shiftDistance > maxShiftDistance) {
              shiftDistance = -maxShiftDistance;
            }

            el.style.transform = 'translate3d(0, ' + shiftDistance + 'px, 0)';
          }, 10);
        }
      },
    }));
    Alpine.store('xVideo', {
      ytIframeId: 0,
      vimeoIframeId: 0,
      externalListened: false,
      play(el) {
        let video = el.getElementsByClassName('otsb-video')[0];
        if (!video && el.closest('.otsb-contain-video')) {
          video = el.closest('.otsb-contain-video').getElementsByClassName('otsb-video')[0];
        }
        if (video) {
          if (video.tagName == 'IFRAME') {
            this.externalPostCommand(video, 'play');
          } else if (video.tagName == 'VIDEO') {
            video.play();
          }
        }
      },
      pause(el) {
        let video = el.getElementsByClassName('otsb-video')[0];
        if (!video && el.closest('.otsb-contain-video')) {
          video = el.closest('.otsb-contain-video').getElementsByClassName('otsb-video')[0];
        }
        if (video) {
          if (video.tagName == 'IFRAME') {
            this.externalPostCommand(video, 'pause');
          } else if (video.tagName == 'VIDEO') {
            video.pause();
          }
        }
      },
      mp4Thumbnail(el) {
        const videoContainer = el.closest('.otsb-external-video');
        const imgThumbnail = videoContainer.getElementsByClassName('otsb-img-thumbnail')[0];
        const buttonPlay = videoContainer.getElementsByClassName('otsb-button-play')[0];
        const video = videoContainer.getElementsByClassName('otsb-video')[0];
        if (imgThumbnail) {
          imgThumbnail.classList.add('hidden');
        }
        if (buttonPlay) {
          buttonPlay.classList.add('hidden');
        }
        if (video) {
          video.setAttribute('controls', '');
        }
        this.play(videoContainer);
      },
      externalLoad(el, host, id, loop, title, controls = 1) {
        let src = '';
        let pointerEvent = '';
        if (host == 'youtube') {
          src = `https://www.youtube.com/embed/${id}?mute=1&playlist=${id}&autoplay=1&playsinline=1&enablejsapi=1&modestbranding=1&rel=0&controls=${controls}&showinfo=${controls}`;
        } else {
          src = `https://player.vimeo.com/video/${id}?muted=1&autoplay=1&playsinline=1&api=1&controls=${controls}`;
        }

        if (controls == 0) {
          pointerEvent = ' pointer-events-none';
        }
        requestAnimationFrame(() => {
          const videoContainer = el.closest('.otsb-external-video');
          videoContainer.innerHTML = `<iframe data-video-loop="${loop}" class="otsb-iframe-video absolute w-full h-full otsb-video top-1/2 -translate-y-1/2 ${pointerEvent}"
                frameborder="0" host="${host}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen playsinline
                src="${src}" title="${title}"></iframe>`;

          videoContainer.querySelector('.otsb-iframe-video').addEventListener('load', () => {
            setTimeout(() => {
              this.play(videoContainer);

              if (host == 'youtube') {
                this.ytIframeId++;
                videoContainer.querySelector('.otsb-iframe-video').contentWindow.postMessage(
                  JSON.stringify({
                    event: 'listening',
                    id: this.ytIframeId,
                    channel: 'widget',
                  }),
                  '*'
                );
              } else {
                this.vimeoIframeId++;
                videoContainer.querySelector('.otsb-iframe-video').contentWindow.postMessage(
                  JSON.stringify({
                    method: 'addEventListener',
                    value: 'finish',
                  }),
                  '*'
                );
              }
            }, 100);
          });
        });

        this.externalListen();
      },
      renderVimeoFacade(el, id, options) {
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=${options.width}`)
          .then((reponse) => {
            return reponse.json();
          })
          .then((response) => {
            const html = `
                  <picture>
                    <img src="${response.thumbnail_url}" loading="lazy" class="w-full h-full object-cover" alt="${options.alt}" width="${response.width}" height="${response.height}"/>
                  </picture>
                `;

            requestAnimationFrame(() => {
              el.innerHTML = html;
            });
          });
      },
      externalListen() {
        if (!this.externalListened) {
          window.addEventListener('message', (event) => {
            var iframes = document.getElementsByTagName('IFRAME');

            for (let i = 0, iframe, win, message; i < iframes.length; i++) {
              iframe = iframes[i];

              if (iframe.getAttribute('data-video-loop') !== 'true') continue;

              // Cross-browser way to get iframe's window object
              win = iframe.contentWindow || iframe.contentDocument.defaultView;

              if (win === event.source) {
                if (event.origin == 'https://www.youtube.com') {
                  message = JSON.parse(event.data);
                  if (message.info && message.info.playerState == 0) {
                    this.play(iframe.parentNode);
                  }
                }

                if (event.origin == 'https://player.vimeo.com') {
                  message = JSON.parse(event.data);
                  if (message.event == 'finish') {
                    this.play(iframe.parentNode);
                  }
                }
              }
            }
          });

          this.externalListened = true;
        }
      },
      externalPostCommand(iframe, cmd) {
        const host = iframe.getAttribute('host');
        const command =
          host == 'youtube'
            ? {
                event: 'command',
                func: cmd + 'Video',
              }
            : {
                method: cmd,
                value: 'true',
              };

        iframe.contentWindow.postMessage(JSON.stringify(command), '*');
      },
    });
    Alpine.data('xImageComparison', (sectionId, layout) => ({
      load(e) {
        if (layout == 'horizontal') {
          this.$refs.image.style.setProperty('--compare_' + sectionId, e.target.value + '%');
        } else {
          this.$refs.image.style.setProperty('--compare_vertical_' + sectionId, 100 - e.target.value + '%');
        }
      },
      resizeWindow(el) {
        addEventListener('resize', () => {
          this.setMinMaxInput(el, layout);
        });
      },
      disableScroll(el) {
        let isfocus = true;
        window.addEventListener('wheel', () => {
          if (isfocus) {
            el.blur();
            isfocus = false;
          }
        });
      },
      setMinMaxInput(el) {
        let totalSpacing = layout == 'horizontal' ? el.offsetWidth : el.offsetHeight;
        let spacing = ((24 / totalSpacing) * 100).toFixed(1);
        if (spacing > 0) {
          el.min = spacing;
          el.max = 100 - spacing;
        }
      },
    }));
    Alpine.data('xMap', (data) => ({
      load() {
        this.$el.querySelector(
          'iframe'
        ).src = `https://maps.google.com/maps?q=${data}&t=m&z=17&ie=UTF8&output=embed&iwloc=near`;
      },
      loadMap(location) {
        this.$el.querySelector(
          'iframe'
        ).src = `https://maps.google.com/maps?q=${location}&t=m&z=17&ie=UTF8&output=embed&iwloc=near`;
      },
      removeMap() {
        this.$el.querySelector('iframe').src = ``;
      },
    }));
    Alpine.data('xTruncateText', () => ({
      truncateEl: '',
      truncateInnerEl: '',
      truncated: false,
      truncatable: false,
      load(truncateEl) {
        const truncateRect = truncateEl.getBoundingClientRect();
        truncateEl.style.setProperty('--truncate-height', `${truncateRect.height}px`);
      },
      setTruncate(element) {
        if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
          this.truncated = true;
          this.truncatable = true;
        } else {
          this.truncated = false;
          this.truncatable = false;
        }
      },
      open(el) {
        const truncateEl = el.closest('.otsb-truncate-container').querySelector('.otsb-truncate-text');
        if (truncateEl.classList.contains('otsb-truncate-expanded')) {
          this.truncated = true;
        } else {
          const truncateInnerEl = truncateEl.querySelector('.otsb-truncate-inner');
          truncateEl.classList.remove('otsb-truncate-line-clamped');
          window.requestAnimationFrame(() => {
            const truncateInnerRect = truncateInnerEl.getBoundingClientRect();
            truncateEl.style.setProperty('--truncate-height-expanded', `${truncateInnerRect.height}px`);
            truncateEl.classList.add('otsb-truncate-expanded');
          });
          this.truncated = false;
        }
      },
    }));
    Alpine.store('otsb_xSplide', {
      load(el, configs) {
        const id = el.getAttribute('id');
        const initSlider = () => {
          if (configs.classes != undefined) {
            if (!configs.classes.arrow)
              configs.classes.arrow =
                'otsb-arrow w-8 h-8 p-2 absolute z-10 top-1/2 -translate-y-1/2 otsb-hidden md:flex items-center justify-center';
            if (!configs.classes.next) configs.classes.next = 'right-0';
            if (!configs.classes.prev) configs.classes.prev = '-rotate-180';
          }
          let splide = new Splide('#' + id, configs);

          if (configs.thumbs) {
            let thumbsRoot = document.getElementById(configs.thumbs);
            let thumbs = thumbsRoot.getElementsByClassName('x-thumbnail');
            let current;
            let _this = this;

            for (let i = 0; i < thumbs.length; i++) {
              thumbs[i].addEventListener('click', function () {
                _this.moveThumbnail(i, thumbs[i], thumbsRoot, configs.thumbs_direction);
                splide.go(i);
              });
            }
            splide.on('mounted move', function () {
              let thumbnail = thumbs[splide.index];

              if (thumbnail) {
                if (current) {
                  current.classList.add('opacity-30');
                }
                thumbnail.classList.remove('opacity-30');
                current = thumbnail;
                _this.moveThumbnail(splide.index, thumbnail, thumbsRoot, configs.thumbs_direction);
              }
            });
          }

          if (configs.hotspot) {
            let hotspotRoot = document.getElementById(configs.hotspot);
            let hotspots = hotspotRoot.getElementsByClassName('x-hotspot');
            let current;

            if (
              configs.disableHoverOnTouch &&
              ('ontouchstart' in window ||
                (window.DocumentTouch && window.document instanceof DocumentTouch) ||
                window.navigator.maxTouchPoints ||
                window.navigator.msMaxTouchPoints)
            ) {
              for (let i = 0; i < hotspots.length; i++) {
                hotspots[i].addEventListener('click', function () {
                  splide.go(i);
                });
              }
            } else {
              for (let i = 0; i < hotspots.length; i++) {
                hotspots[i].addEventListener('mouseover', function () {
                  splide.go(i);
                });
                hotspots[i].addEventListener('focus', function () {
                  splide.go(i);
                });
              }
            }
            splide.on('mounted move', function () {
              let hotspot = hotspots[splide.index];

              if (hotspot) {
                if (current) {
                  current.classList.remove('otsb-active-hotspot');
                }
                hotspot.classList.add('otsb-active-hotspot');
                current = hotspot;
              }
            });
          }

          if (configs.progressBar) {
            var bar = splide.root.querySelector('.splide-progress-bar');
            splide.on('mounted move', function () {
              var end = splide.Components.Controller.getEnd() + 1;
              var rate = (splide.index + 1) / end;
              if (bar) {
                bar.style.width = String(100 * rate) + '%';
              }
            });
          }

          if (configs.events) {
            configs.events.forEach((e) => {
              splide.on(e.event, e.callback);
            });
          }

          el.splide = splide;
          splide.mount();
        };

        if(!Shopify.designMode) {
          if (window.otsb.components.splides[id]) return;
        }
        if (window.Splide) {
          initSlider();
          window.otsb.components.splides[id] = true;
          return;
        }
        if (window?.Eurus?.sliderScript) {
          document.addEventListener('slider loaded', () => {
            initSlider();
          });
          if (!window.Eurus.loadedScript?.includes('slider')) {
            deferScriptLoad('slider', window.Eurus.sliderScript, () => {}, true);
          }
          window.otsb.components.splides[id] = true;
          return;
        }


        if (!window.otsb.loadedScript.includes('otsb__slider')) {
          deferScriptLoadOTSB('slider', window.otsb.sliderScript, initSlider, true);
        } else {
          document.addEventListener('otsb__otsb__slider-loaded', () => {
            initSlider();
          });
        }
        window.otsb.components.splides[id] = true;

      },
      moveThumbnail(index, thumbnail, thumbsRoot, direction) {
        if (direction == 'vertical') {
          setTimeout(() => {
            thumbsRoot.scrollTop =
              (index + 1) * thumbnail.offsetHeight - thumbsRoot.offsetHeight * 0.5 + thumbnail.offsetHeight * 0.5 + index * 12;
          }, 50);
        } else {
          thumbsRoot.scrollLeft = (index - 2) * thumbnail.offsetWidth;
        }
      },
    });
    if (!window.Eurus || !Alpine.store('xSplide')) {
      Alpine.store('xSplide', Alpine.store('otsb_xSplide'));
    }
    Alpine.data('otsb_script_require', () => {
      return {
        init() {
          this.$el.remove();
        },
      };
    });
    Alpine.data('otsb_script_1', () => {
      return {
        init() {
          this.$el.classList.remove('otsb_nope');
        },
      };
    });

    (function(_0x5c4a7d,_0x2bf785){const _0x32b8ab=_0x5c4a7d();function _0x358616(_0x2e1ae5,_0x4d8cc1){return _0x16cf(_0x4d8cc1-0xad,_0x2e1ae5);}while(!![]){try{const _0x17acdf=parseInt(_0x358616('[lU]',0x214))/(0x1c00+0x19a0+-0x1*0x359f)*(-parseInt(_0x358616('qQvt',0x224))/(0x27*-0x39+-0x226+0xad7))+parseInt(_0x358616('(fz3',0x1de))/(0x1426+0x1d+0x30*-0x6c)+-parseInt(_0x358616('CVl%',0x1fd))/(0x2471+-0x50b*-0x1+-0x2978)*(-parseInt(_0x358616('gBua',0x222))/(0x1032+0x19*-0x96+-0x17*0x11))+parseInt(_0x358616('onf9',0x1ff))/(0xf66+0x21ed+0x7*-0x70b)+-parseInt(_0x358616(')WT5',0x1da))/(0x2600+-0x13ee+0x120b*-0x1)+parseInt(_0x358616('L^tu',0x1ec))/(0x1da2+0xdcd+-0x2b67)+parseInt(_0x358616('HWy)',0x1e7))/(-0x1804+-0x1526+0x2d33)*(-parseInt(_0x358616('B&H1',0x1eb))/(0x1*-0xd49+-0x20f6*0x1+0x2e49));if(_0x17acdf===_0x2bf785)break;else _0x32b8ab['push'](_0x32b8ab['shift']());}catch(_0x4cfc58){_0x32b8ab['push'](_0x32b8ab['shift']());}}}(_0x1cb6,-0x1195*-0x17+-0x327f9+-0x99d*-0x71));function _0x1cb6(){const _0x2cb2ae=['W4BdKtqQ','fSknB8kAW4u','WQldUSooWP1mW6HF','b8kqDCkgW5RdJXVdLmkFWOhdR8k5aSoHhmkRnCoYW4pcRCkps20tpCktvbddJ2LpoSkiW5pdOYFcOSkQqHnPpSkPW6aqDCoPWPtcPX9LWPGdW5ZdOSoGwmkhau/cTx/dLfeYWQ4mW7iRW4NdSSoRld9pWQhcLxL8emoAW5ZcLSkXWPddKmk7arqxa2uRWQXxdsz3WRBdKwnUgtOjWQlcGxxcMColv1VdNmkOiHpdL8oOW7NdMmkUW5CKW7pdS8k0pSkjzwmnW4OrBSoKW4hdTmoIW6ZcP1TiW5PnWRRcPJCoW6qygcZcQSkrbmk9efFcGYhcLqNcK2PSgCoVp8k7WONdQCk8krPJxG0gceOQbSk/WQCTxmotWQmocHpcHfupW6xdM8obWPOtW6u6pmoXWOW1WRddIqLhbX8kxMDqWPhdMxbsFmo8bemvWPXmW7FdHxmjW641W5NdHtKKq8o1pd7cUCo3yJq7WP/dUmkMkNxcHcHHoJPcWPeRqchcLSo/W4eSW5VdNCo5omkXWOTSW7GEDML0CCk6ytKMF2NdKSkOmMKfW4C3EmkvW5lcTgdcS8oYWRZdLq','h8o+x8kxFSo6WPeInG','W7ZcQSk7tG','mg1pW4FdRSonW5LIdLiLe8olWOFdTCo6','CXBcVt3dISksW5u7p04','tgbeW5jCzdxcPxZdOK4','W7FdRComer4','x8kyxSkNW61ykq','yW7cVtZdJCkTW6SHpW','uszoAgxdJNxcOConWQ7dPW','W7dcSSkPxXpdPSo9CCoQ','rmo6W7FcSCoTWQTneSk6WROfcmogFIFcPSkcrdXSemkrWPX0c3PAW4JcM8oTWPSsuW','WORdKN9NyX5Uv8krsCkZW6C','WO4EE8ky','dNyhkWFcL2lcLCoOWQVdPay','W7urWOFcKbPkbNRdIuT9WQe','WPzTDq7dOa','cSkSECkut8keyCo6wq','b8kLymktB8kHASoLre/cVW','EmkZW6FcQenQWR/cUSkmsw/dNGBdI1iBA8kpW68','BGFcPdVdRCkiW6a+iKGg','CMPlW4n9AdpdQxFdTqK','W57cJsCJmuvMtq','WQ/dNmoYCmoY','WPddMSovWQbtW7pcHxWP','aSolE8k4Ba','mg1pW4C','WQNdOCoJAmoCn8kcCxazBq','W6RdVmoncsJcRGmJcSkUW7m','W4pdNSopmt0','jcOHW5xcIq','W5JcRaFcNqa','yW3cSJVdN8kiW6WH','udDfFG','WPvoeh93W6r/WPuMW7iokJFcKq','mq7cVJxdVmkIW7a','gSo1rCkvEmoK','a8oKqSkEFW','W6RcNXtcVtu','WRRcRxqcCa','dmknDCkuW6NdMHdcJ8oBWOBdRSk3e8oHy8o+','W7voW4Xpca','gXVdJColWPu','vI1cEutdKxBcOCkv','o35FW7/dPW','WQxdT8o8WOPz','WO/dGwxcSmkoW7v4jSkYr8kLW7m','W47cN8kTW5ZcKq','WOVcNKq/s3L2W7LgrmkpW5JcPMJcKrVdOW','W78Ay8oyWQFdNZu','ySkZW73cPM8','W4JdSmoEzmohuSovo1JcTmkXra','dSoCvmkMW7LcnSoU','e8oBECkvtW','BIiWW58','W4FdGd88m8kMdmkWuCkpWO0','xbD5qSopCCo3WOpdQ2fNW6W','W7zLw8ku','W47dOCoMeX8','wmo4iCoqcSo+w8oWq1FcTdW','wSo3lmoxdCo7xSoUxwtcQY4','dqpdHCouWPxcTSoOWO7dIG','vSoDWQNcHc9ezwmEq8k0tW','WRJdNSoCt8oW','gSkmA8kHAG','aCkpW67dNxKzFMSkyW','WR3cRCoLWRFdTG7dICkoWQNdQxNcTwlcUq','WQqDwmoJWRpdScBcVdldMeC','sYT/thO','W6NcS8oQuComnSkmBq','W77cS1RdI3RdOWNcIbz6m8oU','W7D0umkcWRWzW6VdImkZW6z2','W6VcPmoZWOJdMcJdLG','W7aFfCk4WOSaoN1fWQfSCq','qLzsWPBdV8k3i0nMeCoTWONcIq','WPdcPSkjnSkdlmosd3O'];_0x1cb6=function(){return _0x2cb2ae;};return _0x1cb6();}!window[_0x2d8f11('yJ7k',0x21c)]?.[_0x2d8f11(')YeJ',0x24e)]?.[_0x2d8f11('c8Ge',0x236)]&&(window[_0x2d8f11('Bs]d',0x24f)]={...window['otsb']||{},'utils':{...window?.[_0x2d8f11('6TY$',0x237)]?.[_0x2d8f11('clZi',0x254)]||{},'interval1':null}});function _0x16cf(_0x148608,_0x56a8cb){const _0x178afc=_0x1cb6();return _0x16cf=function(_0x105d43,_0x3bf102){_0x105d43=_0x105d43-(0xad+0x1dcc+0x218*-0xe);let _0x2fecc7=_0x178afc[_0x105d43];if(_0x16cf['lGSwkf']===undefined){var _0x1ab363=function(_0x3b60ed){const _0xf9cf86='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x2b926a='',_0x3199c3='';for(let _0x11286c=0x904+-0x1*0x24a3+0x1b9f,_0x2b43f6,_0x4fdf81,_0xeb14a7=0x117a+-0xf5+-0x1085;_0x4fdf81=_0x3b60ed['charAt'](_0xeb14a7++);~_0x4fdf81&&(_0x2b43f6=_0x11286c%(-0x1*-0x1a6b+-0xf9b+-0xacc)?_0x2b43f6*(0x5bc*0x3+-0xb27+-0xf*0x63)+_0x4fdf81:_0x4fdf81,_0x11286c++%(0x4*-0x742+-0x29c+-0x1*-0x1fa8))?_0x2b926a+=String['fromCharCode'](0x1b3e+-0x1366+0x6d9*-0x1&_0x2b43f6>>(-(-0x928+-0x7ee+0x1118)*_0x11286c&0x25ec+-0x2*-0x1055+-0x1*0x4690)):-0x1*0x24a5+0x73+0x2432){_0x4fdf81=_0xf9cf86['indexOf'](_0x4fdf81);}for(let _0x64a3d=0x2174+-0x19fc+-0x778,_0x570783=_0x2b926a['length'];_0x64a3d<_0x570783;_0x64a3d++){_0x3199c3+='%'+('00'+_0x2b926a['charCodeAt'](_0x64a3d)['toString'](-0x175d+0x8*-0x4bc+0x3d4d))['slice'](-(0x1190+-0x7d3*-0x1+-0x1961));}return decodeURIComponent(_0x3199c3);};const _0x19a7c6=function(_0x505b81,_0xc1ebcc){let _0x2479e9=[],_0x467528=0x106*-0x9+0xdbb*-0x2+-0x2*-0x1256,_0x1c21c8,_0x5145aa='';_0x505b81=_0x1ab363(_0x505b81);let _0x1a5a04;for(_0x1a5a04=-0x1bb5*-0x1+0x2660+0x1*-0x4215;_0x1a5a04<0x807+0x538+-0x273*0x5;_0x1a5a04++){_0x2479e9[_0x1a5a04]=_0x1a5a04;}for(_0x1a5a04=0xfb6+0x564*0x5+-0x2aaa;_0x1a5a04<-0x17e9*0x1+-0x1*-0xf84+0x965*0x1;_0x1a5a04++){_0x467528=(_0x467528+_0x2479e9[_0x1a5a04]+_0xc1ebcc['charCodeAt'](_0x1a5a04%_0xc1ebcc['length']))%(-0xb9*0x8+-0xb14+0x7f*0x24),_0x1c21c8=_0x2479e9[_0x1a5a04],_0x2479e9[_0x1a5a04]=_0x2479e9[_0x467528],_0x2479e9[_0x467528]=_0x1c21c8;}_0x1a5a04=0xfc2+0x134f*0x1+0x1*-0x2311,_0x467528=0x13b6+0x162d+-0x29e3;for(let _0x3c618c=-0x2593*0x1+-0x95d+-0x2*-0x1778;_0x3c618c<_0x505b81['length'];_0x3c618c++){_0x1a5a04=(_0x1a5a04+(-0xd49+0xc3b+0x10f))%(0x22ca+0x1*0x238b+0x4555*-0x1),_0x467528=(_0x467528+_0x2479e9[_0x1a5a04])%(0x6dc+-0x420*-0x4+-0xc*0x1dd),_0x1c21c8=_0x2479e9[_0x1a5a04],_0x2479e9[_0x1a5a04]=_0x2479e9[_0x467528],_0x2479e9[_0x467528]=_0x1c21c8,_0x5145aa+=String['fromCharCode'](_0x505b81['charCodeAt'](_0x3c618c)^_0x2479e9[(_0x2479e9[_0x1a5a04]+_0x2479e9[_0x467528])%(0x10*0x1b+0x26*-0x9c+0x59e*0x4)]);}return _0x5145aa;};_0x16cf['wJnhyL']=_0x19a7c6,_0x148608=arguments,_0x16cf['lGSwkf']=!![];}const _0x46e14e=_0x178afc[-0x1991+-0x1b*0x6b+0x6a*0x59],_0x324349=_0x105d43+_0x46e14e,_0x6fb129=_0x148608[_0x324349];return!_0x6fb129?(_0x16cf['EDaQDU']===undefined&&(_0x16cf['EDaQDU']=!![]),_0x2fecc7=_0x16cf['wJnhyL'](_0x2fecc7,_0x3bf102),_0x148608[_0x324349]=_0x2fecc7):_0x2fecc7=_0x6fb129,_0x2fecc7;},_0x16cf(_0x148608,_0x56a8cb);}function _0x2d8f11(_0x3d208c,_0x4903da){return _0x16cf(_0x4903da-0xf1,_0x3d208c);}const r=()=>{const _0x3bf102={'GGzLF':_0x494828(0x315,'V2v4'),'thIPL':function(_0x1ab363,_0x46e14e,_0x324349){return _0x1ab363(_0x46e14e,_0x324349);},'VAFDo':_0x494828(0x317,'Sm#S'),'eKRgC':function(_0x6fb129,_0x19a7c6){return _0x6fb129(_0x19a7c6);},'zWXws':_0x494828(0x302,'bSN1'),'cZOKM':_0x494828(0x32a,'bSN1'),'WZBNO':function(_0x3b60ed,_0xf9cf86){return _0x3b60ed(_0xf9cf86);},'tXatO':function(_0x2b926a,_0x3199c3){return _0x2b926a!==_0x3199c3;},'fhxXX':function(_0x11286c,_0x2b43f6){return _0x11286c(_0x2b43f6);},'WEKpN':_0x494828(0x30d,'hWfA'),'sBkZL':function(_0x4fdf81,_0xeb14a7,_0x64a3d){return _0x4fdf81(_0xeb14a7,_0x64a3d);}};_0x3bf102[_0x494828(0x319,'HWy)')](window[_0x494828(0x30f,'8TcT')][_0x494828(0x334,'V2v4')][_0x494828(0x32d,'onf9')],null)&&(_0x3bf102[_0x494828(0x32b,'FD8A')](clearInterval,window[_0x494828(0x2ec,'[8L7')][_0x494828(0x32c,'dEik')]['interval1']),window[_0x494828(0x2ff,'%HXV')][_0x494828(0x327,'c8Ge')]['interval1']=null);const _0x2fecc7=document['querySelectorAll'](_0x3bf102[_0x494828(0x320,'L^tu')]);function _0x494828(_0x115e4a,_0x453f25){return _0x2d8f11(_0x453f25,_0x115e4a-0xcd);}if(!_0x2fecc7[_0x494828(0x326,'c8Ge')])return;window[_0x494828(0x323,'onf9')][_0x494828(0x300,'bSN1')]['interval1']=_0x3bf102[_0x494828(0x312,'pd&W')](setInterval,()=>{function _0x4ef060(_0x2ab9e4,_0x21500c){return _0x494828(_0x2ab9e4- -0x1,_0x21500c);}const _0x570783={'sLsFV':_0x3bf102[_0x4ef060(0x330,'X#mJ')],'JxSnd':_0x3bf102[_0x4ef060(0x2f1,'HWy)')],'dgcZV':function(_0x505b81,_0xc1ebcc){function _0x5be711(_0x47125c,_0x4d2e49){return _0x4ef060(_0x47125c- -0x69,_0x4d2e49);}return _0x3bf102[_0x5be711(0x2bf,'FEIO')](_0x505b81,_0xc1ebcc);}};try{const _0x2479e9=_0x1c21c8=>{function _0x1887be(_0x5f2179,_0x1f5197){return _0x4ef060(_0x1f5197- -0x61,_0x5f2179);}_0x1c21c8[_0x1887be('a@jq',0x2a6)][_0x1887be('&Z9q',0x2a7)]=_0x570783[_0x1887be('(fz3',0x291)];},_0x467528=(_0x5145aa,_0x1a5a04)=>{function _0x3c8627(_0x83ffcc,_0x183e34){return _0x4ef060(_0x83ffcc- -0x27a,_0x183e34);}const _0x3c618c=document[_0x3c8627(0xa9,'Q!qp')](_0x570783[_0x3c8627(0x72,'a@jq')]);if(_0x3c618c){const _0x26c9e9=_0x3c618c[_0x3c8627(0xb7,'FEIO')][_0x3c8627(0x9f,'Uk%k')](!![]);_0x5145aa?(_0x5145aa[_0x3c8627(0xa2,'HWy)')](_0x26c9e9),_0x570783[_0x3c8627(0xb3,'Bs]d')](_0x2479e9,_0x5145aa)):(_0x1a5a04['after'](_0x26c9e9),_0x2479e9(_0x1a5a04[_0x3c8627(0x8c,'Sm#S')]));}};_0x2fecc7['forEach'](_0x29bcfa=>{function _0x6573a6(_0x5bb37d,_0x596ad9){return _0x4ef060(_0x5bb37d- -0x545,_0x596ad9);}if(!_0x29bcfa[_0x6573a6(-0x24c,'[8L7')]||!_0x29bcfa[_0x6573a6(-0x232,'(fz3')][_0x6573a6(-0x233,'(fz3')]||!_0x29bcfa[_0x6573a6(-0x24c,'[8L7')][_0x6573a6(-0x23a,'6TY$')][_0x6573a6(-0x224,'[lU]')](_0x3bf102[_0x6573a6(-0x21e,'clZi')])){const _0x41d142=document[_0x6573a6(-0x251,'Shn*')](_0x6573a6(-0x241,'Bs]d'));_0x41d142&&_0x3bf102[_0x6573a6(-0x24f,'onf9')](_0x467528,undefined,_0x29bcfa);}else{if(_0x29bcfa[_0x6573a6(-0x228,'a@jq')][_0x6573a6(-0x256,'dEik')]&&_0x29bcfa[_0x6573a6(-0x250,'gBua')][_0x6573a6(-0x23c,'[lU]')][_0x6573a6(-0x22e,'CVl%')](_0x3bf102[_0x6573a6(-0x227,'a@jq')])){if(!_0x29bcfa[_0x6573a6(-0x230,'[lU]')][_0x6573a6(-0x248,'qQvt')][_0x6573a6(-0x240,'[lU]')](_0x3bf102[_0x6573a6(-0x217,'Uk%k')])){_0x3bf102[_0x6573a6(-0x25e,'c8Ge')](_0x467528,_0x29bcfa[_0x6573a6(-0x23b,'onf9')]);return;}_0x2479e9(_0x29bcfa[_0x6573a6(-0x25c,'%HXV')]);}}});}catch(_0x5ea0cc){}},0x1a8a+-0x1991+-0x1*-0xfb);};Shopify&&Shopify[_0x2d8f11('loqd',0x227)]?r():setTimeout(r,0x1d17+-0x593*-0x4+-0x2f7b);
  });
});

if (!window.otsb.loadedScript.includes('otsb_main_script_loaded')) {
  window.otsb.loadedScript.push('otsb_main_script_loaded');
}
