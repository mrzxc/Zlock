"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;
(function () {
    "use strict";

    var zlockInstance = null;
    window.Zlock = function () {
        /**
         * @param {Object} config  
         */
        function Zlock(config) {
            _classCallCheck(this, Zlock);

            if (zlockInstance) {
                return zlockInstance;
            }
            zlockInstance = this;
            if (!window.localStorage) {
                //考虑兼容性
                throw new Error("您的浏览器不支持localStorage,或者开启了隐身模式");
            }
            var defaultConfig = {
                matrixNum: 3,
                hollowColor: "#999999",
                selectedColor: "#666666",
                solidColor: "#6699cc",
                errorColor: "#ff0000",
                successColor: "#5bc0de",
                bdColor: "rgba(64,64,64,0.9)"
            };
            config = Object.assign(this, defaultConfig, config);
            this.config = config;
            this.inputArr = document.getElementsByName(config.inputName);
            this.selectedColor = config.selectedColor;
            this.canvasId = config.canvasId;
            this.canvas = window.document.getElementById(this.canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.init();
        }
        /**
         * init reset color and coords
         */


        _createClass(Zlock, [{
            key: "init",
            value: function init() {
                this.canvas.width = document.documentElement.clientWidth;
                this.canvas.height = document.documentElement.clientHeight;
                this.prop = this.canvas.width / this.ctx.canvas.width;
                this.hollowColor = this.config.hollowColor;
                this.solidColor = this.config.solidColor;
                this.touchFlag = false;
                this.HCircleArr = this.HCircleInit();
                this.viewCircleArr = this.ViewCircleInit();
                this.existPoints = this.viewCircleArr.slice(0);
                this.selectedStack = [];
                this.drawCurrentStatus();
                this.bindEvent();
            }
            /**
             * 空心圆初始化 hollowCircleInit
             */

        }, {
            key: "HCircleInit",
            value: function HCircleInit() {
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                var r = this.r = this.ctx.canvas.width / (2 + 4 * this.matrixNum);
                var arr = [];
                var vArr = [];
                for (var j = 0; j < 3; j++) {
                    for (var i = 0; i < 3; i++) {
                        arr.push({
                            x: (i * 4 + 3) * r,
                            y: (j * 4 + 3) * r + this.ctx.canvas.height * 0.08
                        });
                    }
                }
                return arr;
            }
            /**
             * 把canvas内2D上下文坐标转为视图坐标
             */

        }, {
            key: "ViewCircleInit",
            value: function ViewCircleInit() {
                var arr = this.HCircleArr;
                var prop = this.prop;
                return arr.map(function (value) {
                    return {
                        x: value.x * prop,
                        y: value.y * prop
                    };
                });
            }
            /**
             * draw current status canvas
             */

        }, {
            key: "drawCurrentStatus",
            value: function drawCurrentStatus() {
                // 清空
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                // 加蒙层
                this.ctx.fillStyle = this.bdColor;
                this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                // 画空心圆
                this.ctx.strokeStyle = this.hollowColor;
                var arr = this.HCircleArr;
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                for (var i = 0, r = this.r; i < arr.length; i++) {
                    this.ctx.moveTo(arr[i].x + r, arr[i].y);
                    this.ctx.arc(arr[i].x, arr[i].y, r, 0, Math.PI * 2, true);
                }
                this.ctx.globalCompositeOperation = "destination-out";
                this.ctx.stroke();
                // 把空心圆内加亮
                this.ctx.globalCompositeOperation = "source-over";
                this.ctx.closePath();
                // 显示已选择的圆点
                arr = this.selectedStack;
                this.ctx.fillStyle = this.solidColor;
                this.ctx.beginPath();
                for (var _i = 0, _r = this.r; _i < arr.length; _i++) {
                    this.ctx.moveTo(arr[_i].x + _r / 2, arr[_i].y);
                    this.ctx.arc(arr[_i].x, arr[_i].y, _r / 2, 0, Math.PI * 2, true);
                }
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.strokeStyle = this.selectedColor;
                this.ctx.beginPath();
                for (var _i2 = 0, _r2 = this.r; _i2 < arr.length; _i2++) {
                    this.ctx.moveTo(arr[_i2].x + _r2, arr[_i2].y);
                    this.ctx.arc(arr[_i2].x, arr[_i2].y, _r2, 0, Math.PI * 2, true);
                }
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.strokeStyle = this.solidColor;
                this.ctx.beginPath();
                for (var _i3 = 0, _r3 = this.r; _i3 < arr.length; _i3++) {
                    this.ctx.lineTo(arr[_i3].x, arr[_i3].y);
                }
                this.ctx.stroke();
                this.ctx.closePath();
            }
            /**
             * add eventlisteners
             */

        }, {
            key: "bindEvent",
            value: function bindEvent() {
                var _this = this;

                var self = this;
                var r = this.r;
                var touchstartFun = void 0;
                this.canvas.addEventListener("touchstart", touchstartFun = function touchstartFun(e) {
                    e.preventDefault();
                    var po = self.getPosition(e);
                    for (var i = 0, rX, rY; i < self.existPoints.length; i++) {
                        rX = Math.abs(po.x - self.existPoints[i].x);
                        rY = Math.abs(po.y - self.existPoints[i].y);
                        if (rX * rX + rY * rY < r * r) {
                            self.touchFlag = true;
                            self.selectedStack.push(self.existPoints[i]);
                            self.existPoints.splice(i, 1);
                            _this.drawCurrentStatus();
                            break;
                        }
                    }
                }, false);
                this.canvas.addEventListener("touchmove", function (e) {
                    if (self.touchFlag) {
                        self.update(self.getPosition(e));
                    }
                }, false);
                this.canvas.addEventListener("touchend", function (e) {
                    if (self.touchFlag) {
                        self.touchFlag = false;
                        self.pwdObj.pwdArr = self.transcoding();
                        _this.drawCurrentStatus();
                        window.setTimeout(function () {
                            self.init();
                        }, 500);
                        //  self.savePass();
                    }
                }, false);
            }
            /**
             * @param context coords
             */

        }, {
            key: "update",
            value: function update(po) {
                var r = this.r;
                this.drawCurrentStatus();
                var last = this.selectedStack[this.selectedStack.length - 1];
                this.ctx.beginPath();
                this.ctx.moveTo(po.x, po.y);
                this.ctx.lineTo(last.x, last.y);
                this.ctx.closePath();
                this.ctx.stroke();
                // 判断点击位置是否为圆内
                for (var i = 0, rX, rY; i < this.existPoints.length; i++) {
                    rX = Math.abs(po.x - this.existPoints[i].x);
                    rY = Math.abs(po.y - this.existPoints[i].y);
                    if (rX * rX + rY * rY < r * r) {
                        this.touchFlag = true;
                        this.selectedStack.push(this.existPoints[i]);
                        this.existPoints.splice(i, 1);
                        break;
                    }
                }
            }
            /**
             * @param {Object} event
             * @return {Object} position
             */

        }, {
            key: "getPosition",
            value: function getPosition(e) {
                var rect = e.currentTarget.getBoundingClientRect();
                var position = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
                return position;
            }
            /**
             * view-coords to context-coords
             */

        }, {
            key: "viewToContext",
            value: function viewToContext(po) {
                return {
                    x: po.x / this.prop,
                    y: po.y / this.prop
                };
            }
            /**
             * set error status
             */

        }, {
            key: "error",
            value: function error() {
                this.solidColor = this.errorColor;
            }
            /**
             * set success status
             */

        }, {
            key: "success",
            value: function success() {
                this.solidColor = this.successColor;
            }
        }, {
            key: "transcoding",
            value: function transcoding() {
                var arr = this.selectedStack;
                var oarr = this.HCircleArr;
                var rarr = [];
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < oarr.length; j++) {
                        if (arr[i].x === oarr[j].x && arr[i].y === oarr[j].y) {
                            rarr.push(j + 1);
                        }
                    }
                }
                return rarr;
            }
        }]);

        return Zlock;
    }();
})();