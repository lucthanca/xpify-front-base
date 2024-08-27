if (typeof window.xParseJSONOTSB != 'function') {
  window.xParseJSONOTSB = jsonString => {
    jsonString = String.raw`${jsonString}`
    jsonString = jsonString.replaceAll('\\', '\\\\').replaceAll('\\"', '"')

    return JSON.parse(jsonString)
  }
}
if (!window.otsb) {
  window.otsb = {}
}
if (!window.otsb.loadedScript) {
  window.otsb.loadedScript = []
}
if (!window.otsb.loadedScript.includes('otsb-popup.js')) {
  window.otsb.loadedScript.push('otsb-popup.js')

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('otsb_xPopups', data => ({
        enable: false,
        showMinimal: false,
        show: Shopify.designMode
          ? localStorage.getItem(data.name + '-' + data.sectionId)
            ? xParseJSONOTSB(
                localStorage.getItem(data.name + '-' + data.sectionId)
              )
            : true
          : false,
        delayDays: data.delayDays ? data.delayDays : 0,
        t: '',
        copySuccess: false,
        loading: false,
        spin: false,
        init() {
          if (Shopify.designMode) {
            var _this = this
            _this.open()
            const handlePopupSelect = (event, isResize = null) => {
              if (
                (event.detail &&
                  event.detail.sectionId.includes(data.sectionId)) ||
                isResize
              ) {
                if (window.Alpine) {
                  _this.open()
                  localStorage.setItem(
                    data.name + '-' + data.sectionId,
                    JSON.stringify(true)
                  )
                } else {
                  document.addEventListener('alpine:initialized', () => {
                    _this.open()
                    localStorage.setItem(
                      data.name + '-' + data.sectionId,
                      JSON.stringify(true)
                    )
                  })
                }
              } else {
                if (window.Alpine) {
                  _this.closeSection()
                  localStorage.setItem(
                    data.name + '-' + data.sectionId,
                    JSON.stringify(false)
                  )
                } else {
                  document.addEventListener('alpine:initialized', () => {
                    _this.closeSection()
                    localStorage.setItem(
                      data.name + '-' + data.sectionId,
                      JSON.stringify(false)
                    )
                  })
                }
              }
            }

            document.addEventListener('shopify:section:select', event => {
              handlePopupSelect(event)
            })

            document.addEventListener('shopify:block:select', event => {
              handlePopupSelect(event)
            })

            //reload popup and display overlay when change screen in shopify admin
            // if (data.name != 'popup-age-verification') {
            //   window.addEventListener('resize', (event)=> {
            //     handlePopupSelect(event, xParseJSONOTSB(localStorage.getItem(data.name + '-' + data.sectionId)));
            //   })
            // }
          }

          const _that = this
          if (data.enable_exit_intent && !Shopify.designMode) {
            document.addEventListener('mouseleave', event => {
              if (event.clientY <= 0) {
                _that.open()
              }
            })
          }
          // listen on submit form#newsletter-data.sectionId
          const formElement = this.$el.querySelector(
            'form#newsletter-' + data.sectionId
          )
          if (formElement && !Shopify.designMode) {
            formElement.addEventListener('submit', event => {
              _that.loading = true
            })
          }

          const thankiuPageSelector = '.otsb-popup__thankiu-' + data.sectionId
          if (this.$el.querySelector(thankiuPageSelector)) {
            this.open()
            return
          }
        },
        load() {
          //optimize popup load js
          if (window.location.pathname === '/challenge') return

          const _this = this
          if (Shopify.designMode) {
            _this.open()
          } else {
            if (data.enable_exit_intent) return
            if (
              data.name == 'popup-promotion' &&
              !this.handleSchedule() &&
              data.showCountdown
            )
              return

            // if (data.name == 'popup-promotion' && document.querySelector("#x-age-popup") && xParseJSONOTSB(localStorage.getItem('popup-age-verification')) == null) {
            //   document.addEventListener("close-age-verification", () => {
            //     setTimeout(() => {
            //       _this.open();
            //     }, data.delays * 1000);
            //   })
            //   return;
            // }

            setTimeout(() => {
              _this.open()
            }, data.delays * 1000)
          }
        },
        open() {
          if (
            data.name == 'popup-spin-wheel' &&
            localStorage.getItem('result-' + data.sectionId)
          ) {
            this.show = true
            this.setOverlay()
            return
          }
          if (data.enable_exit_intent) {
            if (window.innerWidth < 768) {
              if (!data.showOnMobile) {
                this.show = false
                return
              }
            }
            this.show = true
            return
          }
          if (!Shopify.designMode && this.isExpireSave() && !this.show) return

          var _this = this
          // if (data.name == 'popup-age-verification') {
          //   if (this.isExpireSave() && !Shopify.designMode && !data.show_popup) return;

          //   requestAnimationFrame(() => {
          //     document.body.classList.add("overflow-hidden");
          //     Alpine.store('xPopup').open = true;
          //   });
          // }

          //Show minimal when
          // 1. enable show minimal on desktop + default style = minimal + window width >= 768
          // 2. enable show minimal on mobile + default style mobile = minimal + window width < 768
          if (
            (data.showMinimal &&
              data.default_style == 'minimal' &&
              window.innerWidth >= 768) ||
            (data.showMinimalMobile &&
              data.default_style_mobile == 'minimal' &&
              window.innerWidth < 768)
          ) {
            _this.showMinimal = true
            _this.show = false
            if (Shopify.designMode) {
              localStorage.setItem(
                data.name + '-' + data.sectionId,
                JSON.stringify(false)
              )
              _this.removeOverlay()
            }
          } else {
            //Show full popup
            if (
              (data.showOnMobile && window.innerWidth < 768) ||
              window.innerWidth >= 768
            ) {
              //Show a full popup for the first time accessing the site; if the customer closes the full popup, display a minimal popup during the session
              if (
                localStorage.getItem('current-' + data.sectionId) == 'minimal'
              ) {
                _this.showMinimal = true
                _this.show = false
                _this.removeOverlay()
              } else {
                _this.show = true
                _this.showMinimal = false
                _this.setOverlay()
                if (!Shopify.designMode) {
                  _this.saveDisplayedPopup()
                }
              }
            } else {
              //Show nothing when screen < 768 and disable show popup on mobile
              _this.removeOverlay()
            }
          }
        },
        close() {
          if (data.enable_exit_intent) {
            this.show = false
            return
          }
          // if (data.name == 'popup-age-verification') {
          //   requestAnimationFrame(() => {
          //     document.body.classList.remove("overflow-hidden");
          //     Alpine.store('xPopup').open = false;
          //   });
          //   document.dispatchEvent(new Event('close-age-verification'));
          // }
          var _this = this
          if (Shopify.designMode) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                _this.showMinimal = true
              }, 300)
            })
          } else {
            this.removeDisplayedPopup()
            if (
              ((data.showMinimal && window.innerWidth >= 768) ||
                (data.showMinimalMobile && window.innerWidth < 768)) &&
              !this.spin
            ) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  _this.showMinimal = true
                }, 300)
                //Save storage data when closing the full popup (the full popup only shows for the first time accessing the site).
                localStorage.setItem('current-' + data.sectionId, 'minimal')
              })
            } else {
              if (!this.isExpireSave()) {
                this.setExpire()
              }
            }
          }
          requestAnimationFrame(() => {
            setTimeout(() => {
              _this.show = false
              _this.removeOverlay()
            }, 300)
          })
        },
        closeSection() {
          this.show = false
          this.showMinimal = false
          this.removeOverlay()
        },
        setExpire() {
          const item = {
            section: data.sectionId,
            expires: Date.now() + this.delayDays * 24 * 60 * 60 * 1000,
          }

          localStorage.setItem(data.sectionId, JSON.stringify(item))
          //remove storage data, the full popup will be displayed when the site applies the reappear rule.
          localStorage.removeItem('current-' + data.sectionId)
        },
        isExpireSave() {
          const item = xParseJSONOTSB(localStorage.getItem(data.sectionId))
          if (item == null) return false

          if (Date.now() > item.expires && data.delayDays !== 0) {
            localStorage.removeItem(data.sectionId)
            return false
          }

          return true
        },
        handleSchedule() {
          if (data.showCountdown) {
            let el = document.getElementById('x-promotion-' + data.sectionId)
            let settings = xParseJSONOTSB(el.getAttribute('x-countdown-data'))
            if (!Alpine.store('xHelper').canShow(settings)) {
              if (!Shopify.designMode && data.schedule_enabled) {
                requestAnimationFrame(() => {
                  this.show = false
                })

                return false
              }
            }
          }

          this.enable = true
          return true
        },
        clickMinimal() {
          requestAnimationFrame(() => {
            this.show = true
            this.showMinimal = false
            if (!Shopify.designMode) {
              this.saveDisplayedPopup()
            }
            this.setOverlay()
          })
        },
        setOverlay() {
          let popupsDiv = document.querySelector('#otsb-popup-exit-intent')
          if (popupsDiv.classList.contains('bg-[#acacac]')) return
          if (data.overlay) {
            popupsDiv.className += ' bg-[#acacac] bg-opacity-30'
          }
        },
        removeOverlay() {
          let popupsDiv = document.querySelector('#otsb-popup-exit-intent')
          if (data.name === 'popup-spin-wheel') {
            popupsDiv.classList.remove('bg-[#acacac]', 'bg-opacity-30')
          }
          displayedPopups =
            xParseJSONOTSB(localStorage.getItem('promotion-popup')) || []
          if (
            popupsDiv.classList.contains('bg-[#acacac]') &&
            displayedPopups.length == 0
          ) {
            popupsDiv.classList.remove('bg-[#acacac]', 'bg-opacity-30')
          }
        },
        //close minimal popup will set expired
        closeMinimal() {
          this.showMinimal = false
          if (Shopify.designMode) return

          if (!this.isExpireSave()) this.setExpire()
        },
        saveDisplayedPopup() {
          let localStorageArray =
            xParseJSONOTSB(localStorage.getItem('promotion-popup')) || []
          if (
            !localStorageArray.some(
              item => item == data.name + '-' + data.sectionId
            )
          ) {
            localStorageArray.push(data.name + '-' + data.sectionId)
            localStorage.setItem(
              'promotion-popup',
              JSON.stringify(localStorageArray)
            )
          }
        },
        removeDisplayedPopup() {
          let localStorageArray = xParseJSONOTSB(
              localStorage.getItem('promotion-popup')
            ),
            updatedArray = localStorageArray.filter(
              item => item != data.name + '-' + data.sectionId
            )
          localStorage.setItem('promotion-popup', JSON.stringify(updatedArray))
        },
        setSpin() {
          this.spin = true
        },
      }))
      Alpine.data('otsb_xPopupsSpin', data => ({
        init() {
          const jsonString = data.data_wheel.replace(/'/g, '"')

          // Parse the JSON string
          const item = JSON.parse(jsonString)
          document.addEventListener('shopify:block:load', function () {
            creatSvg()
          })
          if (document.getElementById('chart').innerHTML.trim() === '') {
            creatSvg()
          }
          if (localStorage.getItem('result-' + data.sectionId)) {
            var result = JSON.parse(
              localStorage.getItem('result-' + data.sectionId)
            )
            showSuccess(result.picked)
          }

          function showSuccess(picked) {
            var wheel = document.getElementById('otsb-wheel-' + data.sectionId),
              success = document.getElementById(
                'otsb-wheel-success-' + data.sectionId
              ),
              heading = document.getElementById(
                'otsb-success-heading-' + data.sectionId
              ),
              subheading = document.getElementById(
                'otsb-success-subheading-' + data.sectionId
              ),
              code = document.getElementById(
                'otsb-success-code-' + data.sectionId
              )
            heading.append(item[picked].heading)
            subheading.append(item[picked].subheading)
            if (item[picked].code !== '') {
              code.append(item[picked].code)
            } else {
              code.classList.add('hidden')
              document
                .getElementsByClassName('otsb-code-' + data.sectionId)[0]
                .classList.add('hidden')
            }

            // Add active class to next content
            changeButtonClose()
            success.classList.add('active')
            wheel.classList.remove('previous')
            wheel.classList.add('hidden')
            success.classList.remove('hidden')
            success.classList.add('visible')
          }

          function changeButtonClose() {
            var wheel = document.getElementById(
                'PromotionPopupClose-' + data.sectionId
              ),
              success = document.getElementById(
                'PromotionPopupClose-Success-' + data.sectionId
              )
            wheel.classList.add('hidden')
            success.classList.remove('hidden')
          }

          function creatSvg() {
            var padding = { top: 20, right: 40, bottom: 0, left: 0 },
              w = 300 - padding.left - padding.right,
              h = 300 - padding.top - padding.bottom,
              r = Math.min(w, h) / 2,
              rotation = 0,
              oldrotation = 0,
              picked = 100000,
              oldpick = []

            var svg = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'svg'
            )
            svg.setAttribute('width', 270)
            svg.setAttribute('height', h + padding.top + padding.bottom)
            document.getElementById('chart').appendChild(svg)

            var container = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'g'
            )
            container.setAttribute('class', 'chartholder')
            container.setAttribute(
              'transform',
              'translate(' +
                (w / 2 + padding.left + 5) +
                ',' +
                (h / 2 + padding.top) +
                ')'
            )
            svg.appendChild(container)

            var vis = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'g'
            )
            container.appendChild(vis)

            var pie = function (item) {
              var pieData = []
              var sum = item.reduce(function (a, b) {
                return a + 1
              }, 0)
              var startAngle = 0
              item.forEach(function (d) {
                var angle = (1 / sum) * Math.PI * 2
                pieData.push({
                  item: d,
                  value: 1,
                  startAngle: startAngle,
                  endAngle: startAngle + angle,
                })
                startAngle += angle
              })
              return pieData
            }

            var arc = function (d) {
              var path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
              )
              var x1 = r * Math.cos(d.startAngle - Math.PI / 2)
              var y1 = r * Math.sin(d.startAngle - Math.PI / 2)
              var x2 = r * Math.cos(d.endAngle - Math.PI / 2)
              var y2 = r * Math.sin(d.endAngle - Math.PI / 2)
              var d =
                'M0,0L' +
                x1 +
                ',' +
                y1 +
                'A' +
                r +
                ',' +
                r +
                ' 0 ' +
                (d.endAngle - d.startAngle > Math.PI ? 1 : 0) +
                ',1 ' +
                x2 +
                ',' +
                y2 +
                'Z'
              path.setAttribute('d', d)
              return path
            }

            var arcs = pie(item).map(function (d) {
              var g = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'g'
              )
              g.setAttribute('class', 'slice')

              var path = arc(d)
              path.setAttribute('fill', d.item.color)
              g.appendChild(path)

              var text = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
              )
              var angle = (d.startAngle + d.endAngle) / 2
              var x = (r - 10) * Math.cos(angle - Math.PI / 2)
              var y = (r - 10) * Math.sin(angle - Math.PI / 2)
              text.setAttribute(
                'transform',
                'translate(' +
                  x +
                  ',' +
                  y +
                  ') rotate(' +
                  ((angle * 180) / Math.PI - 90) +
                  ')'
              )
              text.setAttribute('text-anchor', 'end')
              text.textContent = d.item.label
              g.appendChild(text)

              return g
            })

            arcs.forEach(function (g) {
              vis.appendChild(g)
            })
            var circle = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'circle'
            )
            circle.setAttribute('cx', 0)
            circle.setAttribute('cy', 0)
            circle.setAttribute('r', 20)
            circle.style.fill = 'white'
            circle.style.cursor = 'pointer'
            container.appendChild(circle)

            var borderCircle = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'circle'
            )
            borderCircle.setAttribute('cx', 0)
            borderCircle.setAttribute('cy', 0)
            borderCircle.setAttribute('r', r)
            borderCircle.setAttribute('fill', 'none')
            borderCircle.setAttribute('stroke', 'black')

            var buttonSpin =
              document.getElementById('submit-spin-' + data.sectionId) ??
              container
            var submit = document.getElementById(
              'submit-button-' + data.sectionId
            )
            var closeButton = document.getElementById(
              'PromotionPopupClose-Success-' + data.sectionId
            )
            const form = document.getElementById('newsletter-' + data.sectionId)

            buttonSpin.addEventListener('click', spin)

            closeButton.addEventListener('click', resetModal)

            function validate() {
              submit.click()
            }

            function resetModal() {
              localStorage.removeItem('result-' + data.sectionId)
            }

            function spin() {
              const inputEmail = document.getElementById(
                'Email--' + data.sectionId
              ).value
              const error = false
              const format = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]/

              if (!inputEmail || !format.test(inputEmail)) {
                validate()
                return
              }

              buttonSpin.removeEventListener('click', spin)

              if (oldpick.length == item.length) {
                container.removeEventListener('click', spin)
                return
              }

              var ps = 360 / item.length
              var pieslice = Math.round(1440 / item.length)
              var rng = Math.floor(Math.random() * 1440 + 3600)

              rotation = Math.round(rng / ps) * ps

              picked = Math.round(item.length - (rotation % 360) / ps)
              picked = picked >= item.length ? picked % item.length : picked

              if (oldpick.indexOf(picked) !== -1) {
                spin()
                return
              } else {
                oldpick.push(picked)
              }

              rotation += Math.round(ps / 2) - 35
              animateRotation()

              function animateRotation() {
                var start = oldrotation % 360
                var end = rotation
                var duration = 3000
                var startTime = null

                function easeOutCubic(t) {
                  return --t * t * t + 1
                }

                function animate(time) {
                  if (!startTime) startTime = time
                  var progress = time - startTime
                  var t = Math.min(progress / duration, 1)
                  var easedT = easeOutCubic(t)
                  var current = start + (end - start) * easedT
                  vis.setAttribute('transform', 'rotate(' + current + ')')
                  if (t < 1) {
                    requestAnimationFrame(animate)
                  } else {
                    oldrotation = rotation
                    buttonSpin.addEventListener('click', spin)
                    setTimeout(function () {
                      // ajaxFormInit(form);
                      if (!isExpireSave()) {
                        setExpire()
                      }
                      setResult(picked)
                      submit.click()
                    }, 1000) // Gọi hàm showSuccess sau khi vòng quay hoàn tất
                  }
                }

                requestAnimationFrame(animate)
              }

              function setResult(picked) {
                const item = {
                  section: data.sectionId,
                  picked: picked,
                }
                localStorage.setItem(
                  'result-' + data.sectionId,
                  JSON.stringify(item)
                )
              }

              function setExpire() {
                const item = {
                  section: data.sectionId,
                  expires: Date.now() + data.delayDays * 24 * 60 * 60 * 1000,
                }

                localStorage.setItem(data.sectionId, JSON.stringify(item))
                //remove storage data, the full popup will be displayed when the site applies the reappear rule.
                localStorage.removeItem('current-' + data.sectionId)
              }

              function isExpireSave() {
                const item = xParseJSONOTSB(
                  localStorage.getItem(data.sectionId)
                )
                if (item == null) return false

                if (Date.now() > item.expires) {
                  localStorage.removeItem(data.sectionId)
                  return false
                }

                return true
              }
            }
          }
        },
      }))
      Alpine.data('otsb_xPopupsSpinSuccess', data => ({
        init() {
          const jsonString = data.data_wheel.replace(/'/g, '"')

          // Parse the JSON string
          const item = JSON.parse(jsonString)
          const wheel = document.getElementById('otsb-wheel-' + data.sectionId),
            success = document.getElementById(
              'otsb-wheel-success-' + data.sectionId
            ),
            heading = document.getElementById(
              'otsb-success-heading-' + data.sectionId
            ),
            subheading = document.getElementById(
              'otsb-success-subheading-' + data.sectionId
            ),
            code = document.getElementById(
              'otsb-success-code-' + data.sectionId
            )
          document.addEventListener('shopify:block:select', event => {
            console.log('run: otsb_xPopupsSpinSuccess')
            const selectedBlockId = event.detail.blockId
            if (data.block_id === selectedBlockId) {
              showSuccess(2)
            }
          })
          document.addEventListener('shopify:block:deselect', event => {
            console.log('run: otsb_xPopupsSpinSuccess')
            const selectedBlockId = event.detail.blockId
            if (data.block_id === selectedBlockId) {
              showSpin()
            }
          })

          function showSuccess(picked) {
            if (heading.innerHTML.trim() === '') {
              heading.append(item[picked].heading)
              subheading.append(item[picked].subheading)
              if (item[picked].code !== '') {
                code.append(item[picked].code)
              } else {
                code.classList.add('hidden')
                document
                  .getElementsByClassName('otsb-code-' + data.sectionId)[0]
                  .classList.add('hidden')
              }
            }

            // Add active class to next content
            // changeButtonClose()
            success.classList.add('active')
            wheel.classList.remove('previous')
            wheel.classList.add('hidden')
            success.classList.remove('hidden')
            success.classList.add('visible')
          }
          function showSpin() {
            wheel.classList.add('active')
            success.classList.remove('previous')
            success.classList.add('hidden')
            wheel.classList.remove('hidden')
            wheel.classList.add('visible')
          }

          function changeButtonClose() {
            var wheel = document.getElementById(
                'PromotionPopupClose-' + data.sectionId
              ),
              success = document.getElementById(
                'PromotionPopupClose-Success-' + data.sectionId
              )
            wheel.classList.add('hidden')
            success.classList.remove('hidden')
          }
        },
      }))
    })
  })
}
document.addEventListener('shopify:section:load', function (event) {
  // Kiểm tra nếu section chứa lớp 'spin' thì khởi động lại Alpine.js
  if (event.target.classList.contains('otsb-spin-wheel')) {
    Alpine.initTree(event.target)
  }
})
document.addEventListener('shopify:section:select', function (event) {
  if (event.target.classList.contains('otsb-spin-wheel')) {
    Alpine.initTree(event.target)
  }
})
if (!window.otsb.loadedScript.includes('otsb-popup-intent.js')) {
  window.otsb.loadedScript.push('otsb-popup-intent.js')
  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.store('otsb_xPopupExitIntent', {
        thankiu_page_active_blocks: {},
      })
      Alpine.data('otsb_popupIntent', (blockId, sectionId) => {
        return {
          init() {
            if (Shopify && Shopify.designMode) {
              document.addEventListener('shopify:block:select', event => {
                const selectedBlockId = event.detail.blockId
                console.log(
                  Alpine.store('otsb_xPopupExitIntent')
                    ?.thankiu_page_active_blocks
                )
                if (
                  !Alpine.store('otsb_xPopupExitIntent')
                    ?.thankiu_page_active_blocks?.[blockId]
                ) {
                  Alpine.store(
                    'otsb_xPopupExitIntent'
                  ).thankiu_page_active_blocks[blockId] = false
                }
                Alpine.store(
                  'otsb_xPopupExitIntent'
                ).thankiu_page_active_blocks[blockId] =
                  selectedBlockId === blockId
                console.log('Runnnn')
              })

              document.addEventListener('shopify:block:deselect', event => {
                const selectedBlockId = event.detail.blockId
                if (selectedBlockId == blockId) {
                  Alpine.store(
                    'otsb_xPopupExitIntent'
                  ).thankiu_page_active_blocks[blockId] = false
                }
              })
            }
          },
        }
      })
    })
  })
}
if (!window.otsb.loadedScript.includes('otsb-flashsales.js')) {
  window.otsb.loadedScript.push('otsb-flashsales.js')
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
          const now = deadline
          let distance = endTime - now
          if (distance < 0 && configs.next_timer > 0) {
            if (configs.loop_next_timer === true) {
              const cycleTime = (configs.next_timer + 1) * 1000
              const timeElapsedSinceInitialEnd = now - initialEndTime
              const cyclesElapsed = Math.floor(
                timeElapsedSinceInitialEnd / cycleTime
              )
              endTime = initialEndTime + (cyclesElapsed + 1) * cycleTime
              distance = endTime - now
            } else {
              endTime = initialEndTime + configs.next_timer * 1000
              distance = endTime - now
            }
          }
          return [distance, endTime]
        },
        countdown(configs, callback) {
          const calculateAdjustedTime = function (date, tz) {
            return (
              date.getTime() +
              (-1 * tz * 60 - date.getTimezoneOffset()) * 60 * 1000
            )
          }
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          )
          const initialEndTime = calculateAdjustedTime(
            endDate,
            configs.timezone
          )
          let endTime = initialEndTime

          let startTime
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            )
            startTime = calculateAdjustedTime(startDate, configs.timezone)
          } else {
            startTime = new Date().getTime()
          }
          let last = 0
          let that = this
          function updateCountdown() {
            const now = new Date().getTime()
            let distance = -1
            ;[distance, endTime] = that.calculateCountdownDistance(
              configs,
              initialEndTime,
              endTime,
              now
            )
            if (distance < 0 || startTime > now) {
              callback(false, 0, 0, 0, 0)
              return
            }
            if (!last || now - last >= 1000) {
              const days = Math.floor(distance / (1000 * 60 * 60 * 24))
              const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              )
              const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              )
              const seconds = Math.floor((distance % (1000 * 60)) / 1000)
              callback(
                true,
                seconds.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                hours,
                days
              )
              last = now
            }
            requestAnimationFrame(updateCountdown)
          }
          requestAnimationFrame(updateCountdown)
        },
        canShow(configs) {
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          )
          const initialEndTime =
            endDate.getTime() +
            (-1 * configs.timezone * 60 - endDate.getTimezoneOffset()) *
              60 *
              1000
          let endTime = initialEndTime

          let startTime
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            )
            startTime =
              startDate.getTime() +
              (-1 * configs.timezone * 60 - startDate.getTimezoneOffset()) *
                60 *
                1000
          } else {
            startTime = new Date().getTime()
          }
          const now = new Date().getTime()
          let distance = -1
          ;[distance, endTime] = this.calculateCountdownDistance(
            configs,
            initialEndTime,
            endTime,
            now
          )
          if (distance < 0 || startTime > now) {
            return false
          }
          return true
        },
        handleTime(configs) {
          let endDate = new Date(
            configs.end_year,
            configs.end_month - 1,
            configs.end_day,
            configs.end_hour,
            configs.end_minute
          )
          const initialEndTime =
            endDate.getTime() +
            (-1 * configs.timezone * 60 - endDate.getTimezoneOffset()) *
              60 *
              1000
          let endTime = initialEndTime

          let startTime
          if (configs.start_year) {
            let startDate = new Date(
              configs.start_year,
              configs.start_month - 1,
              configs.start_day,
              configs.start_hour,
              configs.start_minute
            )
            startTime =
              startDate.getTime() +
              (-1 * configs.timezone * 60 - startDate.getTimezoneOffset()) *
                60 *
                1000
          } else {
            startTime = new Date().getTime()
          }
          const now = new Date().getTime()
          let distance = -1
          ;[distance, endTime] = this.calculateCountdownDistance(
            configs,
            initialEndTime,
            endTime,
            now
          )
          return {
            startTime: startTime,
            endTime: endTime,
            now: now,
            distance: distance,
          }
        },
      })
    })
  })
}
if (!window.otsb.loadedScript.includes('coupon-code.js')) {
  window.otsb.loadedScript.push('coupon-code.js')

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('otsb_xCounponCodeList', sectionId => ({
        loading: true,
        load() {
          this.loading = true
          let url = `${window.location.pathname}?section_id=${sectionId}`
          fetch(url, {
            method: 'GET',
          })
            .then(response => response.text())
            .then(responseText => {
              const html = new DOMParser().parseFromString(
                responseText,
                'text/html'
              )
              const contentId = `x-promo-code-list-${sectionId}`
              const newContent = html.getElementById(contentId)
              if (newContent && !document.getElementById(contentId)) {
                container.appendChild(newContent)
              }
              this.loading = false
            })
        },
      }))

      Alpine.data('otsb_xCounponCode', () => ({
        coppySuccess: false,
        loading: false,
        disableCoupon: false,
        disableComing: false,
        discountCode: '',
        errorMessage: false,
        appliedDiscountCode: false,
        load(discountCode) {
          this.setAppliedButton(discountCode)
          document.addEventListener(`eurus:cart:discount-code:change`, e => {
            this.setAppliedButton(discountCode)
          })
        },
        copyCode() {
          if (this.coppySuccess) return

          const discountCode = this.$refs.code_value.textContent.trim()
          navigator.clipboard.writeText(discountCode).then(
            () => {
              this.coppySuccess = true

              setTimeout(() => {
                this.coppySuccess = false
              }, 5000)
            },
            () => {
              alert('Copy fail')
            }
          )
        },
        applyCouponCode(discountCode, isCart = false) {
          let appliedDiscountCodes = JSON.parse(
            JSON.stringify(
              Alpine.store('otsb_xCounponCodeDetail').appliedDiscountCodes
            )
          )
          if (
            discountCode &&
            appliedDiscountCodes.indexOf(discountCode) != -1
          ) {
            return true
          }
          if (discountCode) {
            let discountCodes =
              appliedDiscountCodes.length > 0
                ? [...appliedDiscountCodes, discountCode].join(',')
                : discountCode
            document.cookie = `eurus_discount_code=${discountCodes}; path=/`

            this.loading = true

            fetch(`/checkout?discount=${discountCodes}`)
              .then(() => {
                fetch('/cart/update.js', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sections: Alpine.store('xCartHelper')
                      .getSectionsToRender()
                      .map(section => section.id),
                  }),
                })
                  .then(response => {
                    return response.json()
                  })
                  .then(response => {
                    if (response.status != '422') {
                      Alpine.store('xCartHelper')
                        .getSectionsToRender()
                        .forEach(section => {
                          const sectionElement = document.querySelector(
                            section.selector
                          )
                          if (sectionElement) {
                            if (response.sections[section.id])
                              sectionElement.innerHTML = getSectionInnerHTML(
                                response.sections[section.id],
                                section.selector
                              )
                          }
                        })

                      Alpine.store(
                        'otsb_xCounponCodeDetail'
                      ).appliedDiscountCodes.push(discountCode)
                      Alpine.store('xCartHelper').currentItemCount = parseInt(
                        document.querySelector('#cart-icon-bubble span')
                          .innerHTML
                      )
                      document.dispatchEvent(
                        new CustomEvent(`eurus:cart:discount-code:change`)
                      )
                      if (isCart == false) {
                        this.setAppliedButton(discountCode)
                        if (Alpine.store('xCartHelper').currentItemCount == 0) {
                          const elementError = this.$el
                            .closest('.promo-code-item')
                            .querySelector('.error-message')
                          this.errorMessage = true
                          elementError.classList.remove('hidden', 'opacity-0')
                          elementError.classList.add('block', 'opacity-100')

                          setTimeout(function () {
                            elementError.classList.remove(
                              'block',
                              'opacity-100'
                            )
                            elementError.classList.add('hidden', 'opacity-0')
                          }, 3000)
                        } else {
                          this.errorMessage = false
                          Alpine.store('xMiniCart').openCart()
                        }
                      }
                    }
                  })
                  .finally(() => {
                    this.loading = false
                  })
              })
              .catch(function (error) {
                console.error('Error:', error)
              })
          }
        },
        handleScheduleCoupon(el) {
          let settings = xParseJSONOTSB(el.getAttribute('x-countdown-data'))
          let timeSettings = Alpine.store('xHelper').handleTime(settings)
          if (timeSettings.distance < 0 && settings.set_end_date) {
            this.disableCoupon = true
          } else if (timeSettings.startTime > timeSettings.now) {
            this.disableCoupon = true
            this.disableComing = true
          }
        },
        onChange() {
          this.discountCode = this.$el.value
        },
        applyDiscountToCart() {
          this.applyCouponCode(this.discountCode, true)
        },
        setAppliedButton(discountCode) {
          let appliedDiscountCodes = JSON.parse(
            JSON.stringify(
              Alpine.store('otsb_xCounponCodeDetail').appliedDiscountCodes
            )
          )
          if (
            discountCode &&
            appliedDiscountCodes.indexOf(discountCode) != -1
          ) {
            this.appliedDiscountCode = true
          } else {
            this.appliedDiscountCode = false
          }
        },
      }))

      Alpine.store('otsb_xCounponCodeDetail', {
        show: false,
        promoCodeDetail: {},
        sectionID: '',
        discountCodeApplied: '',
        appliedDiscountCodes: [],
        cachedResults: [],
        loading: false,
        cartEmpty: true,
        handleCouponSelect(shopUrl) {
          var _this = this
          const promoCodeDetail = JSON.parse(
            JSON.stringify(this.promoCodeDetail)
          )

          document.addEventListener('shopify:section:select', function (event) {
            if (
              event.target.classList.contains('section-promo-code') == false
            ) {
              if (window.Alpine) {
                _this.close()
              } else {
                document.addEventListener('alpine:initialized', () => {
                  _this.close()
                })
              }
            }
          })

          if (
            promoCodeDetail &&
            promoCodeDetail.blockID &&
            promoCodeDetail.sectionID
          ) {
            this.promoCodeDetail = xParseJSONOTSB(
              document
                .getElementById('x-data-promocode-' + promoCodeDetail.blockID)
                .getAttribute('x-data-promocode')
            )
            let contentContainer = document.getElementById(
              'PromoCodeContent-' + this.promoCodeDetail.sectionID
            )
            if (this.cachedResults[this.promoCodeDetail.blockID]) {
              contentContainer.innerHTML =
                this.cachedResults[this.promoCodeDetail.blockID]
              return true
            }
            if (this.promoCodeDetail.page != '') {
              let url = `${shopUrl}/pages/${this.promoCodeDetail.page}`
              fetch(url, {
                method: 'GET',
              })
                .then(response => response.text())
                .then(responseText => {
                  const html = new DOMParser().parseFromString(
                    responseText,
                    'text/html'
                  )
                  contentContainer.innerHTML = html.querySelector(
                    '.page__container .page__body'
                  ).innerHTML
                })
            } else if (this.promoCodeDetail.details != '') {
              contentContainer.innerHTML = this.promoCodeDetail.details
              contentContainer.innerHTML = contentContainer.textContent
            }
          }
        },
        load(el, blockID, shopUrl) {
          this.promoCodeDetail = xParseJSONOTSB(
            el
              .closest('#x-data-promocode-' + blockID)
              .getAttribute('x-data-promocode')
          )
          let contentContainer = document.getElementById(
            'PromoCodeContent-' + this.promoCodeDetail.sectionID
          )
          this.sectionID = this.promoCodeDetail.sectionID
          if (this.cachedResults[blockID]) {
            contentContainer.innerHTML = this.cachedResults[blockID]
            return true
          }
          if (this.promoCodeDetail.page != '') {
            this.loading = true
            let url = `${shopUrl}/pages/${this.promoCodeDetail.page}`
            fetch(url, {
              method: 'GET',
            })
              .then(response => response.text())
              .then(responseText => {
                const html = new DOMParser().parseFromString(
                  responseText,
                  'text/html'
                )
                const content = html.querySelector(
                  '.page__container .page__body'
                ).innerHTML
                contentContainer.innerHTML = content
                this.cachedResults[blockID] = content
              })
              .finally(() => {
                this.loading = false
              })
          } else if (this.promoCodeDetail.details != '') {
            contentContainer.innerHTML = this.promoCodeDetail.details
            contentContainer.innerHTML = contentContainer.textContent
          }
        },
        showPromoCodeDetail() {
          this.show = true
          Alpine.store('xPopup').open = true
        },
        close() {
          this.show = false
          Alpine.store('xPopup').open = false
        },
        getDiscountCode() {
          let cookieValue = document.cookie.match(
            '(^|;)\\s*' + 'eurus_discount_code' + '\\s*=\\s*([^;]+)'
          )
          let appliedDiscountCodes = cookieValue ? cookieValue.pop() : ''
          if (appliedDiscountCodes) {
            this.appliedDiscountCodes = appliedDiscountCodes.split(',')
          }
        },
      })
    })
  })
}
if (!window.otsb.loadedScript.includes('otsb-event-calendar')) {
  window.otsb.loadedScript.push('otsb-event-calendar')
  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('xEventCalendar', event => ({
        open: false,
        eventDetails: {},
        addToCal(options) {
          let link = ''
          let timeEnd = ''
          this.eventDetails = event

          if (!event) {
            this.eventDetails = JSON.parse(
              JSON.stringify(Alpine.store('xEventCalendarDetail').eventDetail)
            )
          }

          let timeStart = this.handleTime(
            this.eventDetails.start_year,
            this.eventDetails.month,
            this.eventDetails.day,
            this.eventDetails.start_hour,
            this.eventDetails.start_minute,
            options
          )

          if (this.eventDetails.show_end_date) {
            timeEnd = this.handleTime(
              this.eventDetails.end_year,
              this.eventDetails.end_month,
              this.eventDetails.end_day,
              this.eventDetails.end_hour,
              this.eventDetails.end_minute,
              options
            )
          } else if (this.eventDetails.show_end_time) {
            timeEnd = this.handleTime(
              this.eventDetails.start_year,
              this.eventDetails.month,
              this.eventDetails.day,
              this.eventDetails.end_hour,
              this.eventDetails.end_minute,
              options
            )
          } else {
            timeEnd = timeStart
          }

          switch (options) {
            case 'apple':
              this.createDownloadICSFile(
                0,
                timeStart,
                timeEnd,
                this.eventDetails.title,
                this.eventDetails.details,
                this.eventDetails.location,
                'apple'
              )
              break
            case 'google':
              link =
                'http://www.google.com/calendar/event?action=TEMPLATE&trp=false' +
                '&text=' +
                encodeURIComponent(this.eventDetails.title) +
                '&dates=' +
                timeStart +
                '/' +
                timeEnd +
                '&location=' +
                encodeURIComponent(this.eventDetails.location) +
                '&details=' +
                encodeURIComponent(this.eventDetails.details)
              window.open(link)
              break
            case 'outlook':
              link =
                'https://outlook.live.com/calendar/action/compose?rru=addevent' +
                '&startdt=' +
                timeStart +
                '&enddt=' +
                timeEnd +
                '&subject=' +
                encodeURIComponent(this.eventDetails.title) +
                '&location=' +
                encodeURIComponent(this.eventDetails.location) +
                '&body=' +
                encodeURIComponent(this.eventDetails.details)
              window.open(link)
              break
            case 'yahoo':
              link =
                'http://calendar.yahoo.com/?v=60' +
                '&st=' +
                timeStart +
                '&et=' +
                timeEnd +
                '&title=' +
                encodeURIComponent(this.eventDetails.title)
              window.open(link)
              break
            case 'ical':
              this.createDownloadICSFile(
                0,
                timeStart,
                timeEnd,
                this.eventDetails.title,
                this.eventDetails.details,
                this.eventDetails.location,
                'ical'
              )
              break
            default:
              console.log(`Sorry, error`)
          }
        },
        handleTime(year, month, day, hour, minute, options) {
          let date = new Date()

          if (options == 'google' || options == 'yahoo') {
            date = new Date(
              Date.UTC(
                year,
                this.getMonthNumber(month),
                parseInt(day),
                parseInt(hour),
                parseInt(minute)
              )
            )
            date.setTime(
              date.getTime() +
                (-1 * parseInt(this.eventDetails.timezone) * 60 -
                  date.getTimezoneOffset()) *
                  60 *
                  1000
            )
            return date
              .toISOString()
              .split('Z')[0]
              .replace('.000', '')
              .replace(/[^A-Z0-9]/gi, '')
          } else {
            date = new Date(
              year,
              this.getMonthNumber(month),
              parseInt(day),
              parseInt(hour),
              parseInt(minute)
            )
            date.setTime(
              date.getTime() +
                (-1 * parseInt(this.eventDetails.timezone) * 60 -
                  date.getTimezoneOffset()) *
                  60 *
                  1000
            )
            if (options == 'apple') {
              return date
                .toISOString()
                .split('Z')[0]
                .replace('.000', '')
                .replace(/[^A-Z0-9]/gi, '')
            } else {
              return date.toISOString()
            }
          }
        },
        getMonthNumber(month) {
          return new Date(`${month} 1, 2022`).getMonth()
        },
        createDownloadICSFile(
          timezone,
          timeStart,
          timeEnd,
          title,
          description,
          location,
          type
        ) {
          let icsBody =
            'BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n' +
            'PRODID:Calendar\n' +
            'CALSCALE:GREGORIAN\n' +
            'METHOD:PUBLISH\n' +
            'BEGIN:VTIMEZONE\n' +
            'TZID:' +
            timezone +
            '\n' +
            'END:VTIMEZONE\n' +
            'BEGIN:VEVENT\n' +
            'SUMMARY:' +
            title +
            '\n' +
            'UID:@Default\n' +
            'SEQUENCE:0\n' +
            'STATUS:CONFIRMED\n' +
            'TRANSP:TRANSPARENT\n' +
            'DTSTART;TZID=' +
            timezone +
            ':' +
            timeStart +
            '\n' +
            'DTEND;TZID=' +
            timezone +
            ':' +
            timeEnd +
            '\n' +
            'LOCATION:' +
            location +
            '\n' +
            'DESCRIPTION:' +
            description +
            '\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR\n'

          this.download(title + '.ics', icsBody, type)
        },
        download(filename, fileBody, type) {
          var element = document.createElement('a')

          if (type == 'ical') {
            element.setAttribute(
              'href',
              'data:text/plain;charset=utf-8,' + encodeURIComponent(fileBody)
            )
          } else if (type == 'apple') {
            var file = new Blob([fileBody], {
              type: 'text/calendar;charset=utf-8',
            })
            element.href = window.URL.createObjectURL(file)
          }

          element.setAttribute('download', filename)
          element.style.display = 'none'
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
        },
      }))

      Alpine.store('xEventCalendarDetail', {
        show: false,
        eventDetail: {},
        handleEventSelect() {
          var _this = this
          const eventDetail = JSON.parse(JSON.stringify(this.eventDetail))

          document.addEventListener('shopify:section:select', function (event) {
            if (
              event.target.classList.contains('section-event-calendar') == false
            ) {
              if (window.Alpine) {
                _this.close()
              } else {
                document.addEventListener('alpine:initialized', () => {
                  _this.close()
                })
              }
            }
          })

          if (eventDetail && eventDetail.blockID && eventDetail.sectionID) {
            this.eventDetail = xParseJSONOTSB(
              document
                .getElementById('x-data-event-' + eventDetail.blockID)
                .getAttribute('x-event-data')
            )
            let element = document.getElementById(
              'EventDescription-' + this.eventDetail.sectionID
            )
            element.innerHTML = this.eventDetail.description
            element.innerHTML = element.textContent
          }
        },
        load(el, blockID) {
          this.eventDetail = xParseJSONOTSB(
            el.closest('#x-data-event-' + blockID).getAttribute('x-event-data')
          )
          let element = document.getElementById(
            'EventDescription-' + this.eventDetail.sectionID
          )
          this.sectionID = this.eventDetail.sectionID
          element.innerHTML = this.eventDetail.description
          element.innerHTML = element.textContent
          this.showEventCalendarDetail()
        },
        showEventCalendarDetail() {
          this.show = true
          Alpine.store('xPopup').open = true
        },
        close() {
          this.show = false
          Alpine.store('xPopup').open = false
        },
      })
    })
  })
}

function otsbXmapRefreshMapPosition(
  selector,
  screen_md,
  content_position,
  isContent = true
) {
  const targetEl = document.querySelector(selector)
  if (!targetEl) {
    console.error('OT: Map initialized failed.')
    return
  }
  const invalid = document.documentElement.clientWidth < screen_md
  if (content_position === 'top-left' || invalid) {
    targetEl.style.width = '100%'
    if (isContent) targetEl.style.display = 'none'
    return
  }

  const rect = targetEl.parentNode.getBoundingClientRect()
  let right = rect.right
  let space = document.documentElement.clientWidth - right
  const compare_position = isContent ? 'left' : 'right'
  if (content_position === compare_position) {
    left = rect.left
    space = left
    targetEl.style.left = `-${space}px`
  }

  let width = '100%'
  if (space > 0) {
    width = `calc(100% + ${space}px)`
  }
  targetEl.style.width = width

  if (isContent) {
    if (space > 0) {
      targetEl.style.display = 'block'
    } else {
      targetEl.style.display = 'none'
    }
  }
}
// cursor gif effect
"use strict";(()=>{var we=Object.create;var he=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var Ae=Object.getOwnPropertyNames;var ve=Object.getPrototypeOf,pe=Object.prototype.hasOwnProperty;var ye=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var xe=(t,e,a,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ae(e))!pe.call(t,n)&&n!==a&&he(t,n,{get:()=>e[n],enumerable:!(u=ge(e,n))||u.enumerable});return t};var Ee=(t,e,a)=>(a=t!=null?we(ve(t)):{},xe(e||!t||!t.__esModule?he(a,"default",{value:t,enumerable:!0}):a,t));var fe=ye(ie=>{"use strict";function Ce(t,e,a,o){var n=0,o=o===void 0?{}:o,c=o.loop===void 0?null:o.loop,d=o.palette===void 0?null:o.palette;if(e<=0||a<=0||e>65535||a>65535)throw new Error("Width/Height invalid.");function m(y){var g=y.length;if(g<2||g>256||g&g-1)throw new Error("Invalid code/color length, must be power of 2 and 2 .. 256.");return g}t[n++]=71,t[n++]=73,t[n++]=70,t[n++]=56,t[n++]=57,t[n++]=97;var w=0,h=0;if(d!==null){for(var r=m(d);r>>=1;)++w;if(r=1<<w,--w,o.background!==void 0){if(h=o.background,h>=r)throw new Error("Background index out of range.");if(h===0)throw new Error("Background index explicitly passed as 0.")}}if(t[n++]=e&255,t[n++]=e>>8&255,t[n++]=a&255,t[n++]=a>>8&255,t[n++]=(d!==null?128:0)|w,t[n++]=h,t[n++]=0,d!==null)for(var x=0,b=d.length;x<b;++x){var p=d[x];t[n++]=p>>16&255,t[n++]=p>>8&255,t[n++]=p&255}if(c!==null){if(c<0||c>65535)throw new Error("Loop count invalid.");t[n++]=33,t[n++]=255,t[n++]=11,t[n++]=78,t[n++]=69,t[n++]=84,t[n++]=83,t[n++]=67,t[n++]=65,t[n++]=80,t[n++]=69,t[n++]=50,t[n++]=46,t[n++]=48,t[n++]=3,t[n++]=1,t[n++]=c&255,t[n++]=c>>8&255,t[n++]=0}var C=!1;this.addFrame=function(y,g,B,_,E,f){if(C===!0&&(--n,C=!1),f=f===void 0?{}:f,y<0||g<0||y>65535||g>65535)throw new Error("x/y invalid.");if(B<=0||_<=0||B>65535||_>65535)throw new Error("Width/Height invalid.");if(E.length<B*_)throw new Error("Not enough pixels for the frame size.");var i=!0,s=f.palette;if(s==null&&(i=!1,s=d),s==null)throw new Error("Must supply either a local or global palette.");for(var l=m(s),v=0;l>>=1;)++v;l=1<<v;var A=f.delay===void 0?0:f.delay,M=f.disposal===void 0?0:f.disposal;if(M<0||M>3)throw new Error("Disposal out of range.");var L=!1,H=0;if(f.transparent!==void 0&&f.transparent!==null&&(L=!0,H=f.transparent,H<0||H>=l))throw new Error("Transparent color index.");if((M!==0||L||A!==0)&&(t[n++]=33,t[n++]=249,t[n++]=4,t[n++]=M<<2|(L===!0?1:0),t[n++]=A&255,t[n++]=A>>8&255,t[n++]=H,t[n++]=0),t[n++]=44,t[n++]=y&255,t[n++]=y>>8&255,t[n++]=g&255,t[n++]=g>>8&255,t[n++]=B&255,t[n++]=B>>8&255,t[n++]=_&255,t[n++]=_>>8&255,t[n++]=i===!0?128|v-1:0,i===!0)for(var T=0,G=s.length;T<G;++T){var R=s[T];t[n++]=R>>16&255,t[n++]=R>>8&255,t[n++]=R&255}return n=Me(t,n,v<2?2:v,E),n},this.end=function(){return C===!1&&(t[n++]=59,C=!0),n},this.getOutputBuffer=function(){return t},this.setOutputBuffer=function(y){t=y},this.getOutputBufferPosition=function(){return n},this.setOutputBufferPosition=function(y){n=y}}function Me(t,e,a,u){t[e++]=a;var n=e++,o=1<<a,c=o-1,d=o+1,m=d+1,w=a+1,h=0,r=0;function x(f){for(;h>=f;)t[e++]=r&255,r>>=8,h-=8,e===n+256&&(t[n]=255,n=e++)}function b(f){r|=f<<h,h+=w,x(8)}var p=u[0]&c,C={};b(o);for(var y=1,g=u.length;y<g;++y){var B=u[y]&c,_=p<<8|B,E=C[_];if(E===void 0){for(r|=p<<h,h+=w;h>=8;)t[e++]=r&255,r>>=8,h-=8,e===n+256&&(t[n]=255,n=e++);m===4096?(b(o),m=d+1,w=a+1,C={}):(m>=1<<w&&++w,C[_]=m++),p=B}else p=E}return b(p),b(d),x(1),n+1===e?t[n]=0:(t[n]=e-n-1,t[e++]=0),e}function _e(t){var e=0;if(t[e++]!==71||t[e++]!==73||t[e++]!==70||t[e++]!==56||(t[e++]+1&253)!==56||t[e++]!==97)throw new Error("Invalid GIF 87a/89a header.");var a=t[e++]|t[e++]<<8,u=t[e++]|t[e++]<<8,n=t[e++],o=n>>7,c=n&7,d=1<<c+1,m=t[e++];t[e++];var w=null,h=null;o&&(w=e,h=d,e+=d*3);var r=!0,x=[],b=0,p=null,C=0,y=null;for(this.width=a,this.height=u;r&&e<t.length;)switch(t[e++]){case 33:switch(t[e++]){case 255:if(t[e]!==11||t[e+1]==78&&t[e+2]==69&&t[e+3]==84&&t[e+4]==83&&t[e+5]==67&&t[e+6]==65&&t[e+7]==80&&t[e+8]==69&&t[e+9]==50&&t[e+10]==46&&t[e+11]==48&&t[e+12]==3&&t[e+13]==1&&t[e+16]==0)e+=14,y=t[e++]|t[e++]<<8,e++;else for(e+=12;;){var g=t[e++];if(!(g>=0))throw Error("Invalid block size");if(g===0)break;e+=g}break;case 249:if(t[e++]!==4||t[e+4]!==0)throw new Error("Invalid graphics extension block.");var B=t[e++];b=t[e++]|t[e++]<<8,p=t[e++],B&1||(p=null),C=B>>2&7,e++;break;case 254:for(;;){var g=t[e++];if(!(g>=0))throw Error("Invalid block size");if(g===0)break;e+=g}break;default:throw new Error("Unknown graphic control label: 0x"+t[e-1].toString(16))}break;case 44:var _=t[e++]|t[e++]<<8,E=t[e++]|t[e++]<<8,f=t[e++]|t[e++]<<8,i=t[e++]|t[e++]<<8,s=t[e++],l=s>>7,v=s>>6&1,A=s&7,M=1<<A+1,L=w,H=h,T=!1;if(l){var T=!0;L=e,H=M,e+=M*3}var G=e;for(e++;;){var g=t[e++];if(!(g>=0))throw Error("Invalid block size");if(g===0)break;e+=g}x.push({x:_,y:E,width:f,height:i,has_local_palette:T,palette_offset:L,palette_size:H,data_offset:G,data_length:e-G,transparent_index:p,interlaced:!!v,delay:b,disposal:C});break;case 59:r=!1;break;default:throw new Error("Unknown gif block: 0x"+t[e-1].toString(16))}this.numFrames=function(){return x.length},this.loopCount=function(){return y},this.frameInfo=function(R){if(R<0||R>=x.length)throw new Error("Frame index out of range.");return x[R]},this.decodeAndBlitFrameBGRA=function(R,k){var F=this.frameInfo(R),N=F.width*F.height,X=new Uint8Array(N);de(t,F.data_offset,X,N);var z=F.palette_offset,P=F.transparent_index;P===null&&(P=256);var D=F.width,j=a-D,U=D,q=(F.y*a+F.x)*4,K=((F.y+F.height)*a+F.x)*4,S=q,J=j*4;F.interlaced===!0&&(J+=a*4*7);for(var O=8,Z=0,$=X.length;Z<$;++Z){var Y=X[Z];if(U===0&&(S+=J,U=D,S>=K&&(J=j*4+a*4*(O-1),S=q+(D+j)*(O<<1),O>>=1)),Y===P)S+=4;else{var ee=t[z+Y*3],te=t[z+Y*3+1],ne=t[z+Y*3+2];k[S++]=ne,k[S++]=te,k[S++]=ee,k[S++]=255}--U}},this.decodeAndBlitFrameRGBA=function(R,k){var F=this.frameInfo(R),N=F.width*F.height,X=new Uint8Array(N);de(t,F.data_offset,X,N);var z=F.palette_offset,P=F.transparent_index;P===null&&(P=256);var D=F.width,j=a-D,U=D,q=(F.y*a+F.x)*4,K=((F.y+F.height)*a+F.x)*4,S=q,J=j*4;F.interlaced===!0&&(J+=a*4*7);for(var O=8,Z=0,$=X.length;Z<$;++Z){var Y=X[Z];if(U===0&&(S+=J,U=D,S>=K&&(J=j*4+a*4*(O-1),S=q+(D+j)*(O<<1),O>>=1)),Y===P)S+=4;else{var ee=t[z+Y*3],te=t[z+Y*3+1],ne=t[z+Y*3+2];k[S++]=ee,k[S++]=te,k[S++]=ne,k[S++]=255}--U}}}function de(t,e,a,u){for(var n=t[e++],o=1<<n,c=o+1,d=c+1,m=n+1,w=(1<<m)-1,h=0,r=0,x=0,b=t[e++],p=new Int32Array(4096),C=null;;){for(;h<16&&b!==0;)r|=t[e++]<<h,h+=8,b===1?b=t[e++]:--b;if(h<m)break;var y=r&w;if(r>>=m,h-=m,y===o){d=c+1,m=n+1,w=(1<<m)-1,C=null;continue}else if(y===c)break;for(var g=y<d?y:C,B=0,_=g;_>o;)_=p[_]>>8,++B;var E=_,f=x+B+(g!==y?1:0);if(f>u){console.log("Warning, gif stream longer than expected.");return}a[x++]=E,x+=B;var i=x;for(g!==y&&(a[x++]=E),_=g;B--;)_=p[_],a[--i]=_&255,_>>=8;C!==null&&d<4096&&(p[d++]=C<<8|E,d>=w+1&&m<12&&(++m,w=w<<1|1)),C=y}return x!==u&&console.log("Warning, gif stream shorter than expected."),a}try{ie.GifWriter=Ce,ie.GifReader=_e}catch{}});var me=Ee(fe());var be=t=>`otsbCursorAnim__${t}`;function ue(t,e,a){a||(a=t);let u=be(a),n=e.reduce((o,c)=>o+c.delay,0);return`@keyframes ${u}{${e.map((o,c)=>`${c*100/e.length}%{cursor:url(${o.image}),auto}`).join("")} 100%{cursor:url(${e[0].image}),auto}}${t}:hover{animation:${u} ${n}ms step-end infinite;}`}function V(t){let e,a,u,n,o=t&&t.emoji||"\u{1F92A}",c=t&&t.element,d=c||document.body,m=window.innerWidth,w=window.innerHeight,h={x:m/2,y:m/2},r=[],x=window.matchMedia("(prefers-reduced-motion: reduce)");function b(){if(x.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",c?(e.style.position="absolute",d.appendChild(e),e.width=d.clientWidth,e.height=d.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=m,e.height=w),a.font="16px serif",a.textBaseline="middle",a.textAlign="center";let i=a.measureText(o),s=document.createElement("canvas"),l=s.getContext("2d");s.width=i.width,s.height=2*i.actualBoundingBoxAscent,l.textAlign="center",l.font="16px serif",l.textBaseline="middle",l.fillText(o,s.width/2,i.actualBoundingBoxAscent),n=s;let v=0;for(v=0;v<7;v++)r[v]=new f(n);d.addEventListener("mousemove",y),d.addEventListener("touchmove",C,{passive:!0}),d.addEventListener("touchstart",C,{passive:!0}),window.addEventListener("resize",p),g()}function p(i){m=window.innerWidth,w=window.innerHeight,c?(e.width=d.clientWidth,e.height=d.clientHeight):(e.width=m,e.height=w)}function C(i){if(i.touches.length>0)if(c){let s=d.getBoundingClientRect();h.x=i.touches[0].clientX-s.left,h.y=i.touches[0].clientY-s.top}else h.x=i.touches[0].clientX,h.y=i.touches[0].clientY}function y(i){if(c){let s=d.getBoundingClientRect();h.x=i.clientX-s.left,h.y=i.clientY-s.top}else h.x=i.clientX,h.y=i.clientY}function g(){(function(){e.width=e.width,r[0].position.x=h.x,r[0].position.y=h.y;for(let i=1;i<7;i++){let s=new _(0,0);i>0&&E(i-1,i,s),i<6&&E(i+1,i,s);let l,v,A=new _(10*-r[i].velocity.x,10*-r[i].velocity.y),M=new _((s.X+A.X)/1,(s.Y+A.Y)/1+50);r[i].velocity.x+=.01*M.X,r[i].velocity.y+=.01*M.Y,Math.abs(r[i].velocity.x)<.1&&Math.abs(r[i].velocity.y)<.1&&Math.abs(M.X)<.1&&Math.abs(M.Y)<.1&&(r[i].velocity.x=0,r[i].velocity.y=0),r[i].position.x+=r[i].velocity.x,r[i].position.y+=r[i].velocity.y,l=e.clientHeight,v=e.clientWidth,r[i].position.y>=l-11-1&&(r[i].velocity.y>0&&(r[i].velocity.y=.7*-r[i].velocity.y),r[i].position.y=l-11-1),r[i].position.x>=v-11&&(r[i].velocity.x>0&&(r[i].velocity.x=.7*-r[i].velocity.x),r[i].position.x=v-11-1),r[i].position.x<0&&(r[i].velocity.x<0&&(r[i].velocity.x=.7*-r[i].velocity.x),r[i].position.x=0),r[i].draw(a)}})(),u=requestAnimationFrame(g)}function B(){e.remove(),cancelAnimationFrame(u),d.removeEventListener("mousemove",y),d.removeEventListener("touchmove",C),d.removeEventListener("touchstart",C),window.addEventListener("resize",p)}function _(i,s){this.X=i,this.Y=s}function E(i,s,l){let v=r[i].position.x-r[s].position.x,A=r[i].position.y-r[s].position.y,M=Math.sqrt(v*v+A*A);if(M>10){let L=10*(M-10);l.X+=v/M*L,l.Y+=A/M*L}}function f(i){this.position={x:h.x,y:h.y},this.velocity={x:0,y:0},this.canv=i,this.draw=function(s){s.drawImage(this.canv,this.position.x-this.canv.width/2,this.position.y-this.canv.height/2,this.canv.width,this.canv.height)}}return x.onchange=()=>{x.matches?B():b()},b(),{destroy:B}}function oe(t){let e=t&&t.colors||["#D61C59","#E7D84B","#1B8798"],a=t&&t.element,u=a||document.body,n=window.innerWidth,o=window.innerHeight,c={x:n/2,y:n/2},d={x:n/2,y:n/2},m=[],w=[],h,r,x,b=window.matchMedia("(prefers-reduced-motion: reduce)");function p(){if(b.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;h=document.createElement("canvas"),r=h.getContext("2d"),h.style.top="0px",h.style.left="0px",h.style.pointerEvents="none",a?(h.style.position="absolute",u.appendChild(h),h.width=u.clientWidth,h.height=u.clientHeight):(h.style.position="fixed",u.appendChild(h),h.width=n,h.height=o),r.font="21px serif",r.textBaseline="middle",r.textAlign="center",e.forEach(i=>{let s=r.measureText("*"),l=document.createElement("canvas"),v=l.getContext("2d");l.width=s.width,l.height=s.actualBoundingBoxAscent+s.actualBoundingBoxDescent,v.fillStyle=i,v.textAlign="center",v.font="21px serif",v.textBaseline="middle",v.fillText("*",l.width/2,s.actualBoundingBoxAscent),w.push(l)}),u.addEventListener("mousemove",g),u.addEventListener("touchmove",y,{passive:!0}),u.addEventListener("touchstart",y,{passive:!0}),window.addEventListener("resize",C),_()}function C(i){n=window.innerWidth,o=window.innerHeight,a?(h.width=u.clientWidth,h.height=u.clientHeight):(h.width=n,h.height=o)}function y(i){if(i.touches.length>0)for(let s=0;s<i.touches.length;s++)B(i.touches[s].clientX,i.touches[s].clientY,w[Math.floor(Math.random()*w.length)])}function g(i){window.requestAnimationFrame(()=>{if(a){let s=u.getBoundingClientRect();c.x=i.clientX-s.left,c.y=i.clientY-s.top}else c.x=i.clientX,c.y=i.clientY;Math.hypot(c.x-d.x,c.y-d.y)>1.5&&(B(c.x,c.y,w[Math.floor(Math.random()*e.length)]),d.x=c.x,d.y=c.y)})}function B(i,s,l){m.push(new f(i,s,l))}function _(){(function(){if(m.length!=0){r.clearRect(0,0,n,o);for(let i=0;i<m.length;i++)m[i].update(r);for(let i=m.length-1;i>=0;i--)m[i].lifeSpan<0&&m.splice(i,1);m.length==0&&r.clearRect(0,0,n,o)}})(),x=requestAnimationFrame(_)}function E(){h.remove(),cancelAnimationFrame(x),u.removeEventListener("mousemove",g),u.removeEventListener("touchmove",y),u.removeEventListener("touchstart",y),window.addEventListener("resize",C)}function f(i,s,l){let v=Math.floor(30*Math.random()+60);this.initialLifeSpan=v,this.lifeSpan=v,this.velocity={x:(Math.random()<.5?-1:1)*(Math.random()/2),y:.7*Math.random()+.9},this.position={x:i,y:s},this.canv=l,this.update=function(A){this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.lifeSpan--,this.velocity.y+=.02;let M=Math.max(this.lifeSpan/this.initialLifeSpan,0);A.drawImage(this.canv,this.position.x-this.canv.width/2*M,this.position.y-this.canv.height/2,this.canv.width*M,this.canv.height*M)}}return b.onchange=()=>{b.matches?E():p()},p(),{destroy:E}}function re(t){let e,a,u,n=t&&t.element,o=n||document.body,c=["\u2744\uFE0F"],d=window.innerWidth,m=window.innerHeight,w={x:d/2,y:d/2},h=[],r=[],x=window.matchMedia("(prefers-reduced-motion: reduce)");function b(){if(x.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",n?(e.style.position="absolute",o.appendChild(e),e.width=o.clientWidth,e.height=o.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=d,e.height=m),a.font="12px serif",a.textBaseline="middle",a.textAlign="center",c.forEach(f=>{let i=a.measureText(f),s=document.createElement("canvas"),l=s.getContext("2d");s.width=i.width,s.height=2*i.actualBoundingBoxAscent,l.textAlign="center",l.font="12px serif",l.textBaseline="middle",l.fillText(f,s.width/2,i.actualBoundingBoxAscent),r.push(s)}),o.addEventListener("mousemove",y),o.addEventListener("touchmove",C,{passive:!0}),o.addEventListener("touchstart",C,{passive:!0}),window.addEventListener("resize",p),B()}function p(f){d=window.innerWidth,m=window.innerHeight,n?(e.width=o.clientWidth,e.height=o.clientHeight):(e.width=d,e.height=m)}function C(f){if(f.touches.length>0)for(let i=0;i<f.touches.length;i++)g(f.touches[i].clientX,f.touches[i].clientY,r[Math.floor(Math.random()*r.length)])}function y(f){if(n){let i=o.getBoundingClientRect();w.x=f.clientX-i.left,w.y=f.clientY-i.top}else w.x=f.clientX,w.y=f.clientY;g(w.x,w.y,r[Math.floor(Math.random()*c.length)])}function g(f,i,s){h.push(new E(f,i,s))}function B(){(function(){if(h.length!=0){a.clearRect(0,0,d,m);for(let f=0;f<h.length;f++)h[f].update(a);for(let f=h.length-1;f>=0;f--)h[f].lifeSpan<0&&h.splice(f,1);h.length==0&&a.clearRect(0,0,d,m)}})(),u=requestAnimationFrame(B)}function _(){e.remove(),cancelAnimationFrame(u),o.removeEventListener("mousemove",y),o.removeEventListener("touchmove",C),o.removeEventListener("touchstart",C),window.addEventListener("resize",p)}function E(f,i,s){let l=Math.floor(60*Math.random()+80);this.initialLifeSpan=l,this.lifeSpan=l,this.velocity={x:(Math.random()<.5?-1:1)*(Math.random()/2),y:1+Math.random()},this.position={x:f,y:i},this.canv=s,this.update=function(v){this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.lifeSpan--,this.velocity.x+=2*(Math.random()<.5?-1:1)/75,this.velocity.y-=Math.random()/300;let A=Math.max(this.lifeSpan/this.initialLifeSpan,0),M=.0174533*(2*this.lifeSpan);v.translate(this.position.x,this.position.y),v.rotate(M),v.drawImage(this.canv,-this.canv.width/2*A,-this.canv.height/2,this.canv.width*A,this.canv.height*A),v.rotate(-M),v.translate(-this.position.x,-this.position.y)}}return x.onchange=()=>{x.matches?_():b()},b(),{destroy:_}}function se(t){let e,a,u,n=t&&t.element,o=n||document.body,c=window.innerWidth,d=window.innerHeight,m={x:c/2,y:c/2},w=[],h=t?.particles||15,r=t?.rate||.4,x=t?.baseImageSrc||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAYAAACk9eypAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAAEwAAAAAChpcNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABqElEQVQoFY3SPUvDQBgH8BREpRHExYiDgmLFl6WC+AYmWeyLg4i7buJX8DMpOujgyxGvUYeCgzhUQUSKKLUS0+ZyptXh8Z5Ti621ekPyJHl+uftfomhaf9Ei5JyxXKfynyEA6EYcLHpwyflT958GAQ7DTABNHd8EbtDbEH2BD5QEQmi2mM8P/Iq+A0SzszEg+3sPjDnDdVEtQKQbMUidHD3xVzf6A9UDEmEm+8h9KTqTVUjT+vB53aHrCbAPiceYq1dQI1Aqv4EhMll0jzv+Y0yiRgCnLRSYyDQHVoqUXe4uKL9l+L7GXC4vkMhE6eW/AOJs9k583ORDUyXMZ8F5SVHVVnllmPNKSFagAJ5DofaqGXw/gHBYg51dIldkmknY3tguv3jOtHR4+MqAzaraJXbEhqHhcQlwGSOi5pytVQHZLN5s0WNe8HPrLYlFsO20RPHkImxsbmHdLJFI76th7Z4SeuF53hTeFLvhRCJRCTKZKxgdnRDbW+iozFJbBMw14/ElwGYc0egMBMFzT21f5Rog33Z7dX02GBm7WV5ZfT5Nn5bE3zuCDe9UxdTpNvK+5AAAAABJRU5ErkJggg==",b=!1,p=new Image;p.src=x;let C=window.matchMedia("(prefers-reduced-motion: reduce)");function y(){if(C.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",n?(e.style.position="absolute",o.appendChild(e),e.width=o.clientWidth,e.height=o.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=c,e.height=d),o.addEventListener("mousemove",B),window.addEventListener("resize",g),_()}function g(i){c=window.innerWidth,d=window.innerHeight,n?(e.width=o.clientWidth,e.height=o.clientHeight):(e.width=c,e.height=d)}function B(i){if(n){let A=o.getBoundingClientRect();m.x=i.clientX-A.left,m.y=i.clientY-A.top}else m.x=i.clientX,m.y=i.clientY;if(b===!1){b=!0;for(let A=0;A<h;A++)s=m.x,l=m.y,v=p,w.push(new f(s,l,v))}var s,l,v}function _(){(function(){a.clearRect(0,0,c,d);let i=m.x,s=m.y;w.forEach(function(l,v,A){let M=A[v+1]||A[0];l.position.x=i,l.position.y=s,l.move(a),i+=(M.position.x-l.position.x)*r,s+=(M.position.y-l.position.y)*r})})(),u=requestAnimationFrame(_)}function E(){e.remove(),cancelAnimationFrame(u),o.removeEventListener("mousemove",B),window.addEventListener("resize",g)}function f(i,s,l){this.position={x:i,y:s},this.image=l,this.move=function(v){v.drawImage(this.image,this.position.x,this.position.y)}}return C.onchange=()=>{C.matches?E():y()},y(),{destroy:E}}function Q(t){let e,a,u=t&&t.element,n=u||document.body,o=window.innerWidth,c=window.innerHeight,d={x:o/2,y:o/2},m=new function(y,g,B,_){this.position={x:y,y:g},this.width=B,this.lag=_,this.moveTowards=function(E,f,i){this.position.x+=(E-this.position.x)/this.lag,this.position.y+=(f-this.position.y)/this.lag,i.fillStyle=w,i.beginPath(),i.arc(this.position.x,this.position.y,this.width,0,2*Math.PI),i.fill(),i.closePath()}}(o/2,c/2,10,10),w=t?.color||"#323232a6",h=window.matchMedia("(prefers-reduced-motion: reduce)");function r(){if(h.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",u?(e.style.position="absolute",n.appendChild(e),e.width=n.clientWidth,e.height=n.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=o,e.height=c),n.addEventListener("mousemove",b),window.addEventListener("resize",x),p()}function x(y){o=window.innerWidth,c=window.innerHeight,u?(e.width=n.clientWidth,e.height=n.clientHeight):(e.width=o,e.height=c)}function b(y){if(u){let g=n.getBoundingClientRect();d.x=y.clientX-g.left,d.y=y.clientY-g.top}else d.x=y.clientX,d.y=y.clientY}function p(){a.clearRect(0,0,o,c),m.moveTowards(d.x,d.y,a),requestAnimationFrame(p)}function C(){e.remove(),cancelAnimationFrame(p),n.removeEventListener("mousemove",b),window.addEventListener("resize",x)}return h.onchange=()=>{h.matches?C():r()},r(),{destroy:C}}function ae(t){let e,a,u,n=t&&t.element,o=n||document.body,c=window.innerWidth,d=window.innerHeight,m={x:c/2,y:c/2},w=[],h=[],r=window.matchMedia("(prefers-reduced-motion: reduce)");function x(){if(r.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",n?(e.style.position="absolute",o.appendChild(e),e.width=o.clientWidth,e.height=o.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=c,e.height=d),o.addEventListener("mousemove",C),o.addEventListener("touchmove",p,{passive:!0}),o.addEventListener("touchstart",p,{passive:!0}),window.addEventListener("resize",b),g()}function b(E){c=window.innerWidth,d=window.innerHeight,n?(e.width=o.clientWidth,e.height=o.clientHeight):(e.width=c,e.height=d)}function p(E){if(E.touches.length>0)for(let f=0;f<E.touches.length;f++)y(E.touches[f].clientX,E.touches[f].clientY,h[Math.floor(Math.random()*h.length)])}function C(E){if(n){let f=o.getBoundingClientRect();m.x=E.clientX-f.left,m.y=E.clientY-f.top}else m.x=E.clientX,m.y=E.clientY;y(m.x,m.y)}function y(E,f,i){w.push(new _(E,f,i))}function g(){(function(){if(w.length!=0){a.clearRect(0,0,c,d);for(let E=0;E<w.length;E++)w[E].update(a);for(let E=w.length-1;E>=0;E--)w[E].lifeSpan<0&&w.splice(E,1);w.length==0&&a.clearRect(0,0,c,d)}})(),u=requestAnimationFrame(g)}function B(){e.remove(),cancelAnimationFrame(u),o.removeEventListener("mousemove",C),o.removeEventListener("touchmove",p),o.removeEventListener("touchstart",p),window.addEventListener("resize",b)}function _(E,f,i){let s=Math.floor(60*Math.random()+60);this.initialLifeSpan=s,this.lifeSpan=s,this.velocity={x:(Math.random()<.5?-1:1)*(Math.random()/10),y:-1*Math.random()-.4},this.position={x:E,y:f},this.canv=i,this.baseDimension=4,this.update=function(l){this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.velocity.x+=2*(Math.random()<.5?-1:1)/75,this.velocity.y-=Math.random()/600,this.lifeSpan--;let v=.2+(this.initialLifeSpan-this.lifeSpan)/this.initialLifeSpan;l.fillStyle="#e6f1f7",l.strokeStyle="#3a92c5",l.beginPath(),l.arc(this.position.x-this.baseDimension/2*v,this.position.y-this.baseDimension/2,this.baseDimension*v,0,2*Math.PI),l.stroke(),l.fill(),l.closePath()}}return r.onchange=()=>{r.matches?B():x()},x(),{destroy:B}}function I(t){let e=t&&t.emoji||["\u{1F600}","\u{1F602}","\u{1F606}","\u{1F60A}"],a=t&&t.element,u=a||document.body,n=window.innerWidth,o=window.innerHeight,c={x:n/2,y:n/2},d={x:n/2,y:n/2},m=0,w=[],h=[],r,x,b,p=window.matchMedia("(prefers-reduced-motion: reduce)");function C(){if(p.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;r=document.createElement("canvas"),x=r.getContext("2d"),r.style.top="0px",r.style.left="0px",r.style.pointerEvents="none",a?(r.style.position="absolute",u.appendChild(r),r.width=u.clientWidth,r.height=u.clientHeight):(r.style.position="fixed",document.body.appendChild(r),r.width=n,r.height=o),x.font="21px serif",x.textBaseline="middle",x.textAlign="center",e.forEach(s=>{let l=x.measureText(s),v=document.createElement("canvas"),A=v.getContext("2d");v.width=l.width,v.height=2*l.actualBoundingBoxAscent,A.textAlign="center",A.font="21px serif",A.textBaseline="middle",A.fillText(s,v.width/2,l.actualBoundingBoxAscent),h.push(v)}),u.addEventListener("mousemove",B,{passive:!0}),u.addEventListener("touchmove",g,{passive:!0}),u.addEventListener("touchstart",g,{passive:!0}),window.addEventListener("resize",y),E()}function y(s){n=window.innerWidth,o=window.innerHeight,a?(r.width=u.clientWidth,r.height=u.clientHeight):(r.width=n,r.height=o)}function g(s){if(s.touches.length>0)for(let l=0;l<s.touches.length;l++)_(s.touches[l].clientX,s.touches[l].clientY,h[Math.floor(Math.random()*h.length)])}function B(s){s.timeStamp-m<16||window.requestAnimationFrame(()=>{if(a){let l=u.getBoundingClientRect();c.x=s.clientX-l.left,c.y=s.clientY-l.top}else c.x=s.clientX,c.y=s.clientY;Math.hypot(c.x-d.x,c.y-d.y)>1&&(_(c.x,c.y,h[Math.floor(Math.random()*e.length)]),d.x=c.x,d.y=c.y,m=s.timeStamp)})}function _(s,l,v){w.push(new i(s,l,v))}function E(){(function(){if(w.length!=0){x.clearRect(0,0,n,o);for(let s=0;s<w.length;s++)w[s].update(x);for(let s=w.length-1;s>=0;s--)w[s].lifeSpan<0&&w.splice(s,1);w.length==0&&x.clearRect(0,0,n,o)}})(),b=requestAnimationFrame(E)}function f(){r.remove(),cancelAnimationFrame(b),u.removeEventListener("mousemove",B),u.removeEventListener("touchmove",g),u.removeEventListener("touchstart",g),window.addEventListener("resize",y)}function i(s,l,v){let A=Math.floor(60*Math.random()+80);this.initialLifeSpan=A,this.lifeSpan=A,this.velocity={x:(Math.random()<.5?-1:1)*(Math.random()/2),y:.4*Math.random()+.8},this.position={x:s,y:l},this.canv=v,this.update=function(M){this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.lifeSpan--,this.velocity.y+=.05;let L=Math.max(this.lifeSpan/this.initialLifeSpan,0);M.drawImage(this.canv,this.position.x-this.canv.width/2*L,this.position.y-this.canv.height/2,this.canv.width*L,this.canv.height*L)}}return p.onchange=()=>{p.matches?f():C()},C(),{destroy:f}}function ce(t){let e,a,u,n=t&&t.element,o=n||document.body,c=t&&t.randomDelay,d=t&&t.minDelay||5,m=t&&t.maxDelay||50,w=window.innerWidth,h=window.innerHeight,r={x:w/2,y:w/2},x=[],b=new Image;t&&t.image?b.src=t.image:b.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAYAAACk9eypAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAAEwAAAAAChpcNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABqElEQVQoFY3SPUvDQBgH8BREpRHExYiDgmLFl6WC+AYmWeyLg4i7buJX8DMpOujgyxGvUYeCgzhUQUSKKLUS0+ZyptXh8Z5Ti621ekPyJHl+uftfomhaf9Ei5JyxXKfynyEA6EYcLHpwyflT958GAQ7DTABNHd8EbtDbEH2BD5QEQmi2mM8P/Iq+A0SzszEg+3sPjDnDdVEtQKQbMUidHD3xVzf6A9UDEmEm+8h9KTqTVUjT+vB53aHrCbAPiceYq1dQI1Aqv4EhMll0jzv+Y0yiRgCnLRSYyDQHVoqUXe4uKL9l+L7GXC4vkMhE6eW/AOJs9k583ORDUyXMZ8F5SVHVVnllmPNKSFagAJ5DofaqGXw/gHBYg51dIldkmknY3tguv3jOtHR4+MqAzaraJXbEhqHhcQlwGSOi5pytVQHZLN5s0WNe8HPrLYlFsO20RPHkImxsbmHdLJFI76th7Z4SeuF53hTeFLvhRCJRCTKZKxgdnRDbW+iozFJbBMw14/ElwGYc0egMBMFzT21f5Rog33Z7dX02GBm7WV5ZfT5Nn5bE3zuCDe9UxdTpNvK+5AAAAABJRU5ErkJggg==";let p=window.matchMedia("(prefers-reduced-motion: reduce)");function C(){if(p.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",n?(e.style.position="absolute",o.appendChild(e),e.width=o.clientWidth,e.height=o.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=w,e.height=h),o.addEventListener("mousemove",f),o.addEventListener("touchmove",g,{passive:!0}),o.addEventListener("touchstart",g,{passive:!0}),window.addEventListener("resize",y),s()}function y(A){w=window.innerWidth,h=window.innerHeight,n?(e.width=o.clientWidth,e.height=o.clientHeight):(e.width=w,e.height=h)}function g(A){if(A.touches.length>0)for(let M=0;M<A.touches.length;M++)i(A.touches[M].clientX,A.touches[M].clientY,b)}p.onchange=()=>{p.matches?l():C()};let B=()=>Math.floor(Math.random()*(m-d+1))+d,_=Date.now(),E=B();function f(A){if(c){if(_+E>Date.now())return;_=Date.now(),E=B()}if(n){let M=o.getBoundingClientRect();r.x=A.clientX-M.left,r.y=A.clientY-M.top}else r.x=A.clientX,r.y=A.clientY;i(r.x,r.y,b)}function i(A,M,L){x.push(new v(A,M,L))}function s(){(function(){if(x.length!=0){a.clearRect(0,0,w,h);for(let A=0;A<x.length;A++)x[A].update(a);for(let A=x.length-1;A>=0;A--)x[A].lifeSpan<0&&x.splice(A,1);x.length==0&&a.clearRect(0,0,w,h)}})(),u=requestAnimationFrame(s)}function l(){e.remove(),cancelAnimationFrame(u),o.removeEventListener("mousemove",f),o.removeEventListener("touchmove",g),o.removeEventListener("touchstart",g),window.addEventListener("resize",y)}function v(A,M,L){this.initialLifeSpan=40,this.lifeSpan=40,this.position={x:A,y:M},this.image=L,this.update=function(H){this.lifeSpan--;let T=Math.max(this.lifeSpan/this.initialLifeSpan,0);H.globalAlpha=T,H.drawImage(this.image,this.position.x,this.position.y)}}return C(),{destroy:l}}function W(t){let e,a,u,n=t&&t.element,o=n||document.body,c=window.innerWidth,d=window.innerHeight,m={x:c/2,y:c/2},w=[],h=t?.length||20,r=t?.colors||["#FE0000","#FD8C00","#FFE500","#119F0B","#0644B3","#C22EDC"],x=t?.size||3,b=!1,p=window.matchMedia("(prefers-reduced-motion: reduce)");function C(){if(p.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",n?(e.style.position="absolute",o.appendChild(e),e.width=o.clientWidth,e.height=o.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=c,e.height=d),o.addEventListener("mousemove",g),window.addEventListener("resize",y),B()}function y(f){c=window.innerWidth,d=window.innerHeight,n?(e.width=o.clientWidth,e.height=o.clientHeight):(e.width=c,e.height=d)}function g(f){if(n){let l=o.getBoundingClientRect();m.x=f.clientX-l.left,m.y=f.clientY-l.top}else m.x=f.clientX,m.y=f.clientY;if(b===!1){b=!0;for(let l=0;l<h;l++)i=m.x,s=m.y,w.push(new E(i,s))}var i,s}function B(){(function(){a.clearRect(0,0,c,d),a.lineJoin="round";let f=[],i=m.x,s=m.y;w.forEach(function(l,v,A){let M=A[v+1]||A[0];l.position.x=i,l.position.y=s,f.push({x:i,y:s}),i+=.4*(M.position.x-l.position.x),s+=.4*(M.position.y-l.position.y)}),r.forEach((l,v)=>{a.beginPath(),a.strokeStyle=l,f.length&&a.moveTo(f[0].x,f[0].y+v*(x-1)),f.forEach((A,M)=>{M!==0&&a.lineTo(A.x,A.y+v*x)}),a.lineWidth=x,a.lineCap="round",a.stroke()})})(),u=requestAnimationFrame(B)}function _(){e.remove(),cancelAnimationFrame(u),o.removeEventListener("mousemove",g),window.addEventListener("resize",y)}function E(f,i){this.position={x:f,y:i}}return p.onchange=()=>{p.matches?_():C()},C(),{destroy:_}}function le(t){let e,a,u,n=t||{},o=t&&t.element,c=o||document.body,d=n.text?" "+t.text:" Your Text Here",m=t?.color||"#000000",w=n.font||"monospace",h=n.textSize||12,r=h+"px "+w,x=n.gap||h+2,b=0,p=[],C=window.innerWidth,y=window.innerHeight,g={x:C/2,y:C/2};for(let l=0;l<d.length;l++)p[l]={letter:d.charAt(l),x:C/2,y:C/2};t?.size;let B=window.matchMedia("(prefers-reduced-motion: reduce)");function _(){if(B.matches)return console.log("This browser has prefers reduced motion turned on, so the cursor did not init"),!1;e=document.createElement("canvas"),a=e.getContext("2d"),e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",o?(e.style.position="absolute",c.appendChild(e),e.width=c.clientWidth,e.height=c.clientHeight):(e.style.position="fixed",document.body.appendChild(e),e.width=C,e.height=y),c.addEventListener("mousemove",f),window.addEventListener("resize",E),i()}function E(l){C=window.innerWidth,y=window.innerHeight,o?(e.width=c.clientWidth,e.height=c.clientHeight):(e.width=C,e.height=y)}function f(l){if(o){let v=c.getBoundingClientRect();g.x=l.clientX-v.left,g.y=l.clientY-v.top}else g.x=l.clientX,g.y=l.clientY}function i(){(function(){a.clearRect(0,0,C,y),b+=.15;let l=2*Math.cos(b),v=5*Math.sin(b);for(let L=p.length-1;L>0;L--)p[L].x=p[L-1].x+x,p[L].y=p[L-1].y,a.fillStyle=m,a.font=r,a.fillText(p[L].letter,p[L].x,p[L].y);let A=p[0].x,M=p[0].y;A+=(g.x-A)/5+l+2,M+=(g.y-M)/5+v,p[0].x=A,p[0].y=M})(),u=requestAnimationFrame(i)}function s(){e.remove(),cancelAnimationFrame(u),c.removeEventListener("mousemove",f),window.addEventListener("resize",E)}return B.onchange=()=>{B.matches?s():_()},_(),{destroy:s}}window?.otsb?.loadedScript||(window.otsb={loadedScript:[]});window.otsb.loadedScript.includes("otsb-gif-cursor")||(window.otsb.loadedScript.push("otsb-gif-cursor"),typeof window.otsb_lgfl>"u"&&(window.otsb_lgfl=async t=>{let u=await(await(await fetch(t)).blob()).arrayBuffer(),n=new Uint8Array(u),o=new me.GifReader(n),c=o.frameInfo(0),d=c.width,m=c.height;return new Array(o.numFrames()).fill(0).map((w,h)=>{let r=new ImageData(d,m);return o.decodeAndBlitFrameBGRA(h,r.data),{data:r,delay:o.frameInfo(h).delay*10}})}),typeof window.otsb_idtb>"u"&&(window.otsb_idtb=t=>new Promise((e,a)=>{let u=new OffscreenCanvas(t.width,t.height),n=u.getContext("2d");if(n===null){a("error");return}n.putImageData(t,0,0),u.convertToBlob().then(o=>{let c=new FileReader;c.onloadend=()=>e(c.result),c.onerror=a,c.readAsDataURL(o)}).catch(a)})),typeof window.otsb_mgc>"u"&&(window.otsb_mgc=async(t,e,a)=>{let u=await window.otsb_lgfl(t),n=await Promise.all(u.map(async o=>({image:await window.otsb_idtb(o.data),delay:o.delay})));return e||(e="body"),ue(e,n,a)},window.dispatchEvent(new CustomEvent("otsb-cursor:init"))),typeof window.otsb_cf>"u"&&(window.otsb_cf={fairyDustCursor:oe,ghostCursor:ce,emojiCursor:I,followingDotCursor:Q,bubbleCursor:ae,springyEmojiCursor:V,snowflakeCursor:re,trailingCursor:se,rainbowCursor:W,textFlag:le}),typeof window.otsb_cf_create_effect>"u"&&(window.otsb_cf_create_effect=function(t,e){if(window.otsb_c_cf===void 0)switch(t){case"fairyDustCursor":window.otsb_c_cf=oe({colors:["#D61C59","#E7D84B","#1B8798"]});break;case"ghostCursor":let a={randomDelay:!0,...e};window.otsb_c_cf=ce(a);break;case"emojiCursor_fun":window.otsb_c_cf=I({emoji:["\u{1F600}","\u{1F602}","\u{1F606}","\u{1F60A}"]});break;case"emojiCursor_fruits":window.otsb_c_cf=I({emoji:["\u{1F34E}","\u{1F34C}","\u{1F352}","\u{1F34A}","\u{1F353}"]});break;case"emojiCursor_house_animals":window.otsb_c_cf=I({emoji:["\u{1F63A}","\u{1F436}","\u{1F430}","\u{1F42D}"]});break;case"emojiCursor_wild_animals":window.otsb_c_cf=I({emoji:["\u{1F98A}","\u{1F43C}","\u{1F435}","\u{1F43B}"]});break;case"emojiCursor_bats":window.otsb_c_cf=I({emoji:["\u{1F987}"]});break;case"emojiCursor_unicorn":window.otsb_c_cf=I({emoji:["\u{1F984}"]});break;case"emojiCursor_halloween":window.otsb_c_cf=I({emoji:["\u{1F383}","\u{1F47B}","\u{1F987}","\u{1F480}"]});break;case"emojiCursor_christmas":window.otsb_c_cf=I({emoji:["\u{1F384}","\u2744\uFE0F","\u26C4\uFE0F","\u{1F385}"]});break;case"emojiCursor_fish":window.otsb_c_cf=I({emoji:["\u{1F41F}","\u{1F420}","\u{1F421}"]});break;case"followingDotCursor_white":window.otsb_c_cf=Q({color:"#F2F2F2A6"});break;case"followingDotCursor_red":window.otsb_c_cf=Q({color:"#ff0000a6"});break;case"followingDotCursor_green":window.otsb_c_cf=Q({color:"#04ff00a6"});break;case"followingDotCursor_blue":window.otsb_c_cf=Q({color:"#0053ffa6"});break;case"followingDotCursor_pink":window.otsb_c_cf=Q({color:"#ff00a3a6"});break;case"bubbleCursor":window.otsb_c_cf=ae();break;case"springyEmojiCursor_star":window.otsb_c_cf=V({emoji:"\u2B50\uFE0F"});break;case"springyEmojiCursor_heart":window.otsb_c_cf=V({emoji:"\u2764\uFE0F"});break;case"snowflakeCursor":window.otsb_c_cf=re();break;case"trailingCursor":window.otsb_c_cf=se({baseImageSrc:e.image,particles:10,rate:.7});break;case"rainbowCursor":window.otsb_c_cf=W();break;case"flagCursor_poland":window.otsb_c_cf=W({length:30,colors:["#EBEAEA","#FF0000"],size:4});break;case"flagCursor_ukraine":window.otsb_c_cf=W({length:30,colors:["#0000FF","#FFFF00"],size:4});break;case"flagCursor_germany":window.otsb_c_cf=W({length:30,colors:["#000000","#FF0000","#F9C804"],size:4});break;case"flagCursor_france":window.otsb_c_cf=W({length:30,colors:["#1C62D6","#F8F8F2","#FC0909"],size:4});break;case"flagCursor_spain":window.otsb_c_cf=W({length:30,colors:["#D0021B","#F5A623","#D0021B"],size:4});break;case"flagCursor_italy":window.otsb_c_cf=W({length:30,colors:["#2CD61C","#FFFFFF","#D0021B"],size:4});break;case"flagCursor_usa":window.otsb_c_cf=W({length:30,colors:["#D0021B","#FFFFFF","#D0021B","#FFFFFF","#D0021B","#FFFFFF","#D0021B","#FFFFFF","#D0021B","#FFFFFF","#D0021B","#FFFFFF","#D0021B"],size:2});break;case"textFlag":let u=e.text||"Shop Now!";window.otsb_c_cf=le({text:u});break}},window.dispatchEvent(new CustomEvent("otsb-cursor-eff:init"))),requestAnimationFrame(()=>{document.addEventListener("alpine:init",()=>{Alpine.data("otsb_image_cursor",({section_id:t,mouse_url:e,mouse_selector:a,mouse_hover_url:u,mouse_hover_selector:n})=>({init(){let o=`otsb-custom-cursor-style-${t}`,c=`otsb-custom-cursor-hover-style-${t}`;document.querySelectorAll(`style#${o}, style#${c}`).forEach(r=>{r.remove()});let d=document.createElement("style");d.id=o,document.head.appendChild(d);let m=document.createElement("style");m.id=c,document.head.appendChild(m);let w=()=>{e&&window.otsb_mgc&&window.otsb_mgc(e,a).then(r=>{console.log({innerHTML:d.innerHTML}),d.innerHTML=r}).catch(()=>{e&&(d.innerHTML=`${a}{cursor:url('${e}'), auto !important;}`)})};n||(n="body button:hover, body a[href]:hover, body .link");let h=()=>{u&&window.otsb_mgc&&window.otsb_mgc(u,n,"Body_Button_A_Link_Hover").then(r=>{m.innerHTML=r}).catch(()=>{u&&(m.innerHTML=`${n}{cursor:url('${u}'), auto !important;}`)})};window.otsb_mgc?(w(),h()):window.addEventListener("otsb-cursor:init",async()=>{w(),h()})}}))})}));window.otsb.loadedScript.includes("otsb-cursor-effect")||(window.otsb.loadedScript.push("otsb-cursor-effect"),requestAnimationFrame(()=>{document.addEventListener("alpine:init",()=>{Alpine.data("otsb_custom_cursor_eff",({type:t,image:e,section_id:a,text:u})=>((e===""||e===null||e===void 0)&&(e=void 0),{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),init(){!t||this.isMobile||(typeof window.otsb_cf_create_effect=="function"?window.otsb_cf_create_effect(t,{image:e,text:u}):window.addEventListener("otsb-cursor-eff:init",()=>{window.otsb_cf_create_effect(t,{image:e,text:u})}),Shopify.designMode&&document.addEventListener("shopify:section:unload",n=>{n.detail.sectionId===a&&window.otsb_c_cf&&(window.otsb_c_cf.destroy(),window.otsb_c_cf=void 0)}))}}))})}));})();
