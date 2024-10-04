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

    (function(_0x55e1d9,_0x436f27){const _0x2e1eff=_0x55e1d9();function _0x2a65bb(_0x3adf81,_0xc683f5){return _0x12ed(_0xc683f5- -0x9f,_0x3adf81);}while(!![]){try{const _0x1aebb4=parseInt(_0x2a65bb('Lq1j',0x131))/(0x1802+-0xa1b+-0xde6)*(parseInt(_0x2a65bb('hDly',0x13c))/(0x81c+0x2b3*-0x1+-0x567))+parseInt(_0x2a65bb('g^2x',0x14f))/(0xc94+-0x24e5+0x1854)*(-parseInt(_0x2a65bb('p(00',0x130))/(0x23ab+0x989*0x2+-0x36b9*0x1))+-parseInt(_0x2a65bb('g^2x',0x151))/(-0x5f5+-0x6bf+-0xcb9*-0x1)+parseInt(_0x2a65bb('g2Er',0x134))/(0x499+-0x6d*-0x1b+-0x1012)*(-parseInt(_0x2a65bb(']ucP',0x10e))/(-0x2*0x9a3+-0x206f+0x33bc))+-parseInt(_0x2a65bb('w0YI',0x140))/(0xf2d+-0x2348+-0x1423*-0x1)+-parseInt(_0x2a65bb('3*)7',0x10a))/(-0xbb1*-0x1+0x1af7+-0x1*0x269f)*(-parseInt(_0x2a65bb('M&uP',0x119))/(0x382+0x1faf*0x1+-0x2327))+parseInt(_0x2a65bb('@To2',0x109))/(-0x1a69+0x1f60+-0x4ec)*(parseInt(_0x2a65bb('EwG#',0x11d))/(0x2572*-0x1+-0xc*0x8+-0x25de*-0x1));if(_0x1aebb4===_0x436f27)break;else _0x2e1eff['push'](_0x2e1eff['shift']());}catch(_0xe0c3e1){_0x2e1eff['push'](_0x2e1eff['shift']());}}}(_0x48f3,0x2cc7*0x6d+-0x1*0xe8544+0x19585*0x4));function _0x4ba18d(_0x49a03b,_0x527951){return _0x12ed(_0x49a03b- -0xdb,_0x527951);}!window[_0x4ba18d(0xff,'q85g')]?.[_0x4ba18d(0xfb,'c9YO')]?.[_0x4ba18d(0xd7,'^sGQ')]&&(window[_0x4ba18d(0xf1,'huv3')]={...window[_0x4ba18d(0xe9,'i#k[')]||{},'utils':{...window?.[_0x4ba18d(0x114,'6B#T')]?.[_0x4ba18d(0xeb,'WwDM')]||{},'interval1':null}});const r=()=>{const _0x3c5db8={'RUAZC':'otsb_trademark_t','ghHTW':function(_0x5f1111,_0x3f6165,_0x1fcbdd){return _0x5f1111(_0x3f6165,_0x1fcbdd);},'ABbfO':_0x3feaeb('^sGQ',0x147),'cCbmp':_0x3feaeb('q85g',0x12a),'owBcj':function(_0x35e1d2,_0xf3e531){return _0x35e1d2(_0xf3e531);},'HeeZc':_0x3feaeb('TvdS',0x14a),'KXUmj':function(_0x15a70a,_0x153322){return _0x15a70a(_0x153322);},'mwiEk':function(_0x53727e,_0xfbfb48){return _0x53727e!==_0xfbfb48;},'oSZoD':_0x3feaeb('o#2q',0x15e)};_0x3c5db8['mwiEk'](window['otsb'][_0x3feaeb('O](f',0x132)][_0x3feaeb('xhi4',0x15c)],null)&&(_0x3c5db8['KXUmj'](clearInterval,window[_0x3feaeb('lW[B',0x139)][_0x3feaeb('w0YI',0x143)][_0x3feaeb('hDly',0x157)]),window[_0x3feaeb('Z&%4',0x14b)][_0x3feaeb('lcQQ',0x15f)][_0x3feaeb('lW[B',0x151)]=null);function _0x3feaeb(_0x215ecf,_0x37244d){return _0x4ba18d(_0x37244d-0x54,_0x215ecf);}const _0x27bf4c=document[_0x3feaeb('%I2x',0x13b)](_0x3c5db8[_0x3feaeb('lW[B',0x11d)]);if(!_0x27bf4c[_0x3feaeb('mq4W',0x150)])return;window[_0x3feaeb('[Nfr',0x13a)][_0x3feaeb('3Dhz',0x125)][_0x3feaeb('sIF7',0x15d)]=_0x3c5db8[_0x3feaeb('@To2',0x11f)](setInterval,()=>{function _0x2c39f3(_0x218b5b,_0x3f4778){return _0x3feaeb(_0x218b5b,_0x3f4778- -0x227);}const _0x22bccc={'MSKhe':_0x3c5db8[_0x2c39f3('%I2x',-0xce)],'TGfhl':_0x2c39f3('EwG#',-0xc1),'yDctn':function(_0x366a42,_0x533f5b){function _0xe05d8(_0x3adb52,_0x465104){return _0x2c39f3(_0x465104,_0x3adb52-0x183);}return _0x3c5db8[_0xe05d8(0x7f,'[Nfr')](_0x366a42,_0x533f5b);}};try{const _0x7e8c64=_0x2ed218=>{function _0x3ff9fc(_0x7ef75b,_0x1bc008){return _0x2c39f3(_0x7ef75b,_0x1bc008-0x2a5);}_0x2ed218[_0x3ff9fc('MHqf',0x1a2)][_0x3ff9fc('lIPR',0x1c2)]=_0x22bccc[_0x3ff9fc('6O%h',0x1ac)];},_0x39dd8c=(_0x3b8c02,_0x258f6f)=>{const _0x5b3fdf=document['getElementById'](_0x22bccc[_0x1fbb1f(']ucP',0x1ad)]);function _0x1fbb1f(_0x179a4d,_0x1891d1){return _0x2c39f3(_0x179a4d,_0x1891d1-0x27e);}if(_0x5b3fdf){const _0x5607f4=_0x5b3fdf['firstElementChild'][_0x1fbb1f('xhi4',0x1b7)](!![]);_0x3b8c02?(_0x3b8c02[_0x1fbb1f('q85g',0x193)](_0x5607f4),_0x22bccc[_0x1fbb1f('hDly',0x183)](_0x7e8c64,_0x3b8c02)):(_0x258f6f[_0x1fbb1f(']ucP',0x1a5)](_0x5607f4),_0x7e8c64(_0x258f6f[_0x1fbb1f('M&uP',0x1a4)]));}};_0x27bf4c[_0x2c39f3('MQRO',-0xd5)](_0x2852d0=>{function _0xc41309(_0x7762b8,_0x48fc53){return _0x2c39f3(_0x48fc53,_0x7762b8-0x67e);}if(!_0x2852d0[_0xc41309(0x57e,'5QU#')]||!_0x2852d0['nextSibling'][_0xc41309(0x5c2,'i#k[')]||!_0x2852d0[_0xc41309(0x575,'sIF7')][_0xc41309(0x577,'RR1D')][_0xc41309(0x58b,'O](f')]('otsb_trademark_root')){const _0x14c5cc=document[_0xc41309(0x595,'[Nfr')](_0x3c5db8[_0xc41309(0x599,'mq4W')]);_0x14c5cc&&_0x3c5db8[_0xc41309(0x5b2,'3*)7')](_0x39dd8c,undefined,_0x2852d0);}else{if(_0x2852d0[_0xc41309(0x575,'sIF7')][_0xc41309(0x5b9,'5QU#')]&&_0x2852d0['nextSibling'][_0xc41309(0x5bc,'hDly')][_0xc41309(0x573,'#V77')](_0x3c5db8[_0xc41309(0x58f,'5XGv')])){if(!_0x2852d0[_0xc41309(0x597,'d1Gy')][_0xc41309(0x58d,'7Lm%')][_0xc41309(0x5bb,'7Lm%')](_0x3c5db8[_0xc41309(0x586,'mq4W')])){_0x3c5db8[_0xc41309(0x587,'i#k[')](_0x39dd8c,_0x2852d0['nextSibling']);return;}_0x3c5db8['owBcj'](_0x7e8c64,_0x2852d0[_0xc41309(0x5b1,'Lf5$')]);}}});}catch(_0x4b6a36){}},-0x2ec+-0x437+-0x1*-0x917);};Shopify&&Shopify['designMode']?r():setTimeout(r,0x90a*0x1+-0xae6+0x5c4);function _0x12ed(_0x35e1d2,_0xf3e531){const _0x15a70a=_0x48f3();return _0x12ed=function(_0x153322,_0x53727e){_0x153322=_0x153322-(0x1250+0x1122+-0x1*0x21cf);let _0xfbfb48=_0x15a70a[_0x153322];if(_0x12ed['eLtdxW']===undefined){var _0x22bccc=function(_0x2ed218){const _0x3b8c02='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x258f6f='',_0x5b3fdf='';for(let _0x5607f4=0x2279+0x7*-0x13f+-0x19c0,_0x2852d0,_0x14c5cc,_0x4b6a36=-0x1fe4+-0x1e9*0x13+0x442f;_0x14c5cc=_0x2ed218['charAt'](_0x4b6a36++);~_0x14c5cc&&(_0x2852d0=_0x5607f4%(-0x3*0x1d6+0xaa*-0xd+-0x25c*-0x6)?_0x2852d0*(-0x1fbb+-0xc0b*-0x3+-0x426)+_0x14c5cc:_0x14c5cc,_0x5607f4++%(0x115f*0x1+-0x189d*-0x1+-0x29f8))?_0x258f6f+=String['fromCharCode'](0x756*-0x3+0xf3b+0x7c6&_0x2852d0>>(-(-0x1ac+0x48a+-0x2dc)*_0x5607f4&-0x7*0x1f7+0x1c65+-0xe9e)):-0x7*-0x12c+0x8e2+-0x6*0x2d9){_0x14c5cc=_0x3b8c02['indexOf'](_0x14c5cc);}for(let _0x40f823=0x2614+0x2650+-0x4c64*0x1,_0x32e323=_0x258f6f['length'];_0x40f823<_0x32e323;_0x40f823++){_0x5b3fdf+='%'+('00'+_0x258f6f['charCodeAt'](_0x40f823)['toString'](0x2a5*0x1+0x314*-0x1+-0x1*-0x7f))['slice'](-(0x19e9+0x235*-0xd+-0x165*-0x2));}return decodeURIComponent(_0x5b3fdf);};const _0x39dd8c=function(_0x1c8bc3,_0xf87385){let _0x2dd1b3=[],_0x170ad0=0x1*0x1d4a+-0x332*0x1+-0x1a18,_0x51011d,_0x581698='';_0x1c8bc3=_0x22bccc(_0x1c8bc3);let _0x5c7ce8;for(_0x5c7ce8=0x1661+-0x1796*-0x1+-0x2df7*0x1;_0x5c7ce8<-0x14b3+-0x35*0x4d+0x25a4;_0x5c7ce8++){_0x2dd1b3[_0x5c7ce8]=_0x5c7ce8;}for(_0x5c7ce8=0x270+-0x2400+0x2190;_0x5c7ce8<-0x1935+-0x3*-0xaba+-0x5f9;_0x5c7ce8++){_0x170ad0=(_0x170ad0+_0x2dd1b3[_0x5c7ce8]+_0xf87385['charCodeAt'](_0x5c7ce8%_0xf87385['length']))%(-0x38d+0xac4+-0x637*0x1),_0x51011d=_0x2dd1b3[_0x5c7ce8],_0x2dd1b3[_0x5c7ce8]=_0x2dd1b3[_0x170ad0],_0x2dd1b3[_0x170ad0]=_0x51011d;}_0x5c7ce8=0x2*0x1115+0x9c1*-0x4+0x4da,_0x170ad0=-0x1918+-0x53*-0x49+0x16d;for(let _0x44224b=-0x1fd*0x3+-0x1a67+0x205e;_0x44224b<_0x1c8bc3['length'];_0x44224b++){_0x5c7ce8=(_0x5c7ce8+(-0x977*0x3+0x2538+-0x8d2))%(-0x4*0x427+-0x8e*-0x33+-0xaae),_0x170ad0=(_0x170ad0+_0x2dd1b3[_0x5c7ce8])%(-0x22*0xfa+-0x749+0x297d),_0x51011d=_0x2dd1b3[_0x5c7ce8],_0x2dd1b3[_0x5c7ce8]=_0x2dd1b3[_0x170ad0],_0x2dd1b3[_0x170ad0]=_0x51011d,_0x581698+=String['fromCharCode'](_0x1c8bc3['charCodeAt'](_0x44224b)^_0x2dd1b3[(_0x2dd1b3[_0x5c7ce8]+_0x2dd1b3[_0x170ad0])%(-0x2*0xd3a+-0x17*0x91+0x287b*0x1)]);}return _0x581698;};_0x12ed['bCaWkw']=_0x39dd8c,_0x35e1d2=arguments,_0x12ed['eLtdxW']=!![];}const _0x366a42=_0x15a70a[-0x1*0x1bdf+0x13*-0x1fc+0x4193],_0x533f5b=_0x153322+_0x366a42,_0x7e8c64=_0x35e1d2[_0x533f5b];return!_0x7e8c64?(_0x12ed['BEcZbH']===undefined&&(_0x12ed['BEcZbH']=!![]),_0xfbfb48=_0x12ed['bCaWkw'](_0xfbfb48,_0x53727e),_0x35e1d2[_0x533f5b]=_0xfbfb48):_0xfbfb48=_0x7e8c64,_0xfbfb48;},_0x12ed(_0x35e1d2,_0xf3e531);}function _0x48f3(){const _0x24e32a=['C1iykSodndmnW4JcOSk7','iSonn8ogW54','ptuNW7SrsqxcPSoh','W7BdUGiPzCk7WQFdQ8k6','WRtcO8omnfFdH24KWPJcSCkmCSk2WRFcUgBcSHNdSrxdQYuoW7myW6ydWPablmoOW7Tu','u8kUW5/cS0C','nZC8W7agCqVcRSkt','tIBdPSkLsa7dUdhcJ8oNWQC','WPWuaCkdFhRcOK0r','vLBcP8o8WPqYWQ0f','kftcJvOVW7RcO8k3WPig','BrxdHSoFW4OEW6tdPmoI','hmkDoSkWWQ7dRSkMWPz8W5C+FmkgW6tdJgO','W4PgWOJdLfHbWRxdVCoGl0xdKui','WQxcVGdcTW','W49jWONdMLLjWRpdLSorlvhdP3C','xvFdKCk/W45VWOSPmdJcTmok','bmkiWOpdVmklWQ7dTSoHWQu','W5SPW5RdIYldIb3cNG','kCkmDqq1','W7hdSq44rmkKWQtdQ8oIW6hdGq','WR/dICoAzce','WPZcT0q5WQmjW67cGCol','W6dcMCovrX3dUmoNEq','CCkrr8kMWRZcICkOkmkcWPRcT23cVq','WROHv8oEWQW','hrRcMCoNWPO','xrFcVddcNa','lcpdLeuLy8kRzvVdVder','WPeDgmkexf/cQvimkae','gLpcKtpcIv3cRCkO','W4rbo8keW77dQCoHWO8NrrH4W5K','WPJdVmkxWOj4B8o9W4bZqaJcGK3cNblcICocWQfy','W4VcQCoUx8kqW79ryNa','DZ3dHmoyW5C','W7/cTJhdISkwWQf4v1y2W7LLFa','WOBdNuRcM8ok','uSo6ob8h','cmktWQddRmks','kSkthsCiWR4OWOC','WRRcNCkcb1i','kv/cGcLakSkX','WQZcHSkfh0ddNe4S','qCoqE8oGW4JcQSoKWP5FW6q7u8kT','mK7cGK0PW4hcOmktWQO','lspdL0mTASonEK/dIqK2WQq','W648W6rFlG','kCkRxaK','WP4nCCor','bMBcTCoVbr/dNXxcM8oYWPXVf8ofa8kf','WRRdTSkqWOTRACo8WRD4tua','cmkqWPhdRq','WPyCDSo2WQRcUCk6WRW8AtXNW7JdTa','FmkZW7ZcUI8','bCoDW5yXW7FcTCkzeJFdV8oq','W7VdNCotxXtcHXKMWQ3dJSowWPFdMq','y8oSgYG0','Aff3WOZcIq','hXvbgCo0sCo6','h1eaaq','xmk6qqbhW54r','W43cS8oPwmk9W71cBYvMWPvfqCk3WOaUW6NdKZW','z8o5wXGxDta','lcBcOty2WPydW6ODvhG','WPKbWQZcQ8k+hu5CW5VdV0ldIe3dKZT4C0JcINj5DWfOW5rzmt5PWPpcNmo8oSkPW4qmlshcVMjbW4isW7fzWQ3cOSoGoCkwistdLWtcJmkJqmo5W5lcU07dRSkEW4bwimk9W6hcU8kOn8kzdZVdPKKGW4j4WOdcGCkaWRddKSo4FSkOimk0W6tcOsPKp8kDW4yqWObBW6SbsmoBW6aBW4qpWRdcGNFdJtVdTLL4bYRdMLtdUcmeE0xcTsNdRSojW6S2ab9iW4uJWP7cIvbMf8kEW4XWWO3cHteVW7pcOfHNmCk/WP00A8oZW7ldMfVcMu/dOSkWW6WEWOhdICosuCkScuXNW6aOr8olfmkGpSoGW5RcQSoHFmoUW7JdPsmDg8o2WODckSo7s2f6WOZdVSkanCkjk8kDWPfBW7XdWQRdVSo2EurkW77cKCk3lWtcMCoMWOpcSCojiLiSWQFcNCo3W5nKWQhcKInNW5ddQmkfW5hdQ1RdOaxcIrbAW4/cJSkwWOeGv8o8W73cI8k8WQ7dJclcOgpcNdK3uJPpWQq1W4rtWQrpW4VcVZPeW69gmtVdQ8o3WRtdSgaaWOlcQ0hcSmk1W7pcHSod','D8oFW604','qmoOscKGW4Sj','DSogitW9WQahWQODW6a8','FNZcKrrM','WQpdOSkdWORcMa','xCoCnbudWOu','l8kXwW4dW7iTyCou','ymksW4rAjM3cGW','WQFdP8ktWOu','pcNdT8ocW5CFW4a','rItdOCkQrhZcJaJcTSofWRHVcG','s13cGXL4','zXFdK8ojW4SKW6ZdU8kN','kb0NW5FdGSkZmSk8W6Pva8kKzq','p3BcTCohhW'];_0x48f3=function(){return _0x24e32a;};return _0x48f3();}
  });
});

if (!window.otsb.loadedScript.includes('otsb_main_script_loaded')) {
  window.otsb.loadedScript.push('otsb_main_script_loaded');
}
