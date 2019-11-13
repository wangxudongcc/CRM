$(function () {
    let $userName = $(".userName"),
        $userPass = $(".userPassword"),
        $submit = $(".submit");

    $submit.click(function () {
        let userName = $userName.val().trim();
        let userPass = $userPass.val().trim();
        if (userName === "" || userPass === "") {
            alert("用户名密码不能为空,请您输入");
            return;
        }
        // userPass=md5(userPass);
        //=>发送Ajax 请求
        axios
            .post("/user/login", {
                account: userName,
                password: userPass
            })
            .then(result => {
                let {
                    code,
                    codeText,
                    power
                } = result;
                if (parseFloat(code) === 0) {
                    alert("恭喜您登陆成功!", {
                        handled: function () {
                            console.log('AAA');
                            //=>把用户的权限校验码存储在本地
                            localStorage.setItem('power', encodeURIComponent(power));
                            window.location.href = "index.html";
                        }
                    });
                    return;
                }
                alert("用户名和密码不匹配请重试");
            });
    });
});


[12,34,56,7]
[21314]