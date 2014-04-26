var enumDetections = [
    "上",
    "中",
    "下",
    "特殊",
    "ガ不",
    "投げ"
];

var socket;

$().ready(function () {
    socket = io.connect(location.href);

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
        console.log(this.value === "5");
        if (this.value === "5" || this.value === "4") {
            // 投げが選択された場合
            console.log("hoge");
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
        $("#charactor").val("");
        $("#name").val("");
        $("#detectionFlag").val("0");
        $("#detectionFlag").removeAttr("checked");
        $("#detectionSelectSet").attr("disabled", "disabled");
        $("button[value=eq]").trigger("click");
        $("#_guard_min").val("");
        $("#_guard_max").val("");
    });
    $("#search").click(function () {
        var charactor = $("#charactor").val(),
            name = $("#name").val(),
            detectionFlag = $("#detectionFlag").val(),
            detection = $("#detection").val(),
            frameType = $("#frameType").val(),
            guardMin = $("#_guard_min").val(),
            guardMax = $("#_guard_max").val(),
            searchType = "move",
            data = {where: {}};

        if (charactor !== "") {
            data.where.charactor = charactor;
        }
        if (name !== "") {
            data.where.name = {
                contains: name
            };
        }
        if (detectionFlag === "1") {
            if (detection !== "5") {
                data.where.lastDetection = enumDetections[detection];
            } else {
                // 投げ以外
                searchType = "throw";
            }
        }
        if (guardMin !== "" && detection !== "4" && detection !== "5") {
            if (frameType === "eq") {
                data.where._guard_max = guardMin;
                data.where._guard_min = guardMin;
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
        socket.request("/move/find", data, function (data) {
            setTableHeader(searchType);
            appendMoveRow(data);
        });
    });
    var setTableHeader = function (type) {
        var ths = $("thead tr").children();
        if (type === "move") {
            $(ths[7]).text("ガード");
            $(ths[7]).text("ヒット");
            $(ths[8]).text("CH");
        } else {
            $(ths[7]).text("抜け");
            $(ths[7]).text("抜け後");
            $(ths[8]).text("投げ後");
        }
    };
    var appendMoveRow = function (moves, type) {
        $("#moveList").empty();
        for (var i = 0; i < moves.length; i++) {
            var row = $("<tr />");
            var tdArray = [];
            tdArray.push("<td>" + moves[i].charactor + "</td>");
            tdArray.push("<td>" + moves[i].name + "</td>");
            tdArray.push("<td>" + moves[i].command + "</td>");
            tdArray.push("<td>" + moves[i].detection + "</td>");
            tdArray.push("<td>" + moves[i].damage + "</td>");
            tdArray.push("<td>" + moves[i].startup + "</td>");
            tdArray.push("<td>" + moves[i].guard + "</td>");
            tdArray.push("<td>" + moves[i].hit + "</td>");
            tdArray.push("<td>" + moves[i].ch + "</td>");
            row.append(tdArray);
            $("#moveList").append(row);
        }
    };
});
