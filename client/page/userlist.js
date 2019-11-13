let userListModel = (function () {

    let $selectBox = $('.selectBox'),
        $searchInp = $('.searchInp'),
        $tableBox = $('.tableBox'),
        $tbody = $tableBox.children('tbody');
    $thead = $tableBox.children('thead');
    $theadTH = $thead.find('th');
    $deleteAll = $('.deleteAll');

    // console.log($tableBox);
    // console.log($tbody);
    let power = localStorage.getItem('power') || '';

    // 权限校验
    let checkPower = function () {
        if (!power.includes('userhandle')) {
            $deleteAll.remove();
            // $theadTH.eq(0).remove();
            $theadTH.eq($theadTH.length - 1).remove();
        }
    };

    //=>从服务器获取数据,实现数据的绑定
    let render = function () {
        let departmentId = $selectBox.val(),
            search = $searchInp.val().trim();

        return axios.get('/user/list', {
            params: {
                departmentId,
                search
            }
        }).then(result => {
            //=>数据处理
            let {
                code,
                data
            } = result;
            if (parseFloat(code) === 0) {
                // console.log(code);
                return data;
            }

            return Promise.reject();
        }).then(data => {

            //=>数据渲染
            let str = ``;
            data.forEach(item => {
                let {
                    id,
                    name = '--',
                    sex = '-',
                    department = '--',
                    phone = '--',
                    desc = '',
                } = item;

                str += `<tr class="wrap1" data-id='${id}' data-name='${name}'>
                <td class='w8'>${name}</td>
                <td class='w5'>${parseFloat(sex)===0?'男':'女'}</td>
                <td class='w15'>${department}</td>
                <td class='w10'>${phone}</td>
                <td class='beizhu'>${desc}</td>
                ${power.includes('userhandle')?` <td class='w15'>	
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
           ${power.includes('resetpassword')?` <a href="javascript:;">重置密码</a>`:``}    
            </td>`:''}
               
            </tr>`;
            });
            $tbody.html(str);
        }).catch(() => {
            //=>没数据列表清空;
            $tbody.html('');
        });
    };

    //=>从服务器获取部门信息:把其设置在下拉列表中
    let selectBind = function () {
        return axios.get('/department/list').then(result => {
            if (parseInt(result.code) === 0) {
                let str = `<option value='0'>全部</option>`;
                // console.log(result);
                result.data.forEach(item => {
                    str += `<option value='${item.id}'>${item.name}</option>`
                });
                $selectBox.html(str);
            }
        });
    };

    //=>筛选数据的事件处理
    let handleFilter = function () {
        $selectBox.on('change', render);
        $searchInp.on('keydown', function (ev) {

            if (ev.keyCode === 13) {
                //=>按下的是Enter键
                render();
            }
        })
    };

    //=>基于事件委托处理员工的相关操作
    let handleDelegate = function () {
        $tbody.click(function (ev) {
            let target = ev.target,
                tarTag = target.tagName,
                tarVal = target.innerText,
                $target = $(target);

            // console.log(ev);
            // console.log(target);
            // console.log(target.tagName);
            // console.log(tarVal);
            // console.log( $target)

            if (tarTag === 'A' && tarVal === '重置密码') {
                let $grandpa = $target.parent().parent(),
                    userId = $target.attr('data-id'),
                    userName = $grandpa.attr('data-name');
                alert(`确定要把${userName}的效果重置吗?`, {
                    title: '???',
                    confirm: true,
                    handled: msg => {
                        if (msg === 'CONFIRM') {
                            //=>用户点击的是确定
                            axios.post('/user/resetpassword', {
                                userId
                            }).then(result => {
                                if (parseInt(result.code) === 0) {
                                    alert('恭喜您,当前操作成功!')
                                    return;
                                }
                                alert('当前操作失败,请稍后重试');
                            });
                        }
                    }
                });
                return;
            };
            if (tarTag === 'A' && tarVal === '删除') {
                let $grandpa = $target.parent().parent(),
                    userId = $grandpa.attr('data-id'),
                    userName = $grandpa.attr('data-name');
                alert(`确定要把${userName}删除吗?`, {
                    confirm: true,
                    handled: msg => {
                        if(msg!=='CONFIRM')return;
console.log(userId,$grandpa,userName);
                            //=>用户点击的是确定
                            axios.get('/user/delete', {
                              params:{
                                  userId
                              }  
                            }).then(result => {
                                if (parseInt(result.code) === 0) {
                                    render();
                                    return;
                                }
                                alert('当前操作失败');
                            });
                        
                    }
                });
                return;
            }

        });

    };

    return {
        init() {
            checkPower();
            selectBind()
                .then(() => {
                    render();
                });
            handleFilter();
            handleDelegate();
        }
    }
})();
userListModel.init();
