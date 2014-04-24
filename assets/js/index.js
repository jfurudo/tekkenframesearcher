$().ready(function () {
    $("#detectionFlag").click(function () {
        if (this.value === "0") {
            this.value = 1;
            $("#detectionSelectSet").removeAttr("disabled");
        } else {
            this.value = 0;
            $("#detectionSelectSet").attr("disabled", "disabled");
        }
    });
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
            guardMax = $("#_guard_max").val();
        var data = {where: {}};
        if (charactor !== "") {
            data.where.charactor = charactor;
        }
        if (name !== "") {
            data.where.name = {
                contains: name
            };
        }
        if (detectionFlag === "1") {
            data.where.lastDetection = detection;
        }
        if (guardMin !== "") {
            if (frameType === "eq") {
                data.where._guard_max = guardMin;
                data.where._guard_min = guardMin;
            } else if (frameType === "gt") {
                data.where._guard_min = {
                    greaterThan: Number(guardMin) - 1
                };
            } else if (frameType === "lt") {
                data.where._guard_max = {
                    lessThan: Number(guardMin) + 1
                };
            }
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: "move/find",
            dataType: "json",
            data: data,
            success: function (data, dataType) {
                console.log(data);
                appendMoveRow(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error(errorThrown);
                console.log(textStatus);
            }
        });
    });
    var appendMoveRow = function (moves) {
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
