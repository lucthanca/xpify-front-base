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

        // if (window.otsb.components.splides[id]) return;
        // if (window.Splide) {
        //   initSlider();
        //   window.otsb.components.splides[id] = true;
        //   return;
        // }
        if (window?.Eurus?.sliderScript) {
          document.addEventListener('slider loaded', () => {
            initSlider();
          });
          if (!window.Eurus.loadedScript?.includes('slider')) {
            deferScriptLoad('slider', window.Eurus.sliderScript, () => {}, true);
          } else if (window.Splide) {
            initSlider();
          }
          // window.otsb.components.splides[id] = true;
          // return;
        }

        if (!window.otsb.loadedScript.includes('otsb__slider')) {
          deferScriptLoadOTSB('otsb__slider', window.otsb.sliderScript, initSlider, true);
        } else if (window.Splide) {
          initSlider();
        } else {
          document.addEventListener('otsb__otsb__slider-loaded', () => {
            initSlider();
          });
        }
        // window.otsb.components.splides[id] = true;
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
  });
});

if (!window.otsb.loadedScript.includes('otsb_main_script_loaded')) {
  window.otsb.loadedScript.push('otsb_main_script_loaded');
}
