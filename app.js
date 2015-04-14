/*

Author: Edward Rey Chua
Email: chua.edward@gmail.com

*/


(function ($, _) {


    //Github API object    
    var api = {
        search: function (str) {
            return $.get("https://api.github.com/search/repositories", { q: str });
        }
    };

    //Templates
    var templates = {
        result: '<% _.forEach(items, function(item) { %><li><a href="#" class="details" data-id="<%= item.id%>"><%- item.full_name%> </a><%= itemDetail({item:item}) %></li><% }); %>',
        resultDetail: '<ul id="detail<%= item.id%>" style="display: none"><li>language: <%= item.language%></li><li>url: <%- item.html_url%></li><li>description: <%- item.description%></li><li>followers: <ul data-url="<%= item.owner.followers_url%>" id="follower<%= item.id%>"></ul></li></ul>',
        followers: '<% _.forEach(items, function(item) { %><li><%- item.login%></li><% }); %>'
    };


    //Main App
    var app = {


        init: function () {

            var $btn = $('#btnSearch');
            var $results = $('#results');
            var $resultContainer = $('#resultList');

            var compiledResult = _.template(templates.result);
            var compiledDetail = _.template(templates.resultDetail);
            var compiledFollowers = _.template(templates.followers);

            $btn.on('click', function (e) {

                var searchStr = $('#search').val();

                api.search(searchStr).done(function (data) {
                    data.itemDetail = compiledDetail;

                    $resultContainer
                        .empty()
                        .append(compiledResult(data))

                    console.log(JSON.stringify(data, null, '\t'));
                });
            });


            $results.on('click', function (e) {
                e.stopPropagation();
                var $target = $(e.target);

                if ($target.prop('class') === 'details') {

                    var id = $target.data('id'),
                    $followerList = $('#follower' + id),
                    $detail = $('#detail' + id);

                    $detail.toggle();

                    if($detail.is(':visible')){
                        $.get($followerList.data('url'), {}).done(function (data) {
                            $followerList.empty()
                            .append(compiledFollowers({ items: data }));
                        });
                    }

                }

            });
        }
    };


    $('document').ready(function () {
        app.init();
    });

})($, _);