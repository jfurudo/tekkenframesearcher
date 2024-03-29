(function () {

    var enumDetections = [
        "上",
        "中",
        "下",
        "特殊",
        "ガ不",
        "投げ"
    ],characters = [{"text":"アンノウン (Unknown)","id":"アンノウン"},{"text":"ヴァイオレット (Violet)","id":"ヴァイオレット"},{"text":"ボスコノビッチ (Bosconovitch)","id":"ボスコノビッチ"},{"text":"スリムボブ (Slim Bob)","id":"スリムボブ"},{"text":"セバスチャン (Sebastian)","id":"セバスチャン"},{"text":"美晴 (Miharu)","id":"美晴"},{"text":"アレックス (Alex)","id":"アレックス"},{"text":"P.ジャック (P.Jack)","id":"P.ジャック"},{"text":"タイガー (Tiger)","id":"タイガー"},{"text":"フォレスト (Forest Law)","id":"フォレスト"},{"text":"ミシェール (Michelle)","id":"ミシェール"},{"text":"エンジェル (Angel)","id":"エンジェル"},{"text":"エンシェントオーガ (Acient Ogre)","id":"エンシェントオーガ"},{"text":"州光 (Kunimitsu)","id":"州光"},{"text":"コンボット (Combot)","id":"コンボット"},{"text":"仁八 (Jinpachi)","id":"仁八"},{"text":"オーガ (Ogre)","id":"オーガ"},{"text":"準 (Jun)","id":"準"},{"text":"ジェイシー (Jaycee)","id":"ジェイシー"},{"text":"平八 (Heihachi)","id":"平八"},{"text":"仁 (Jin)","id":"仁"},{"text":"一八 (Kazuya)","id":"一八"},{"text":"飛鳥 (Asuka)","id":"飛鳥"},{"text":"リリ (Lili)","id":"リリ"},{"text":"ファラン (Hwoarang)","id":"ファラン"},{"text":"シャオユウ (Xiaoyu)","id":"シャオユウ"},{"text":"クリスティ/エディ (Christie / Eddy)","id":"クリスティ/エディ"},{"text":"フェン (Feng)","id":"フェン"},{"text":"レイ (Lei)","id":"レイ"},{"text":"リー (Lee)","id":"リー"},{"text":"ポール (Pawl)","id":"ポール"},{"text":"ロウ (Law)","id":"ロウ"},{"text":"スティーブ (Steve)","id":"スティーブ"},{"text":"マードック (Marduk)","id":"マードック"},{"text":"キング (King)","id":"キング"},{"text":"アーマーキング (Armor King)","id":"アーマーキング"},{"text":"巌竜 (Ganryu)","id":"巌竜"},{"text":"ニーナ (Nina)","id":"ニーナ"},{"text":"アンナ (Anna)","id":"アンナ"},{"text":"吉光 (Yoshimitsu)","id":"吉光"},{"text":"ブライアン (Bryan)","id":"ブライアン"},{"text":"ジャック6 (Jack-6)","id":"ジャック6"},{"text":"クマ/パンダ (Kuma / Panda)","id":"クマ/パンダ"},{"text":"ロジャーJr. (Rojer Jr.)","id":"ロジャーJr."},{"text":"ワン (Wang)","id":"ワン"},{"text":"ブルース (Bruce)","id":"ブルース"},{"text":"ペク (Baek)","id":"ペク"},{"text":"レイヴン (Raven)","id":"レイヴン"},{"text":"ドラグノフ (Dragunov)","id":"ドラグノフ"},{"text":"デビル仁 (Devil Jin)","id":"デビル仁"},{"text":"レオ (Leo)","id":"レオ"},{"text":"ザフィーナ (Zafina)","id":"ザフィーナ"},{"text":"ミゲル (Migel)","id":"ミゲル"},{"text":"ボブ (Bob)","id":"ボブ"},{"text":"ラース (Lars)","id":"ラース"},{"text":"アリサ (Alisa)","id":"アリサ"},{"text":"木人 (Mokujin)","id":"木人"}];

    var socket;

    $().ready(function () {
        var limit = 10,
            offset = 0,
            loading = false,
            searching = false;

        socket = io.connect(location.href);

        $("#character").select2({
            data: characters,
            placeholder: "指定なし",
            allowClear: true,
            multiple: true
        });
        $("#detectionFlag").click(function () {
            if (this.value === "0") {
                this.value = 1;
                $("#detectionSelectSet").removeAttr("disabled");
            } else {
                this.value = 0;
                $("#detectionSelectSet").attr("disabled", "disabled");
            }
        });
        $("#detection").change(function () {
            if (this.value === "5" || this.value === "4") {
                // 投げが選択された場合
                $("#_guard_min").attr("disabled", "disabled");
            } else {
                $("#_guard_min").removeAttr("disabled");
            }
        }).change();
        $("#frameRadio button").click(function () {
            console.log(this.value);
            $("#frameType").val(this.value);
            $("#frameRadio .active").removeClass("active");
            $(this).addClass("active");
            if (this.value === "range") {
                $("#_guard_max").removeAttr("disabled");
            } else {
                $("#_guard_max").attr("disabled", "disabled");
            }
        });
        $("#clear").click(function () {
            $("#character").val("");
            $(".select").select2("data", null);
            $("#name").val("");
            $("#detectionFlag").val("0");
            $("#detectionFlag").removeAttr("checked");
            $("#detectionSelectSet").attr("disabled", "disabled");
            $("button[value=eq]").trigger("click");
            $("#_guard_min").val("");
            $("#_guard_max").val("");
        });
        $("#search").click(function () {
            $("#moveList").empty();
            offset = 0;
            getMoves();
        });
        $(window).on("scroll", function() {
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            console.log((scrollHeight - scrollPosition) / scrollHeight);
            console.log(searching, loading);
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                if (searching === true && loading === false) {
                    getMoves();
                }
            }
        });
        var getMoves = function () {
            loading = true;
            if (searching === false) {
                $("#moveList").empty();
            }
            var selectedCaharacters = $("#character").val().split(','),
                name = $("#name").val(),
                detectionFlag = $("#detectionFlag").val(),
                detection = $("#detection").val(),
                frameType = $("#frameType").val(),
                guardMin = $("#_guard_min").val(),
                guardMax = $("#_guard_max").val(),
                searchType = "move",
                data = {where: {}, limit: limit, offset: offset};

            if (selectedCaharacters[0] !== "") {
                data.where.character = selectedCaharacters;
            }
            if (name !== "") {
                data.where.name = {
                    contains: name
                };
            }
            if (detectionFlag === "1") {
                if (detection !== "5") {
                    // 投げ以外
                    data.where.lastDetection = enumDetections[detection];
                } else {
                    searchType = "throw";
                }
            }
            if (guardMin !== "" && detection !== "4" && detection !== "5") {
                if (frameType === "eq") {
                    data.where._guard_max = Number(guardMin);
                    data.where._guard_min = Number(guardMin);
                } else if (frameType === "gt") {
                    data.where._guard_min = {
                        ">=": Number(guardMin)
                    };
                } else if (frameType === "lt") {
                    data.where._guard_max = {
                        "<=": Number(guardMin)
                    };
                }
            }
            console.log(data);
            socket.request("/" + searchType + "/find", data, function (data) {
                if (data.length < limit) {
                    searching = false;
                } else {
                    offset += limit;
                    searching = true;
                }
                setTableHeader(searchType);
                appendMoveRow(data);
            });
        };

        var setTableHeader = function (type) {
            var $ths = $("thead tr").children();
            if (type === "move") {
                $($ths[7]).text("ガード");
                $($ths[7]).text("ヒット");
                $($ths[8]).text("CH");
            } else {
                $($ths[7]).text("抜け");
                $($ths[7]).text("抜け後");
                $($ths[8]).text("投げ後");
            }
        };
        var appendMoveRow = function (moves, type) {
            for (var i = 0; i < moves.length; i++) {
                var $row = $('<tr class="movelist-row col-xs-12"></tr>');
                var tdArray = [];
                tdArray.push('<td class="row1 col-xs-4 col-sm-1 col-md-1">' + moves[i].character + '</td>');
                tdArray.push('<td class="row1 col-xs-8 col-sm-2 col-md-2">' + moves[i].name + '</td>');
                tdArray.push('<td class="row2 col-xs-3 col-sm-2 col-md-2">' + moves[i].command.replace(/\./g, ", ") + '</td>');
                tdArray.push('<td class="row2 col-xs-2 col-sm-1 col-md-1">' + moves[i].detection.replace(/\./g, ", ") + '</td>');
                tdArray.push('<td class="row2 col-xs-2 col-sm-1 col-md-1">' + moves[i].damage.replace(/\./g, ", ") + '</td>');
                tdArray.push('<td class="row2 col-xs-2 col-sm-1 col-md-1">' + moves[i].startup + '</td>');
                tdArray.push('<td class="row2 col-xs-1 col-sm-1 col-md-1">' + moves[i].guard + '</td>');
                tdArray.push('<td class="row2 col-xs-1 col-sm-1 col-md-1">' + moves[i].hit + '</td>');
                tdArray.push('<td class="row2 col-xs-1 col-sm-1 col-md-1">' + moves[i].ch + '</td>');
                $row.append(tdArray);
                $('#moveList').append($row);                    
            }
            loading = false;
        };
        var toggleDesign = function (type) {
            var tr = '<tr class="col-xs-12"></tr>';
            if (type === "smartphone") {
                $('#thDamage').text("ダメ");
                $('#thGuard').text("G");
                $('#thHit').text("H");
            } else {
                $('#thDamage').text("ダメージ");
                $('#thGuard').text("ガード");
                $('#thHit').text("ヒット");
            }
        };
        $(window).resize(function(){
            var win = $(window).width();
            var p = 786;
            if(win > p){
                toggleDesign("normal");
            } else {
                toggleDesign("smartphone");
            }
        });

        // require refactor
        var win = $(window).width();
        var p = 786;
        if(win > p){
            toggleDesign("normal");
        } else {
            toggleDesign("smartphone");
        }
    });

})();
