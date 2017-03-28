(function() {
    'use strict';
    var pwdObj = {
        password: window.localStorage.getItem('zlockpwd') ? window.localStorage.getItem('zlockpwd') : "",
        setFlag: true,
        setTime: 0,
        lastpwd: "",
        pwdArr: []
    };
    var conf = {
        matrixNum: 3,
        hollowColor: "#666666",
        selectedColor: "rgba(255,255,255,0)",
        solidColor: "#ccccdd",
        errorColor: "#ee6666",
        successColor: "#5bc0de",
        bdColor: "rgba(16,16,16,0.8)",
        canvasId: "lock",
        pwdObj: pwdObj
    };
    var zlock = new Zlock(conf);
    var prompt = window.document.getElementById("hint");
    Object.defineProperty(pwdObj, "pwdArr", {
        set: function set(arr) {
            if (this.setFlag) {
                if (this.setTime) {
                    if (this.lastpwd == JSON.stringify(arr)) {
                        this.password = md5(this.lastpwd);
                        prompt.textContent = "设置成功";
                        window.localStorage.setItem('zlockpwd', md5(this.lastpwd));
                    } else {
                        prompt.textContent = "两次输入不一致,请重新输入";
                        zlock.error();
                        window.setTimeout(function () {
                            prompt.textContent = "请输入密码";
                        }, 500);
                    }
                    this.setTime = 0;
                } else {
                    if (arr.length < 5) {
                        prompt.textContent = "密码太短,至少要5个点";
                        zlock.error();
                        window.setTimeout(function () {
                            prompt.textContent = "请输入密码";
                        }, 1000);
                    } else {
                        this.lastpwd = JSON.stringify(arr);
                        this.setTime++;
                        prompt.textContent = "请再次输入密码";
                    }
                }
            } else {
                if (this.password == md5(JSON.stringify(arr))) {
                    prompt.textContent = "验证成功";
                    zlock.success();
                } else {
                    prompt.textContent = "密码错误";
                    setTimeout(function () {
                        prompt.textContent = "请输入密码";
                    }, 1000);
                    zlock.error();
                }
            }
        }
    });
    var $form = document.getElementsByClassName("form")[0];
    $form.addEventListener("click", function (event) {
        if (event.target.value == "check") {
            pwdObj.setFlag = false;
            prompt.textContent = "请输入密码";
        } else if (event.target.value == "set") {
            pwdObj.setFlag = true;
            prompt.textContent = "请设置密码";
        }
    }, false);
    window.addEventListener("resize", function () {
        zlock.init();
    }, false);
})();