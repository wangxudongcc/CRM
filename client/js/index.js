//权限校验
$(function () {
    let power =localStorage.getItem('power');
    if(power===null){
        alert ('请重新登录',{
            handled:()=>{
                window.location.href='login.html';
            }
        })
        return;
    } 
    power = decodeURIComponent(power);
    let str = `
    <div class="itemBox">
      <h3>
        <i class="iconfont icon-weibiaoti2"></i>
      <span>员工管理</span> 
      </h3>
      <nav class="item">
        <a href="./page/userlist.html" target='_iframe'>员工列表</a>
       ${power.includes('userhandle')?`<a href="./page/useradd.html" target = '_iframe'>新增员工</a>`:``}
      </nav>
    </div>
    <div class="itemBox">
      <h3>
        <i class="iconfont icon-bumenguanli"></i>
        <span>部门管理</span>
      </h3>
      <nav class="item">
        <a href="./page/departmentlist.html" target='_iframe'>部门列表</a>
        ${power.includes('departhandle')?`<a href="./page/departmentadd.html" target = '_iframe'>新增部门</a>`:``}
      </nav>
    </div>

    <div class = "itemBox">
        ${power.includes('jobhandle') ? `<h3>
     <i class="iconfont icon-zhiwuguanli"></i>
     <span>职务管理</span></h3>
     <nav class="item">
     <a href="./page/joblist.html" target='_iframe'>职务列表</a>
     <a href="./page/jobadd.html" target = '_iframe'>新增职务</a>  
     </nav> ` : ``}
    </div>

    <div class="itemBox">
          <h3>
            <i class="iconfont icon-kehu"></i>
            客户管理
          </h3>
          <nav class="item">
            <a href="./page/customerlist.html" target='_iframe'>我的客户</a>
            ${power.includes('departcustomer')||power.includes('allcustomer')?`<a href="./page/customerlist.html" target='_iframe'>全部客户</a>`:``}
            ${power.includes('allcustomer')?`<a href="./page/customeradd.html" target='_iframe'>新增客户</a>
          `:``}
          </nav>
        </div>`;
    $('.menuBox').html(str);
});




$(function () {
    let $header = $('.headerBox'),
        $baseBox = $header.find('.baseBox'),
        $spanName = $baseBox.children('span'),
        $signoutBtn = $baseBox.children('a'),
        $footer = $('.footBox'),
        $container = $('.container'),
        $menuBox = $('.menuBox'),
        $navList = $('.navBox a'),
        $itemBox = $menuBox.find('.itemBox'),
        $iframeBox = $('.iframeBox');


    function computed() {
        winH = $(window).height();
        $container.css('height', winH - $header.outerHeight() - $footer.outerHeight());
    }
    computed();
    $(window).on('resize', computed);


    axios.get('/user/login').then(result => {
        if (parseFloat(result.code) === 0) {
            return axios.get('/user/info');
        }
        alert('您还没有登录,请先登录', {
            handled: function () {
                window.location.href = 'login.html';
            }
        });
        return Promise.reject();
    }).then(result => {
        //=>已经从服务器端获取到当前登陆用户的基本信息;
        if (parseFloat(result.code) === 0) {
            let data = result.data;
            $spanName.html(`欢迎: ${data.name}`);
        }
    });
    //=>安全退出
    $signoutBtn.click(function () {
        axios.get('/user/signout').then(result => {
            if (parseFloat(result.code) === 0) {
                //=>把本地存储的POWER信息清除
                localStorage.removeItem('power');
                window.location.href = 'login.html';
                return;
            }
            alert('当前操作失败,请稍后重试~');
        })
    })

    //=>基于事件委托实现折叠菜单;
    $menuBox.click(function (ev) {
        let target = ev.target,
            tagTag = target.tagName,
            $target = $(target);
        if (tagTag === 'I') {
            $target = $target.parent();
            target = 'H3';
        }
        if (target === 'H3') {
            $target.next().stop().slideToggle(300);
        };

    });

    let $organize = $itemBox.filter(':lt(3)'),
        $customer = $itemBox.eq(3),
        initIndex = 0,
        HASH = window.location.href.queryURLParams()['HASH'] || 'organize';
    HASH === 'customer' ? initIndex = 1 : null;


    function change(index) {
        $navList.eq(index).addClass('active').siblings().removeClass('active');
        if (index === 0) {
            $organize.css('display', 'block');
            $customer.css('display', 'none');
            $iframeBox.attr('src', 'page/userlist.html');
        } else {
            $organize.css('display', 'none');
            $customer.css('display', 'block');
            $iframeBox.attr('src', 'page/customerlist.html');
        }
    }

    change(initIndex);

    $navList.click(function () {
        let $this = $(this),
            index = $this.index();
        change(index);
    });
})