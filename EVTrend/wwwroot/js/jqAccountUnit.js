﻿//Ready 一開始載入
$(document).ready(function () {
    //登入
    $("#loginbtn").click(function () {
        if (AccountCheck() & PasswordCheck()) {
            //送出表單 登入
            document.loginform.submit();
        } else {
            //錯誤訊息
            alert("帳號或密碼不符合規定。");
        }
    })

    //註冊
    $("#register").click(function () {
        if (AccountCheck() & UsernameCheck() & PasswordCheck() & RepeatPwdCheck() & GenderCheck() & BirthdayCheck()) {
            //帳號 物件
            var Account = $("#Account");

            //Ajax 送出前檢查帳號是否重複
            $.ajax({
                url: '/Account/DuplicateAccountCheck',
                data: { "Account": Account.val() },
                method: "POST",
                async: true,
                success: function (response) {
                    //錯誤訊息移除
                    $(".accountTip").remove();

                    //是否該帳號已存在
                    if (response) {
                        //錯誤訊息
                        var errMsg = "<span class='accountTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*該帳號已存在</font></span>";

                        //顯示錯誤訊息
                        Account.parent().append(errMsg);

                        //跳出錯誤訊息
                        alert("註冊資料不符合規定。");
                    } else {
                        //送出表單 註冊
                        document.signupform.submit();
                    }
                }
            });
        } else {
            //錯誤訊息
            alert("註冊資料不符合規定。");
        }
    })

    //修改密碼 事件
    $("#ResetPwd").click(function () {
        //註冊條件檢查 & BirthdayCheck()
        if (PasswordCheck() &
            RepeatPwdCheck()) {
            //送出表單 修改密碼
            document.ResetForm.submit();
        } else {
            //錯誤訊息
            alert("新密碼不符合規定。");
        }
    })

    //欄位限制檢查
    $(":input.required").blur(function () {
        //密碼
        if ($(this).is("#Password")) {
            PasswordCheck();
        }

        //再次確認密碼
        if ($(this).is("#PasswordCheck")) {
            RepeatPwdCheck();
        }

        //暱稱
        if ($(this).is("#Username")) {
            UsernameCheck();
        }

        //性別
        if ($(this).is("#Gender")) {
            GenderCheck();
        }
    })

    //日期Format
    DateFormat();
})

//帳號檢測
function AccountCheck() {
    //錯誤訊息移除
    $(".accountTip").remove();

    //帳號 物件
    var Account = $("#Account");

    //條件檢查
    if (Account.val() == "") {
        //錯誤訊息
        var errMsg = "<span class='accountTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*必須填寫</font></span>";

        //訊息顯示
        Account.parent().append(errMsg);

        //Return 失敗
        return false;
    }

    //Return 成功
    return true;
}

//密碼檢測
function PasswordCheck() {
    //錯誤訊息移除
    $(".passwordTip").remove();

    //密碼限制條件
    var PasswordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_ `\-={}:";'<>?,.\/]).{8,20}$/;

    //密碼
    var Password = $("#Password");

    //條件檢查
    if (!PasswordReg.test(Password.val())) {
        //錯誤訊息
        var errMsg = "<span class='passwordTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*請輸入8-20碼的大小寫英文字母及數字符號</font></span>";

        //顯示錯誤訊息
        Password.parent().append(errMsg);

        //Return 失敗
        return false;
    }
    //Return 成功
    return true;
}

//再次確認密碼檢測
function RepeatPwdCheck() {
    //移除錯誤訊息
    $(".repeatpasswordTip").remove();

    //再次確認密碼 物件
    var RepeatPwd = $("#PasswordCheck");

    //條件限制
    if (RepeatPwd.val() == "" || RepeatPwd.val() != $("#Password").val()) {
        //錯誤訊息
        var errMsg = "<span class='repeatpasswordTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*密碼為空或不一致</font></span>";

        //錯誤訊息顯示
        RepeatPwd.parent().append(errMsg);

        //Return 失敗
        return false;
    }
    //Return 成功
    return true;
}

//暱稱檢測
function UsernameCheck() {
    //錯誤訊息移除
    $(".usernameTip").remove();

    //暱稱 物件
    var Username = $("#Username");

    //條件檢查
    if (Username.val() == "" || Username.val().length > 20 || Username.val() == $("#Account").val()) {
        //錯誤訊息
        var errMsg = "<span class='usernameTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*必須填寫且不可與帳號相同</font></span>";

        //訊息顯示
        Username.parent().append(errMsg);

        //Return 失敗
        return false;
    }

    //Return 成功
    return true;
}

//性別檢測
function GenderCheck() {
    //錯誤訊息移除
    $(".genderTip").remove();

    //性別 物件
    var Gender = $("#Gender");

    //條件限制
    if (Gender.val() == "0") {
        //錯誤訊息
        var errMsg = "<span class='genderTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*必須選填</font></span>";

        //錯誤訊息顯示
        Gender.parent().append(errMsg);

        //Return 失敗
        return false;
    }
    //Return 成功
    return true;
}

//生日檢測
function BirthdayCheck() {
    //錯誤訊息移除
    $(".birthdayTip").remove();

    //生日 物件
    var Birthday = $("#Birthday");

    //今日 物件
    var Today = new Date().Format("yyyy-MM-dd");

    //條件限制 檢查生日是否小於1970或大於今日
    if (Birthday.val() != "" && (Birthday.val() < "1970-01-01" || Birthday.val() > Today)) {
        //錯誤訊息
        var errMsg = "<span class='birthdayTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*生日不得小於1970或大於今日</font></span>";

        //錯誤訊息顯示
        Birthday.parent().append(errMsg);

        //Return 失敗
        return false;
    }
    else if (Birthday.val() == "") {
        //錯誤訊息
        var errMsg = "<span class='birthdayTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*必須選填</font></span>";

        //錯誤訊息顯示
        Birthday.parent().append(errMsg);

        //Return 失敗
        return false;
    }
    //Return 成功
    return true;
}

//檢查是否有重複帳號
function CheckDuplicateAccount() {
    //帳號 物件
    var Account = $("#Account");

    //是否為空
    if (Account.val() != null && Account.val() != "") {
        //Ajax
        $.ajax({
            url: '/Account/DuplicateAccountCheck',
            data: { "Account": Account.val() },
            method: "POST",
            async: true,
            success: function (response) {
                //錯誤訊息移除
                $(".accountTip").remove();

                //是否該帳號已存在
                if (response) {
                    //錯誤訊息
                    var errMsg = "<span class='accountTip' style='margin-left: 10px'><font color=#DC3545 ; font size=2>*該帳號已存在</font></span>";

                    //顯示錯誤訊息
                    Account.parent().append(errMsg);
                } 
            }
        });
    }
}

//日期Format
function DateFormat() {
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小時 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
}