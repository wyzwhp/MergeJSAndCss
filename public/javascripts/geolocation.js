function datainit() {
    var map1, marker, infowindow;
    navigator.geolocation.watchPosition(function(position) {
        $('#log').append('<div>' + JSON.stringify(position.coords) + '</div>');
        var latlng = new google.maps.LatLng(position.coords.latitude + Math.random(), position.coords.longitude + Math.random());
        $('#log').append('<div>' + JSON.stringify(latlng) + '</div>');
        marker = new google.maps.Marker({
            position: latlng,
            map: map1
        });
        map1.panTo(marker.getPosition());

    }, null, {
        maxiumAge: 2000
    })
    navigator.geolocation.getCurrentPosition(function(position) {
        var coords = position.coords;
        //设定地图参数，将用户的当前位置的纬度、经度设定为地图的中心点
        var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //创建地图并在“map“div中进行显示        
        map1 = new google.maps.Map(document.getElementById("map"), myOptions);
        //地图上创建标记
        marker = new google.maps.Marker({
            position: latlng,
            map: map1
        });
        /*google.maps.event.addListener(map1, 'center_changed', function() {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            window.setTimeout(function() {

                map1.panTo(marker.getPosition());
            }, 3000);
        });*/
        //设定标注窗口，并指定该窗口中的注释文字
        /*infowindow = new google.maps.InfoWindow({
            content: "当前位置！"
        });
        //打开标注窗口
        infowindow.open(map1, marker);*/
    });
}
$(function() {
    datainit();
})