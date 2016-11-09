(function(c, b, a, e) {
	var d = {
		navigatorClass: "mgNavigator",
		viewportClass: "mgViewport",
		elements: false,
		liveScroll: false,
		scrollbarWidth: 20,
		defaultBgColor: "#B1BDBF",
		draggable: false,
		resizable: false,
		debug: false,
		realistic: false,
		html2canvas: {},
		forceDom: false
	};
	var f = function(h, g) {
			this.elem = h;
			this.$elem = c(h);
			if (this.elem == b) {
				this.$relElem = c("body")
			} else {
				this.$relElem = this.$elem
			}
			this.options = g;
			this.metadata = this.$elem.data("mgMiniMap-options");
			this.config = c.extend({}, d, this.options, this.metadata);
			this.init();


			this.$elem.data("mgMiniMap-instance", this);
		    this.updating = false

		};
	f.prototype.init = function() {
		var g = this;
		this.$navigator = c('<div class="' + this.config.navigatorClass + '"><canvas></canvas><div class="' + this.config.viewportClass + '"></div></div>').appendTo("body");
		this.navigatorPosition = this.$navigator.css("position");
		this.$canvas = this.$navigator.find("canvas");
		var h = this.$canvas.get(0);
		this.canvasSupported = !this.config.forceDom && h.getContext && h.getContext("2d");
		if (this.canvasSupported) {
			this.ctx = this.$canvas.get(0).getContext("2d")
		} else {
			this.$canvas.remove();
			this.$canvasDom = c('<div class="mgCanvasDom">').appendTo(this.$navigator)
		}
		this.$viewport = this.$navigator.find("." + this.config.viewportClass);
		this.attachEvents();
		this.update()


		//窗口改动调整
		setTimeout(function() {
			g.debug("element resized...");
			g.update()
		}, 200)
	};
	f.prototype.update = function(g) {
		if (this.updating) {
			this.debug("REJECTED, already updating");
			return false
		}
		this.updating = true;
		if (g) {
			this.updateViewport();
			this.updating = false
		} else {
			this.updateSizes();
			this.updateViewport();
			if (false !== this.drawElements()) {
				this.updating = false
			}
		}
	};
	f.prototype.updateSizes = function() {
		var g = this;
		g.debug("updating navigator sizes");
		if (this.elem == b) {
			var h = c(a).width(),
				i = c(a).height();
			this.boardLeft = 0;
			this.boardTop = 0;
			this.scrollTop = 0;
			this.scrollLeft = 0
		} else {
			var h = this.elem.scrollWidth + this.config.scrollbarWidth,
				i = this.elem.scrollHeight + this.config.scrollbarWidth;
			this.boardLeft = this.$elem.offset().left;
			this.boardTop = this.$elem.offset().top;
			this.scrollTop = this.$elem.scrollTop();
			this.scrollLeft = this.$elem.scrollLeft()
		}
		this.ratio = this.$navigator.width() / h;
		 // this.ratio=0.1;
		var j = h * this.ratio,
			k = i * this.ratio;
		if (this.config.maxHeight && k > this.config.maxHeight) {
			k = this.config.maxHeight;
			this.ratio = k / i;
			j = h * this.ratio
		}
		this.$navigator.width(j).height(k);
		this.$canvas.attr("width", j).attr("height", k);
		this.debug({
			scrollTop: this.scrollTop,
			scrollLeft: this.scrollLeft,
			width: h,
			height: i,
			boardTop: this.boardTop,
			boardLeft: this.boardLeft
		})
	};
	f.prototype.updateViewport = function() {
		//轮询时minmap产生的影响
		var  location=window.location.href;
		if(location.indexOf("location")==-1){
			var obj=$(".mgNavigator");
			if($(".mgNavigator").length>0){
				$(".mgNavigator").remove();
			}

		}
		//*****************
		this.debug("update viewport");
		var g = this.$elem.height(),
			h = this.$elem.width(),
			j = this.$elem.scrollTop(),
			i = this.$elem.scrollLeft();
		this.debug({
			width: h,
			height: g,
			top: j,
			left: i
		});
		this.$viewport.css({
			left: i * this.ratio,
			top: j * this.ratio
		}).width(h * this.ratio).height(g * this.ratio)
	};
	f.prototype.scrolled = function(h) {
		//console.log("scrolled");
		var g = this;
		g.debug("viewport scrolled");
		g.debug(h);
		g.$elem.scrollTop(h.top / g.ratio).scrollLeft(h.left / g.ratio)
	};
	f.prototype.attachEvents = function() {
		var g = this;
		this.scrolling = false;
		this.resizing = false;
		if (this.config.draggable) {
			this.$navigator.append('<div class="mgHandle"></div>').draggable({
				handle: "div.mgHandle",
				stop: function(h, i) {
					g.$navigator.css("position", g.navigatorPosition)
				}
			})
		}
		if (this.config.resizable) {
			this.$navigator.resizable({
				aspectRatio: true,
				helper: "mgResizing",
				start: function(h, i) {
					g.resizing = true
				},
				stop: function(h, i) {
					g.debug("navigator resized");
					g.update();
					g.resizing = false;
					g.$navigator.css("position", g.navigatorPosition)
				}
			})
		}
		this.$navigator.click(function(i) {
			//console.log("123");
			var l = i.pageX - c(this).offset().left - g.$viewport.width() / 2,
				k = i.pageY - c(this).offset().top - g.$viewport.height() / 2,
				h = g.$navigator.width() - g.$viewport.width(),
				j = g.$navigator.height() - g.$viewport.height();
			if (l < 0) {
				l = 0
			}
			if (l > h) {
				l = h
			}
			if (k < 0) {
				k = 0
			}
			if (k > j) {
				k = j
			}
			g.$viewport.css({
				left: l,
				top: k
			});
			// console.log(l+","+k);
			// console.log("is_openfull"+is_openfull);
			// if(is_openfull == 1){
			// 	//$("body").css("padding-left",l+"px");
			// 	//$("body").css("padding-top",k+"px");
			// 	$("body").scrollLeft(l);
			// 	$("body").scrollTop(k);
			// }else
			//console.log("g:"+g+",g:"+g.toString()+",g:"+$(g).html()+","+$(g).get(0).tagName);
			g.scrolled(g.$viewport.position())
		});
		this.$viewport.draggable({
			containment: "parent",
			start: function(h, i) {
				g.scrolling = true
			},
			drag: function(h, i) {
				if (g.config.liveScroll) {
					g.scrolled(i.position)
				}
			},
			stop: function(h, i) {
				g.scrolling = false;
				g.scrolled(i.position)
			}
		});
		this.$elem.scroll(function() {
			if (!g.scrolling) {
				g.debug("element scrolling");
				g.update(true)
			} else {
				g.debug("REJECTED scrolling")
			}
		});
		this.$elem.resize(function() {
			if (this.resizeTO) {
				clearTimeout(this.resizeTO)
			}
			this.resizeTO = setTimeout(function() {
				g.debug("element resized...");
				// g.update()
			}, 200)
		})
	};
	f.prototype.drawElements = function() {
		this.debug("drawing elements");
		if (this.config.elements) {
			this.elements = this.$relElem.find(this.config.elements)
		} else {
			this.elements = this.$relElem.children()
		}
		if (this.canvasSupported) {
			if (this.config.realistic) {
				this._drawElementsHtml2Canvas(this.$relElem);
				return false
			} else {
				this._drawElementsCanvas()
			}
		} else {
			this._drawElementsDom()
		}
	};
	f.prototype._drawElementsHtml2Canvas = function(h) {
		this.debug("Html2Canvas drawing");
		var g = this;
		this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
		this.$navigator.hide();
		this.config.html2canvas.onrendered = function(i) {
			var j = g.$canvas.get(0);
			g.ctx.drawImage(i, 0, 0, i.width, i.height, 0, 0, j.width, j.height);
			g.$navigator.show();
			g.updating = false;
			g.debug("Html2Canvas end drawing")
		};
		this.config.html2canvas.width = h.get(0).scrollWidth;
		this.config.html2canvas.height = h.get(0).scrollHeight;
		b.html2canvas(h, this.config.html2canvas)
	};
	f.prototype.getElementProps = function(g) {
		var i = c(g).offset();
		var h = (c(g).attr("mg-color")) ? c(g).attr("mg-color") : c(g).css("color");

		if (h === "rgba(0, 0, 0, 0)" || h === "transparent") {
			h = false
		}
		if (!h) {
			h = this.config.defaultBgColor
		}
		if(h=="rgb(51, 51, 51)"){
			h = this.config.defaultBgColor;
		}
		return {
			color: h,
			left: (i.left + this.scrollLeft - this.boardLeft) * this.ratio,
			top: (i.top + this.scrollTop - this.boardTop) * this.ratio,
			width: c(g).width() * this.ratio,
			height: c(g).height() * this.ratio
		}
	};
	f.prototype._drawElementsCanvas = function() {
		this.debug("canvas drawing");
		var g = this;
		this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
		c(this.elements).each(function() {
			var h = g.getElementProps(this);
			g.ctx.fillStyle = h.color;
			g.ctx.fillRect(h.left, h.top, h.width, h.height)
		})
	};
	f.prototype._drawElementsDom = function() {
		this.debug("dom drawing");
		var g = this;
		var h = "";
		c(this.elements).each(function() {
			var i = g.getElementProps(this);
			h += '<div style="background-color: ' + i.color + ";left: " + i.left + "px;top: " + i.top + "px;width: " + i.width + "px;height: " + i.height + 'px;"></div>'
		});
		this.$canvasDom.html(h)
	};
	f.prototype.debug = function(g) {
		if (this.config.debug) {
			// console.log(g)
		}
	};
	c.fn.mgMiniMap = function(g) {
		return this.each(function() {
			if (g === "update") {
				var h = c(this).data("mgMiniMap-instance");
				if (h) {
					h.update()
				}
			} else {
				new f(this, g)
			}
		})
	}
})(jQuery, window, document);
