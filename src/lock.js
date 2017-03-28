;
(function() {
    "use strict";
    let zlockInstance = null;
    window.Zlock = class Zlock {
        /**
         * @param {Object} config  
         */
        constructor(config) {
            if(zlockInstance) {
                return zlockInstance;
            }
            zlockInstance = this;            
            if(!window.localStorage) {  //考虑兼容性
                throw new Error("您的浏览器不支持localStorage,或者开启了隐身模式");
            }
            let defaultConfig = {
                matrixNum: 3,
                hollowColor: "#999999",
                selectedColor: "rgba(255,255,255,0)",
                solidColor: "#ccccdd",
                errorColor: "#ee6666",
                successColor: "#5bc0de",
                bdColor: "rgba(16,16,16,0.8)"
            };
            config = Object.assign(defaultConfig, config)
            this.config = config;
            Object.assign(this, config);
            this.inputArr = document.getElementsByName(config.inputName);
            this.canvasId = config.canvasId;
            this.canvas = window.document.getElementById(this.canvasId);                         
            this.ctx = this.canvas.getContext('2d');
            this.init();
        }
        /**
         * init reset color and coords
         */
        init() {
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
        HCircleInit() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            let ifColumn = this.ctx.canvas.width < this.ctx.canvas.height;
            let r = this.r = ifColumn ? this.ctx.canvas.width / (2 + 4 * this.matrixNum) : this.ctx.canvas.height / (2 + 4 * this.matrixNum);
            let arr = [];
            let vArr = [];
            for (let j = 0; j < this.matrixNum; j++) {
                for (let i = 0; i < this.matrixNum; i++) {
                    arr.push({
                        x: (i * 4 + 3) * r,
                        y: (j * 4 + 3) * r + this.ctx.canvas.height * 0.15
                    });
                }
            }
            return arr;
        }
        /**
         * 把canvas内2D上下文坐标转为视图坐标
         */
        ViewCircleInit() {
            let arr = this.HCircleArr;
            let prop = this.prop;
            return arr.map((value) => {
                return {
                    x: value.x * prop,
                    y: value.y * prop
                }
            })
        }
        /**
         * draw current status canvas
         */
        drawCurrentStatus() {
            // 清空
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // 加蒙层
            this.ctx.fillStyle = this.bdColor;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // 画空心圆
            this.ctx.strokeStyle = this.hollowColor;         
            let arr = this.HCircleArr;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            for (let i = 0, r = this.r; i < arr.length; i++) {
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
            for (let i = 0, r = this.r; i < arr.length; i++) {
                this.ctx.moveTo(arr[i].x + r / 2, arr[i].y);
                this.ctx.arc(arr[i].x, arr[i].y, r / 2, 0, Math.PI * 2, true);
            }
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.strokeStyle = this.selectedColor;
            this.ctx.beginPath();
            for (let i = 0, r = this.r; i < arr.length; i++) {
                this.ctx.moveTo(arr[i].x + r, arr[i].y);
                this.ctx.arc(arr[i].x, arr[i].y, r, 0, Math.PI * 2, true);
            }
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.strokeStyle = this.solidColor;
            this.ctx.beginPath();
            for (let i = 0, r = this.r; i < arr.length; i++) {
                this.ctx.lineTo(arr[i].x, arr[i].y);
            }
            this.ctx.stroke();
            this.ctx.closePath();  
        }
        /**
         * add eventlisteners
         */
        bindEvent() {
            let self = this;
            let r = this.r;
            let touchstartFun;
            this.canvas.addEventListener("touchstart", touchstartFun = e => {
                e.preventDefault();
                let po = self.getPosition(e);
                for (let i = 0, rX, rY; i < self.existPoints.length; i++) {
                    rX = Math.abs(po.x - self.existPoints[i].x);
                    rY = Math.abs(po.y - self.existPoints[i].y);
                    if (rX * rX + rY * rY < r * r) {
                        self.touchFlag = true;
                        self.selectedStack.push(self.existPoints[i]);
                        self.existPoints.splice(i, 1);
                        this.drawCurrentStatus();
                        break;
                    }
                }
            }, false);
            this.canvas.addEventListener("touchmove", (e) => {
                if (self.touchFlag) {
                    self.update(self.getPosition(e));
                }
            }, false);
            this.canvas.addEventListener("touchend", (e) => {
                if (self.touchFlag) {
                    self.touchFlag = false;
                    self.pwdObj.pwdArr = self.transcoding();
                    this.drawCurrentStatus();
                    window.setTimeout(function(){
                        self.init();
                    }, 500);
                //  self.savePass();
                 }
            }, false)
        }
        /**
         * @param context coords
         */
        update(po) {
            let r = this.r;
            this.drawCurrentStatus();
            let last = this.selectedStack[this.selectedStack.length-1];
            this.ctx.beginPath();  
            this.ctx.moveTo(po.x, po.y);          
            this.ctx.lineTo(last.x, last.y);
            this.ctx.closePath();
            this.ctx.stroke();
            // 判断点击位置是否为圆内
            for (let i = 0, rX, rY; i < this.existPoints.length; i++) {
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
        getPosition(e) {
            let rect = e.currentTarget.getBoundingClientRect();
            let position = {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
            return position;
        }
        /**
         * view-coords to context-coords
         */
        viewToContext(po) {
            return {
                x: po.x / this.prop,
                y: po.y / this.prop
            }
        }
        /**
         * set error status
         */
        error() {
            this.solidColor = this.errorColor;
        }
        /**
         * set success status
         */
        success() {
            this.solidColor = this.successColor;
        }
        /**
         * coords transcode to number 
         */
        transcoding() {
            var arr = this.selectedStack;
            var oarr = this.HCircleArr;
            let rarr = [];
            for(let i = 0; i < arr.length; i++) {
                for(let j = 0; j < oarr.length; j++) {
                    if(arr[i].x === oarr[j].x && arr[i].y === oarr[j].y) {
                        rarr.push(j+1);
                    }
                }
            }
            return rarr;
        }
    }
})();