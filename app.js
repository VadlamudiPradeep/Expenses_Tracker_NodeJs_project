"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var todos_1 = require("./routes/todos");
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].json());
app.use(todos_1["default"]);
app.listen(3000);
