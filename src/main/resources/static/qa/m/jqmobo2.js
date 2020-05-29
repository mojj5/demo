var curField = null;
var relationHT = new Array();
var relationQs = new Object();
var relationNotDisplayQ = new Object();
function setCookie(b, d, a, f, c, e) {
	document.cookie = b + "=" + escape(d) + ((a) ? "; expires=" + a : "")
			+ ((f) ? "; path=" + f : "") + ((c) ? "; domain=" + c : "")
			+ ((e) ? "; secure" : "");
}
var spChars = [ "$", "}", "^", "|", "<" ];
var spToChars = [ "ξ", "｝", "ˆ", "¦", "&lt;" ];
function replace_specialChar(c) {
	for (var a = 0; a < spChars.length; a++) {
		var b = new RegExp("(\\" + spChars[a] + ")", "g");
		c = c.replace(b, spToChars[a]);
	}
	c = c.replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/ig,
			"");
	return $.trim(c);
}
String.prototype.format = function() {
	var a = arguments;
	return this.replace(/\{(\d+)\}/g, function(b, c) {
		return a[c];
	});
};
var curfilediv = null;
var isUploadingFile = false;
var cur_page = 0;
var hasSkipPage = false;
var prevControl = null;
var pageHolder = null;
var curMatrixFill = null;
var curMatrixError = null;
var imgVerify = null;
var questionsObject = new Object();
function setMatrixFill() {
	if (curMatrixError && !curMatrixFill.fillvalue) {
		return;
	}
	//$("#divMatrixRel").hide();
}
function setChoice(a) {
	$(a).prev("input").val(a.value);
}
function showMatrixFill(e, b) {
	if (b) {
		if (curMatrixError) {
			return;
		}
		curMatrixError = e;
	}
	curMatrixFill = e;
	if (e.holder) {
		$("#matrixinput").attr("placeholder", "请注明选择[" + e.holder + "]的原因...");
	}
	var d = e.fillvalue || "";
	$("#matrixinput").val(d);
	var a = $(e).attr("req");
	var f = $(e).offset();
	var c = f.top - $(e).height() - 15;
	$("#divMatrixRel").css("top", c + "px").css("left", "0").show();
}
function refresh_validate() {
	if (imgCode && tCode.style.display != "none"
			&& imgCode.style.display != "none") {
		imgCode.src = "/AntiSpamImageGen.aspx?q=" + activityId + "&t="
				+ (new Date()).valueOf();
	}
	if (submit_text) {
		submit_text.value = "";
	}
	if (imgVerify) {
		imgVerify.onclick();
	}
}
function processRadioInput(a, b) {
	if (a.prevRadio && a.prevRadio.itemText && a.prevRadio != b) {
		a.prevRadio.itemText.pvalue = a.prevRadio.itemText.value;
		a.prevRadio.itemText.value = "";
	}
	if (b.itemText && b != a.prevRadio) {
		b.itemText.value = b.itemText.pvalue || "";
	}
	a.prevRadio = b;
}
function addClearHref(b) {
	if (b.hasClearHref) {
		b.clearHref.style.display = "";
		return;
	}
	var a = document.createElement("a");
	a.title = validate_info_submit_title2;
	a.style.color = "#999999";
	a.style.marginLeft = "25px";
	a.innerHTML = "[" + type_radio_clear + "]";
	a.href = "javascript:void(0);";
	b.hasClearHref = true;
	$(".field-label", b).append(a);
	b.clearHref = a;
	a.onclick = function() {
		clearFieldValue(b);
		referTitle(b);
		this.style.display = "none";
		jumpAny(false, b);
	};
}
function referTitle(e, f) {
	if (!e[0]._titleTopic) {
		return;
	}
	var b = "";
	if (f == undefined) {
		$("input:checked", e).each(function(h) {
			var g = $(this).parent().next().html();
			if (b) {
				b += "&nbsp;";
			}
			b += g;
		});
	} else {
		b = f;
	}
	for (var c = 0; c < e[0]._titleTopic.length; c++) {
		var a = e[0]._titleTopic[c];
		var d = document.getElementById("spanTitleTopic" + a);
		if (d) {
			d.innerHTML = b;
		}
	}
}
$(function() {
	pageHolder = $("fieldset.fieldset");
	for (var s = 0; s < pageHolder.length; s++) {
		var w = $(pageHolder[s]).attr("skip") == "true";
		if (w) {
			pageHolder[s].skipPage = true;
			hasSkipPage = true;
		}
		var a = $(".field", pageHolder[s]);
		var p = 0;
		for (var t = 0; t < a.length; t++) {
			a[t].indexInPage = p;
			if (hasSkipPage) {
				a[t].pageParent = pageHolder[s];
			}
			p++;
		}
	}
	$("#divMatrixRel").bind("click", function(k) {
		k.stopPropagation();
	});
	$(document).bind("click", function() {
		setMatrixFill();
		postHeight();
	});
	$("#matrixinput").on("keyup blur focus", function() {
		if (curMatrixFill) {
			var k = $("#matrixinput").val();
			curMatrixFill.fillvalue = k;
		}
	});
	var b = false;
	var v = new Array();
	$(".field")
			.each(
					function() {
						var E = $(this);
						E.bind("click", function() {
							if (this.removeError) {
								this.removeError();
							}
							if (window.scrollup) {
								scrollup.Stop();
							}
						});
						var q = E.attr("type");
						var K = getTopic(E);
						questionsObject[K] = E;
						var B = E.attr("relation");
						if (B && B != "0") {
							var z = B.split(",");
							var O = z[0];
							var H = z[1].split(";");
							for (var C = 0; C < H.length; C++) {
								var A = O + "," + H[C];
								if (!relationHT[A]) {
									relationHT[A] = new Array();
								}
								relationHT[A].push(this);
							}
							if (!relationQs[O]) {
								relationQs[O] = new Array();
							}
							relationQs[O].push(this);
							relationNotDisplayQ[K] = "1";
						} else {
							if (B == "0") {
								relationNotDisplayQ[K] = "1";
							}
						}
						var F = E.attr("titletopic");
						if (F) {
							var M = questionsObject[F];
							if (M) {
								if (!M[0]._titleTopic) {
									M[0]._titleTopic = new Array();
								}
								M[0]._titleTopic.push(K);
								var D = E.find(".field-label")[0];
								if (D) {
									D.innerHTML = D.innerHTML
											.replace(
													"[q" + F + "]",
													"<span id='spanTitleTopic"
															+ K
															+ "' style='text-decoration:underline;'></span>");
								}
							}
						}
						if (E.attr("hrq") == "1") {
							return true;
						}
						if (q == "1") {
							var I = $("input", E);
							I.on("keyup blur click", function() {
								verifyTxt(E, I);
								window.hasAnswer = true;
								jump(E, this);
								referTitle(E, this.value);
							});
							I.focus(function() {
								$(this.parentNode).addClass("ui-focus");
							});
							I.blur(function() {
								$(this.parentNode).removeClass("ui-focus");
								checkOnly(E, I);
							});
							var G = $("textarea", E);
							if (G[0]) {
								var k = G.prev("a")[0];
								k.par = E[0];
								G[0].par = E[0];
								E[0].needsms = true;
								var N = G.parents("div").find(".phonemsg")[0];
								E[0].mobileinput = I[0];
								E[0].verifycodeinput = G[0];
								k.onclick = function() {
									if (this.disabled) {
										return;
									}
									var S = this.par;
									if (S.issmsvalid
											&& S.mobile == S.mobileinput.value) {
										return;
									}
									if (this.isSending) {
										return;
									}
									this.isSending = true;
									this.disabled = true;
									var R = "/Handler/AnswerSmsHandler.ashx?q="
											+ activityId + "&mob="
											+ escape(S.mobileinput.value)
											+ "&t=" + (new Date()).valueOf();
									$
											.ajax({
												type : "GET",
												url : R,
												async : false,
												success : function(U) {
													var V = "";
													if (U == "true") {
														V = "成功发送验证码，每天最多发送5次！";
													} else {
														if (U == "fast") {
															V = "发送频率过快";
														} else {
															if (U == "many") {
																V = "发送验证码次数过多";
															} else {
																if (U == "no") {
																	V = "发布者短信数量不够";
																} else {
																	if (U == "fail") {
																		V = "短信发送失败，每天最多发送5次！";
																	} else {
																		if (U == "error") {
																			V = "手机号码不正确";
																		} else {
																			if (U == "nopub") {
																				V = "问卷还未发布";
																			}
																		}
																	}
																}
															}
														}
													}
													N.innerHTML = V;
													this.isSending = false;
												}
											});
									var Q = this;
									var P = 60;
									var T = setInterval(function() {
										P--;
										if (P < 57) {
											Q.isSending = false;
										}
										if (P > 0) {
											Q.innerHTML = "重新发送(" + P + ")";
										} else {
											Q.innerHTML = "发送验证短信";
											Q.disabled = false;
											clearInterval(T);
										}
									}, 1000);
								};
								G[0].onchange = G[0].onblur = function() {
									var R = this.value;
									if (R.length != 6) {
										return;
									}
									if (!/^(\-)?\d+$/.exec(R)) {
										return;
									}
									var Q = this.par;
									if (Q.issmsvalid
											&& Q.mobile == Q.mobileinput.value) {
										return;
									}
									if (Q.prevcode == R) {
										return;
									}
									Q.prevcode = R;
									var P = "/Handler/AnswerSmsValidateHandler.ashx?q="
											+ activityId
											+ "&mob="
											+ escape(Q.mobileinput.value)
											+ "&code="
											+ escape(R)
											+ "&t="
											+ (new Date()).valueOf();
									$
											.ajax({
												type : "GET",
												url : P,
												async : false,
												success : function(S) {
													Q.issmsvalid = false;
													var T = "";
													if (S == "true") {
														Q.issmsvalid = true;
														Q.mobile = Q.mobileinput.value;
														T = "成功通过验证";
														writeError(Q, "", 1000);
													} else {
														if (S == "send") {
															T = "请先发送验证码，每天最多发送5次！";
														} else {
															if (S == "no") {
																T = "验证码输入错误超过5次，无法再提交";
															} else {
																if (S == "error") {
																	T = "验证码输入错误";
																}
															}
														}
													}
													N.innerHTML = T;
												}
											});
								};
							}
						} else {
							if (q == "2") {
								var I = $("textarea", E);
								I.on("keyup blur click", function() {
									verifyTxt(E, I);
									window.hasAnswer = true;
									jump(E, this);
									referTitle(E, this.value);
								});
								I.blur(function() {
									checkOnly(E, I);
								});
							} else {
								if (q == "9") {
									$("input", E).on("keyup blur", function() {
										var P = $(this);
										msg = verifyTxt(E, $(this), true);
										jump(E, this);
									});
								} else {
									if (q == "8") {
										$("input", E).change(function() {
											jump(E, this);
										});
									} else {
										if (q == "12") {
											$("input", E)
													.change(
															function() {
																var Q = null;
																var T = $(E)
																		.attr(
																				"total");
																var U = $(
																		"input:visible",
																		E);
																var R = count = U.length;
																var V = T;
																U
																		.each(function(
																				W) {
																			if (W == R - 1) {
																				Q = this;
																			}
																			if ($(
																					this)
																					.val()) {
																				count--;
																				V = V
																						- $(
																								this)
																								.val();
																			}
																		});
																if (count == 1
																		&& Q
																		&& V > 0) {
																	$(Q)
																			.val(
																					V)
																			.change();
																	V = 0;
																}
																msg = "";
																if (V != 0
																		&& count == 0) {
																	var S = parseInt($(
																			Q)
																			.val())
																			+ V;
																	if (S >= 0) {
																		if (Q != this) {
																			$(Q)
																					.val(
																							S)
																					.change();
																			V = 0;
																		} else {
																			if (U.length == 2) {
																				var P = T
																						- $(
																								Q)
																								.val();
																				$(
																						U[0])
																						.val(
																								P)
																						.change();
																				V = 0;
																			}
																		}
																	} else {
																		msg = "，<span style='color:red;'>"
																				+ sum_warn
																				+ "</span>";
																	}
																}
																if (V == 0) {
																	U
																			.each(function(
																					W) {
																				if (!$(
																						this)
																						.val()) {
																					$(
																							this)
																							.val(
																									"0")
																							.change();
																				}
																			});
																}
																$(".relsum", E)
																		.html(
																				sum_total
																						+ "<b>"
																						+ T
																						+ "</b>"
																						+ sum_left
																						+ "<span style='color:red;font-bold:true;'>"
																						+ (T - V)
																						+ "</span>"
																						+ msg);
																jump(E, this);
															});
										} else {
											if (q == "13") {
												b = true;
											} else {
												if (q == "3") {
													$("div.ui-radio", E)
															.bind(
																	"click",
																	function(S) {
																		var Q = $(this);
																		var R = Q
																				.find("input[type='radio']")[0];
																		if (R.disabled) {
																			return;
																		}
																		window.hasAnswer = true;
																		$(E)
																				.find(
																						"div.ui-radio")
																				.each(
																						function() {
																							var T = $(this);
																							T
																									.find("input[type='radio']")[0].checked = false;
																							T
																									.find(
																											"a.jqradio")
																									.removeClass(
																											"jqchecked");
																							T
																									.removeClass("focuschoice");
																						});
																		R.checked = true;
																		var P = Q
																				.find("input.OtherRadioText")[0];
																		if (P) {
																			R.itemText = P;
																		}
																		processRadioInput(
																				E[0],
																				R);
																		Q
																				.find(
																						"a.jqradio")
																				.addClass(
																						"jqchecked");
																		Q
																				.addClass("focuschoice");
																		displayRelationByType(
																				E,
																				"input[type=radio]",
																				1);
																		referTitle(E);
																		jump(E,
																				R);
																		if (E
																				.attr("req") != "1") {
																			addClearHref(E);
																		}
																		if (Q
																				.attr("desc") != 1) {
																			S
																					.preventDefault();
																		}
																	});
													var L = E.attr("qingjing");
													if (L) {
														v.push(E);
													}
													$("input.OtherRadioText")
															.bind(
																	"click",
																	function(T) {
																		$(this)
																				.parents(
																						"div.ui-controlgroup")
																				.find(
																						"div.ui-radio")
																				.each(
																						function() {
																							$(
																									this)
																									.find(
																											"input[type='radio']")[0].checked = false;
																							$(
																									this)
																									.find(
																											"a.jqradio")
																									.removeClass(
																											"jqchecked");
																						});
																		var P = $(
																				this)
																				.attr(
																						"rel");
																		var R = $("#"
																				+ P)[0];
																		R.checked = true;
																		var Q = $(
																				"#"
																						+ P)
																				.parents(
																						".ui-radio");
																		Q
																				.find(
																						"a.jqradio")
																				.addClass(
																						"jqchecked");
																		Q
																				.addClass("focuschoice");
																		R.itemText = this;
																		var S = $(
																				this)
																				.parents(
																						"div.field");
																		processRadioInput(
																				S[0],
																				R);
																		displayRelationByType(
																				S,
																				"input[type=radio]",
																				1);
																		jump(S,
																				R);
																		T
																				.stopPropagation();
																		T
																				.preventDefault();
																	});
												} else {
													if (q == "7") {
														$("select", E)
																.bind(
																		"change",
																		function(
																				Q) {
																			$(
																					this)
																					.parents(
																							".ui-select")
																					.find(
																							"span")
																					.html(
																							this.options[this.selectedIndex].text);
																			displayRelationByType(
																					E,
																					"option",
																					5);
																			jump(
																					E,
																					this.options[this.selectedIndex]);
																			var P = this.options[this.selectedIndex].text;
																			if (this.value == -2) {
																				P = "";
																			}
																			referTitle(
																					E,
																					P);
																			Q
																					.preventDefault();
																		});
													} else {
														if (q == "10") {
															var J = E
																	.attr("select") == "1";
															if (J) {
																$("select", E)
																		.bind(
																				"change",
																				function() {
																					$(
																							this)
																							.parents(
																									".ui-select")
																							.find(
																									"span")
																							.html(
																									this.options[this.selectedIndex].text);
																					jump(
																							E,
																							this);
																				});
															}
															$("input", E)
																	.bind(
																			"change blur",
																			function() {
																				var U = $(this);
																				var T = U
																						.val();
																				var Q = U
																						.attr("isdigit");
																				var S = Q == "1"
																						|| Q == "2";
																				if (S) {
																					if (Q == "1"
																							&& parseInt(T) != T) {
																						U
																								.val("");
																					} else {
																						if (Q == "2"
																								&& parseFloat(T) != T) {
																							U
																									.val("");
																						} else {
																							var R = U
																									.attr("min");
																							if (R
																									&& T
																											- R < 0) {
																								U
																										.val("");
																							}
																							var P = U
																									.attr("max");
																							if (P
																									&& T
																											- P > 0) {
																								U
																										.val("");
																							}
																						}
																					}
																				} else {
																					msg = verifyTxt(
																							E,
																							$(this),
																							true);
																				}
																				jump(
																						E,
																						this);
																			});
														} else {
															if (q == "5") {
																initRate(E);
																$("a.rate-off",
																		E)
																		.bind(
																				"click",
																				function() {
																					displayRelationByType(
																							E,
																							"a.rate-off",
																							4);
																					jump(
																							E,
																							this);
																				});
															} else {
																if (q == "6") {
																	initRate(E);
																	$(
																			"a.rate-off",
																			E)
																			.bind(
																					"click",
																					function() {
																						jump(
																								E,
																								this);
																						if (E
																								.attr("req") != "1") {
																							addClearHref(E);
																						}
																					});
																} else {
																	if (q == "4") {
																		$(
																				"div.ui-checkbox",
																				E)
																				.bind(
																						"click",
																						function(
																								R) {
																							var S = $(this);
																							var Q = S
																									.find("input[type='checkbox']")[0];
																							if (Q.disabled) {
																								return;
																							}
																							Q.checked = !Q.checked;
																							window.hasAnswer = true;
																							if (Q.checked) {
																								S
																										.find(
																												"a.jqcheck")
																										.addClass(
																												"jqchecked");
																								S
																										.addClass("focuschoice");
																							} else {
																								S
																										.find(
																												"a.jqcheck")
																										.removeClass(
																												"jqchecked");
																								S
																										.removeClass("focuschoice");
																							}
																							checkHuChi(
																									E,
																									this);
																							displayRelationByType(
																									E,
																									"input[type='checkbox']",
																									2);
																							verifyCheckMinMax(
																									E,
																									false,
																									false,
																									this);
																							jump(
																									E,
																									Q);
																							if (window.createItem) {
																								createItem(E);
																							}
																							var P = S
																									.find("input.OtherText")[0];
																							if (P) {
																								if (!Q.checked) {
																									P.pvalue = P.value;
																									P.value = "";
																								} else {
																									P.value = P.pvalue
																											|| "";
																								}
																							}
																							referTitle(E);
																							R
																									.preventDefault();
																						});
																		$(
																				"input.OtherText",
																				E)
																				.bind(
																						"click",
																						function(
																								T) {
																							var P = $(
																									this)
																									.attr(
																											"rel");
																							var Q = $("#"
																									+ P)[0];
																							Q.checked = true;
																							Q.itemText = this;
																							var R = $(
																									"#"
																											+ P)
																									.parents(
																											".ui-checkbox");
																							R
																									.find(
																											"a.jqcheck")
																									.addClass(
																											"jqchecked");
																							R
																									.addClass("focuschoice");
																							if (this.pvalue
																									&& !this.value) {
																								this.value = this.pvalue;
																							}
																							var S = $(
																									this)
																									.parents(
																											"div.field");
																							checkHuChi(
																									S,
																									R[0]);
																							displayRelationByType(
																									S,
																									"input[type=checkbox]",
																									2);
																							jump(
																									S,
																									Q);
																							verifyCheckMinMax(
																									S,
																									false);
																							if (window.createItem) {
																								createItem(S);
																							}
																							T
																									.stopPropagation();
																							T
																									.preventDefault();
																						});
																	} else {
																		if (q == "21") {
																			$(
																					".shop-item",
																					E)
																					.each(
																							function() {
																								var P = $(
																										".itemnum",
																										this);
																								var Q = $(
																										".item_left",
																										this);
																								$(
																										".add",
																										this)
																										.bind(
																												"click",
																												function(
																														S) {
																													var V = false;
																													var R = 0;
																													if (Q[0]) {
																														V = true;
																														R = parseInt(Q
																																.attr("num"));
																													}
																													var U = parseInt(P
																															.val());
																													if (V
																															&& U >= R) {
																														var T = "库存只剩"
																																+ R
																																+ "件，不能再增加！";
																														if (R <= 0) {
																															T = "已售完，无法添加";
																														}
																														alert(T);
																													} else {
																														P
																																.val(U + 1);
																														updateCart();
																													}
																													S
																															.preventDefault();
																												});
																								P
																										.bind(
																												"focus",
																												function(
																														R) {
																													if (P
																															.val() == "0") {
																														P
																																.val("");
																													}
																												});
																								P
																										.bind(
																												"blur change",
																												function(
																														T) {
																													if (!P
																															.val()) {
																														P
																																.val("0");
																													}
																													var W = parseInt(P
																															.val());
																													if (!W
																															|| W < 0) {
																														P
																																.val("0");
																														updateCart();
																														return;
																													}
																													var V = false;
																													var S = 0;
																													if (Q[0]) {
																														V = true;
																														S = parseInt(Q
																																.attr("num"));
																													}
																													if (V) {
																														if (W > S) {
																															var U = "库存只剩"
																																	+ S
																																	+ "件，不能超过库存！";
																															if (S <= 0) {
																																U = "已售完，无法添加";
																															}
																															alert(U);
																															var R = S;
																															if (R < 0) {
																																R = 0;
																															}
																															P
																																	.val(R);
																														}
																													}
																													updateCart();
																													T
																															.preventDefault();
																												});
																								$(
																										".remove",
																										this)
																										.bind(
																												"click",
																												function(
																														R) {
																													var S = parseInt(P
																															.val());
																													if (S > 0) {
																														P
																																.val(S - 1);
																														updateCart();
																													}
																													R
																															.preventDefault();
																												});
																							});
																		} else {
																			if (q == "11") {
																				$(
																						"li.ui-li-static",
																						E)
																						.bind(
																								"click",
																								function(
																										Q) {
																									if (!$(
																											this)
																											.attr(
																													"check")) {
																										var P = $(
																												this)
																												.parents(
																														"ul.ui-listview")
																												.find(
																														"li[check='1']").length + 1;
																										$(
																												this)
																												.find(
																														"span.sortnum")
																												.html(
																														P)
																												.addClass(
																														"sortnum-sel");
																										$(
																												this)
																												.attr(
																														"check",
																														"1");
																									} else {
																										var P = $(
																												this)
																												.find(
																														"span")
																												.html();
																										$(
																												this)
																												.parents(
																														"ul.ui-listview")
																												.find(
																														"li[check='1']")
																												.each(
																														function() {
																															var R = $(
																																	this)
																																	.find(
																																			"span.sortnum")
																																	.html();
																															if (R
																																	- P > 0) {
																																$(
																																		this)
																																		.find(
																																				"span.sortnum")
																																		.html(
																																				R - 1);
																															}
																														});
																										$(
																												this)
																												.find(
																														"span.sortnum")
																												.html(
																														"")
																												.removeClass(
																														"sortnum-sel");
																										$(
																												this)
																												.attr(
																														"check",
																														"");
																									}
																									displayRelationByType(
																											E,
																											"li.ui-li-static",
																											3);
																									verifyCheckMinMax(
																											E,
																											false,
																											true,
																											this);
																									jump(
																											E,
																											this);
																									if (window.createItem) {
																										createItem(
																												E,
																												true);
																									}
																									Q
																											.preventDefault();
																								});
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					});
	if (window.totalCut && window.totalCut > 0) {
		for (var t = 0; t < window.totalCut; t++) {
			var f = "divCut" + (t + 1);
			var x = $("#" + f);
			var h = x.attr("relation");
			if (h && h != "0") {
				var d = h.split(",");
				var y = d[0];
				var n = d[1].split(";");
				for (var l = 0; l < n.length; l++) {
					var e = y + "," + n[l];
					if (!relationHT[e]) {
						relationHT[e] = new Array();
					}
					relationHT[e].push(x[0]);
				}
				if (!relationQs[y]) {
					relationQs[y] = new Array();
				}
				relationQs[y].push(x[0]);
			}
		}
	}
	for (var g = 0; g < v.length; g++) {
		var m = v[g];
		displayRelationByType(m, "input[type=radio]", 1);
	}
	
	$("#ctlNext") != null && $("#ctlNext").on("click",function() {
		if (this.disabled) {
			return;
		}
		if (window.divTip) {
			alert(divTip.innerHTML);
			return;
		}
		$("#action").val("1");
		var k = validate();
		
		//检查输入框内容属否输入
		var channel = $("#channel").val().replace(/^\s*|\s*$/g, "");
		var serverId = $("#serverId").val().replace(/^\s*|\s*$/g, "");
		var roleName = $("#roleName").val().replace(/^\s*|\s*$/g, "");
		var is_check = true;
		if(channel == "" || serverId == "" || roleName == ""){
			is_check = false;
			$("#divMatrixRel").css("border","2px solid rgb(255, 153, 0)")
			$("#other_").html("文本框内容必须填写！")
		}
		if (!k || !is_check) {
			return;
		}
		groupAnswer(1);
	});
	
	
	setVerifyCode();
	initSlider();
	if (totalPage > 1) {
		$("#divSubmit").hide();
		$("#divNext")[0].style.display = "";
		showProgress();
	} else {
		$("#divSubmit").show();
	}
	if (window.hasPageTime) {
		if (!window.divFengMian) {
			processMinMax();
		}
	}
	fixBottom();
	$(window).load(function() {
		fixBottom();
	});
	if (window.cepingCandidate) {
		var o = cepingCandidate.split(",");
		var r = new Object();
		for (var u = 0; u < o.length; u++) {
			var c = o[u].replace(/(\s*)/g, "").replace(/&/g, "");
			r[c] = "1";
		}
		var j = $("#div1");
		$("input[type=checkbox]", j).each(function() {
			var z = $(this).parents(".ui-checkbox");
			var q = z.find("label")[0];
			if (!q) {
				return true;
			}
			var k = q.innerHTML;
			k = k.replace(/(\s*)/g, "").replace(/&amp;/g, "");
			if (r[k]) {
				z.trigger("click");
			}
		});
		j[0].style.display = "none";
		j[0].isCepingQ = "1";
	}
});
function hideAward() {
	if (!confirm("确认不再领取吗？")) {
		return;
	}
	if (window.localStorage) {
		vkey = "award_" + activityId;
		localStorage.removeItem(vkey);
		localStorage.removeItem(vkey + "name");
		localStorage.removeItem(vkey + "tip");
	}
	$("#divContent").show().prev().hide();
	initSlider();
}
function postHeight() {
	if (window == window.top) {
		return;
	}
	try {
		var c = parent.postMessage ? parent
				: parent.document.postMessage ? parent.document : null;
		if (c != null) {
			var a = $("body").height();
			return c.postMessage("heightChanged," + a, "*");
		}
	} catch (b) {
	}
}
function initRate(a) {
	$("a.rate-off", a).bind("click", function(k) {
		var n = $(this).parents("div.field");
		var b = $(n).attr("ischeck");
		if (b) {
			var h = true;
			var m = $(a).attr("maxvalue");
			if (m && !$(this).hasClass("rate-on")) {
				var l = $("a.rate-on", $(this).parents("tr"));
				if (m - l.length <= 0) {
					h = false;
				}
			}
			if (h) {
				$(this).toggleClass("rate-on");
				$(this).trigger("change");
			}
		} else {
			$(this).parents("tr").find("a.rate-off").removeClass("rate-on");
			$(this).toggleClass("rate-on");
			$(this).trigger("change");
		}
		if ($(this).hasClass("rate-on")) {
			var j = $(this).attr("needfill");
			if (j) {
				if (!this.holder) {
					var g = $(".matrix-rating tr", n)[0];
					var c = $("th", $(g));
					var f = $(this).attr("dval");
					if (f && c[f - 1]) {
						this.holder = $(c[f - 1]).html();
					}
				}
				showMatrixFill(this);
				k.stopPropagation();
			}
		}
		$("span.error", $(n)).is(":visible") && validateQ(n);
		k.preventDefault();
	});
}
function updateCart() {
	var d = $("#divQuestion");
	var b = "";
	var c = 0;
	var a = 0;
	$(".shop-item", d)
			.each(
					function() {
						var f = $(".itemnum", this);
						var j = parseInt(f.val());
						if (j == 0) {
							return true;
						}
						var k = $(".item_name", this).html();
						var g = $(".item_price", this).attr("price");
						var h = j * parseFloat(g).toFixed(2);
						var e = '<li class="productitem"><span class="fpname">'
								+ k + '</span><span class="fpnum">' + j
								+ '</span><span class="fpprice">￥' + h
								+ "</span></li>";
						b += e;
						c += h;
						a += j;
					});
	b = "<ul class='productslist'>"
			+ b
			+ '<li class="productitem"><span class="fpname"></span><span class="fpnum" style="font-weight:bold;">'
			+ a + '</span><span class="fpprice" style="font-weight:bold;">￥'
			+ c.toFixed(2) + "</span></li></ul>";
	$("#shopcart").html(b);
	if (c > 0) {
		$("#shopcart").show();
	} else {
		$("#shopcart").hide();
	}
}
function setVerifyCode() {
	if (tCode && tCode.style.display != "none") {
		submit_text.value = validate_info_submit_title3;
		submit_text.onblur = function() {
			if (submit_text.value == "") {
				submit_text.value = validate_info_submit_title3;
			}
		};
		submit_text.onfocus = function() {
			if (submit_text.value == validate_info_submit_title3) {
				submit_text.value = "";
			}
		};
		imgCode.style.display = "none";
		if (window.isDianChu) {
			tCode.style.display = "none";
			return;
		}
		submit_text.onclick = function() {
			if (!needAvoidCrack && imgCode.style.display == "none") {
				imgCode.style.display = "";
				imgCode.onclick = refresh_validate;
				imgCode.onclick();
				imgCode.title = validate_info_submit_title1;
			} else {
				if (needAvoidCrack && !imgVerify) {
					var c = $("#divCaptcha")[0];
					c.style.display = "";
					imgVerify = c.getElementsByTagName("img")[0];
					imgVerify.style.cursor = "pointer";
					imgVerify.onclick = function() {
						var h = new Date();
						var e = h.getTime() + (h.getTimezoneOffset() * 60000);
						var f = window.location.host || "www.sojump.com";
						var g = "//" + f + "/BotDetectCaptcha.ashx?activity="
								+ activityId + "&get=image&c=" + this.captchaId
								+ "&t=" + this.instanceId + "&d=" + e;
						this.src = g;
					};
					var a = imgVerify.getAttribute("captchaid");
					var b = imgVerify.getAttribute("instanceid");
					imgVerify.captchaId = a;
					imgVerify.instanceId = b;
					imgVerify.onclick();
				}
			}
		};
	}
}
function fixBottom() {
	postHeight();
	var a = $("body").height() - $(window).height();
	if (a < 0) {
		$(".logofooter").addClass("fixedbottom");
	} else {
		$(".logofooter").removeClass("fixedbottom");
	}
}
var firstError = null;
var firstMatrixError = null;
var needSubmitNotValid = false;
function validate() {
	var b = true;
	firstError = null;
	firstMatrixError = null;
	curMatrixError = null;
	$(".field:visible").each(function() {
		var e = pageHolder[cur_page].hasExceedTime;
		if (e) {
			return true;
		}
		var d = $(this), a = validateQ(d);
		if (!a) {
			b = false;
		}
	});
	if (!b) {
		if (firstError) {
			$("html, body").animate({
				scrollTop : $(firstError).offset().top
			}, 600);
			$(".scrolltop").show();
			$(".scrolltop").click(function() {
				$("html, body").animate({
					scrollTop : $(document).height()
				}, 600);
				$(".scrolltop").hide();
			});
		}
	} else {
	}
	return b;
}
var txtCurCity = null;
function openCityBox(f, e, c, g) {
	txtCurCity = f;
	var d = "";
	g = g || "";
	if (e == 3) {
		var a = f.getAttribute("province");
		var b = "";
		if (a) {
			b = "&pv=" + encodeURIComponent(a);
		}
		d = "/wjx/design/setcitycountymobo2.aspx?activityid=" + activityId
				+ "&ct=" + e + b + "&pos=" + g;
	} else {
		if (e == 5) {
			d = "/wjx/design/setmenusel.aspx?activityid=" + activityId + "&ct="
					+ e + "&pos=" + g;
		} else {
			if (e == 6) {
				d = "/wjx/join/amap.aspx?activityid=" + activityId + "&ct=" + e
						+ "&pos=" + g;
			} else {
				d = "/wjx/design/setcitymobo2.aspx?activityid=" + activityId
						+ "&ct=" + e + "&pos=" + g;
			}
		}
	}
	openDialogByIframe(400, 400, d);
}
function setCityBox(a) {
	txtCurCity.value = a;
	$("#yz_popTanChuClose").click();
}
var startAge = 0;
var endAge = 0;
var rName = "";
function getRname(c, b) {
	if (rName) {
		return;
	}
	if (c != "1") {
		return;
	}
	var d = $("div.field-label", b).html();
	if (d.indexOf("姓名") == -1) {
		return;
	}
	rName = $("input:text", b).val();
}
function getAge(c, b) {
	if (c != "3" && c != "7") {
		return;
	}
	var h = $("div.field-label", b).html();
	if (h.indexOf("年龄") == -1) {
		return;
	}
	var e = "";
	var g = 0;
	if (c == 3) {
		$("input[type='radio']", b).each(function(a) {
			if (this.checked) {
				e = $(this).parents("div.ui-radio").find("label").html();
				g = a;
				return false;
			}
		});
	} else {
		if (c == 7) {
			var d = $("select", b)[0];
			e = d.options[d.selectedIndex].text;
			g = d.selectedIndex - 1;
		}
	}
	if (!e) {
		return;
	}
	var f = /[1-9][0-9]*/g;
	var j = e.match(f);
	if (!j || j.length == 0) {
		return;
	}
	if (j.length > 2) {
		return;
	}
	if (j.length == 2) {
		startAge = j[0];
		endAge = j[1];
	} else {
		if (j.length == 1) {
			if (g == 0) {
				endAge = j[0];
			} else {
				startAge = j[0];
			}
		}
	}
}

//用户提交答案处理
function groupAnswer(l) {
	var f = new Array();
	var k = 0;
	$(".field").each(function() {
		var u = $(this);
		var C = new Object();
		var z = u.attr("type");
		var v = this.style.display != "none";
		if (v && hasSkipPage) {
			if (this.pageParent && this.pageParent.skipPage) {
				v = false;
			}
		}
		if (this.isCepingQ) {
			v = true;
		}
		C._value = "";
		C._topic = getTopic(u);
		f[k++] = C;
		try {
			getAge(z, u);
			getRname(z, u);
		} catch (x) {
		}
		var A = 0;
		switch (z) {
			//单选题
			case "3":
				if (!v) {
					C._value = "-3";
					if (u.attr("hrq") == "1") {
						C._value = "-4";
					}
					break;
				}
				$("input[type='radio']:checked", u).each(function(E) {
						C._value = $(this).val();
						var D = $(this).attr("rel");
						if (D && $("#" + D).val().length > 0) {
							C._value += spChars[2] + replace_specialChar($("#" + D).val().substring(0,3000));
						}
						return false;
					});
				break;

			//多选题
			case "4":
				if (!v) {
					C._value = "-3";
					if (u.attr("hrq") == "1") {
						C._value = "-4";
					}
					break;
				}
				var y = 0;
				$("input:checked", u).each(function() {
					var E = $(this).parents(".ui-checkbox")[0].style.display == "none";
					if (!E) {
						if (y > 0) {
							C._value += spChars[3];
						}
						C._value += $(this).val();
						var D = $(this).attr("rel");
						if (D && $("#" + D).val().length > 0) {
							C._value += spChars[2] + replace_specialChar($("#" + D).val().substring(0,3000));
						}
						y++;
					}
				});
				if (y == 0) {
					C._value = "-2";
				}
				break;
		}
	});
	
	if (f.length == 0) {
		alert("提示：此问卷没有添加题目，不能提交！");
		return;
	}
	
	f.sort(function(r, e) {
		return r._topic - e._topic;
	});
	
	var p = "";
	for (i = 0; i < f.length; i++) {
		if (i > 0) {
			p += spChars[1];
		}
		p += f[i]._topic;
		p += spChars[0];
		p += f[i]._value;
	}
	
	var j = $("#form1").attr("action");
	var g = j;
	if (window.sourceurl) {
		g += "&source=" + encodeURIComponent(sourceurl);
	} else {
		g += "&source=directphone";
	}
	if (l) {
		g += "&submittype=" + l;
	}
	if (window.rndnum) {
		g += "&rn=" + encodeURIComponent(rndnum);
	}
	g += "&t=" + new Date().valueOf();
	$("#ctlNext").hide();
	var q = "处理中......";
	if (langVer == 1) {
		q = "Submiting......";
	}
	$(".ValError").html(q);
	var channel = $("#channel").val().replace(/^\s*|\s*$/g, "");
	var serverId = $("#serverId").val().replace(/^\s*|\s*$/g, "");
	var roleName = $("#roleName").val().replace(/^\s*|\s*$/g, "");
	var phone = $("#phone").val().replace(/^\s*|\s*$/g, "");
	var email = $("#email").val().replace(/^\s*|\s*$/g, "");
	var qq = $("#qq").val().replace(/^\s*|\s*$/g, "");
	var m = {
		submitdata : p,
		channel : channel,
		serverId : serverId,
		roleName : roleName,
		phone : phone,
		email : email,
		qq : qq
	};
	var h = false;
	var b = window.getMaxWidth || 1800;
	var a = encodeURIComponent(p);
	if (window.submitWithGet && a.length <= b) {
		h = true;
	}
	if (h) {
		g += "&submitdata=" + a;
		g += "&useget=1";
	} else {
		if (window.submitWithGet) {
			window.postIframe = 1;
		}
	}
	if (window.postIframe) {
		postWithIframe(g, p);
	} else {
		if (h) {
			$.ajax({
				type : "GET",
				url : g,
				success : function(e) {
					afterSubmit(e, l);
				},
				error : function() {
					$(".ValError").html("很抱歉，网络连接异常，请重新尝试提交！");
					$("#ctlNext").show();
					return;
				}
			});
		} else {
			$.ajax({
				type : "POST",
				url : g,
				data : m,
				dataType : "text",
				success : function(e) {
					afterSubmit(e, l);
				}
			});
		}
	}
}



function postWithIframe(b, c) {
	var a = document.createElement("div");
	a.style.display = "none";
	a.innerHTML = "<iframe id='mainframe' name='mainframe' style='display:none;' > </iframe><form target='mainframe' data-ajax='false' id='frameform' action='' method='post' enctype='application/x-www-form-urlencoded'><input  value='' id='submitdata' name='submitdata' type='hidden'><input type='submit' value='提交' ></form>";
	document.body.appendChild(a);
	document.getElementById("submitdata").value = c;
	var d = document.getElementById("frameform");
	d.action = b + "&iframe=1";
	d.submit();
}
var havereturn = false;
var timeoutTimer = null;
function processError(c, b, a) {
	if (!havereturn) {
		havereturn = true;
		$(".ValError").html("提交超时，请检查网络是否异常！");
		$("#ctlNext").show();
	}
	if (timeoutTimer) {
		clearTimeout(timeoutTimer);
	}
}
var nvvv = 0;
function afterSubmit(t, l) {
	$(".ValError").html("");
	havereturn = true;
	var n = t.split("〒");
	var h = n[0];

	var b = n[1] || t;
	if(b == 1){
		alert("问卷提交成功，感谢您的参与！")
		location = location;
	}else if(b == 2){
		alert("同一IP只能参与一次此问卷调查！")
	}else{
		alert("提交失败，请检查网络是否异常！")
	}
	$("#ctlNext").show();
}

function clearFieldValue(c) {
	var d = $(c).attr("type");
	if (d == "3") {
		$("input[type='radio']:checked", $(c)).each(
				function() {
					this.checked = false;
					$(this).parents(".ui-radio").find("a.jqradio").removeClass(
							"jqchecked");
				});
		$("input.OtherRadioText", $(c)).each(function() {
			$(this).val("").blur();
		});
	} else {
		if (d == "4") {
			$("input:checked", $(c)).each(
					function() {
						this.checked = false;
						$(this).parents(".ui-checkbox").find("a.jqcheck")
								.removeClass("jqchecked");
					});
		} else {
			if (d == "6") {
				$("a.rate-off", $(c)).each(function() {
					$(this).removeClass("rate-on");
				});
			} else {
				if (d == "5") {
					$("a.rate-off", $(c)).each(function() {
						$(this).removeClass("rate-on");
					});
				} else {
					if (d == "7") {
						if ($("select", $(c)).val() != "-2") {
							$("select", $(c)).val("-2").trigger("change");
						}
					} else {
						if (d == "8") {
							$("input", $(c)).val("").change();
						} else {
							if (d == "9") {
								$("input.ui-slider-input", $(c)).each(
										function() {
											$(this).val("").change();
										});
							} else {
								if (d == "11") {
									$("li.ui-li-static", $(c)).each(
											function() {
												$(this).find("span.sortnum")
														.html("").removeClass(
																"sortnum-sel");
												$(this).attr("check", "");
											});
								}
							}
						}
					}
				}
			}
		}
	}
}
function validateQ(o) {
	var g = $(o).attr("req"), l = $(o).attr("type"), n = true;
	var k = $(o)[0];
	var f = "";
	var e = $(o).attr("hasjump");

	if (l == "3") {
		n = false;
		$(o).find("input:checked").each(function() {
			n = true;
			if (this.getAttribute("jumpto") == -1) {
				needSubmitNotValid = true;
			}
			var a = $(this).attr("rel");
			if (a) {
				var b = $("#" + a);
				if (b.attr("required") && b.val().length == 0) {
					f = "文本框内容必须填写！";
					writeError(o, f, 3000);
					return false;
				}
			}
		});
	} else {
		if (l == "4") {
			n = false;
			var p = false;
			$(o).find("input:checked").each(function() {
				n = true;
				var a = $(this).attr("rel");
				if (a) {
					var b = $("#" + a);
					if (b.attr("required") && b.val().length == 0) {
						f = "文本框内容必须填写！";
						b.focus();
						writeError(o, f, 3000);
						p = true;
						return false;
					}
				}
			});
			if (!p) {
				f = verifyCheckMinMax($(o), true);
			}
		}
	}
	if (!n && g == "1") {
		f = "此题是必答题";
		if (l == "6" && $(o)[0].isMatrixFillError) {
			f = "请注明原因";
		}
		if (langVer == 1) {
			f = "required";
		}
		writeError(o, f, 1000);
	} else {
		$("span.error", $(o)).hide();
		$("div.field-label", $(o)).css("background", "");
	}
	if (f) {
		return false;
	}
	if (k.removeError) {
		k.removeError();
	}
	return true;
}
function show_prev_page() {
	if (cur_page > 0 && pageHolder[cur_page - 1].hasExceedTime) {
		alert("上一页填写超时，不能返回上一页");
		return;
	}
	var e = $("#divNext")[0];
	var h = $("#divPrev")[0];
	pageHolder[cur_page].style.display = "none";
	e.style.display = "";
	$("#divSubmit").hide();
	cur_page--;
	for (var c = cur_page; c >= 0; c--) {
		if (pageHolder[c].skipPage) {
			cur_page--;
		} else {
			break;
		}
	}
	var g = window.isKaoShi;
	for (var c = cur_page; c >= 0; c--) {
		var a = $(".field", pageHolder[c]);
		if (a.length == 0 && !g) {
			break;
		}
		var f = false;
		for (var b = 0; b < a.length; b++) {
			var d = a[b];
			if (d.style.display != "none") {
				f = true;
				break;
			}
		}
		if (!f && cur_page > 0) {
			cur_page--;
		} else {
			break;
		}
	}
	if (cur_page == 0) {
		h.style.display = "none";
	}
	pageHolder[cur_page].style.display = "";
	pageHolder[cur_page].scrollIntoView();
	showProgress();
}

function to_next_page() {
	var k = $("#divNext")[0];
	var b = $("#divPrev")[0];
	b.style.display = displayPrevPage;
	pageHolder[cur_page].style.display = "none";
	cur_page++;
	if (cur_page == 1) {
		$("#divDesc").hide();
	}
	for (var g = cur_page; g < pageHolder.length; g++) {
		if (pageHolder[g].skipPage) {
			cur_page++;
		} else {
			break;
		}
	}
	var m = false;
	var c = window.isKaoShi;
	for (var g = cur_page; g < pageHolder.length; g++) {
		var l = $(".field", pageHolder[g]);
		if (l.length == 0 && !m && !c) {
			break;
		}
		var f = false;
		for (var d = 0; d < l.length; d++) {
			var a = l[d];
			if (a.style.display != "none") {
				f = true;
				break;
			}
		}
		if (!f && cur_page < pageHolder.length - 1) {
			cur_page++;
			m = true;
		} else {
			break;
		}
	}
	var e = true;
	for (var g = cur_page + 1; g < pageHolder.length; g++) {
		if (!pageHolder[g].skipPage) {
			e = false;
		}
	}
	if (cur_page >= pageHolder.length - 1 || e) {
		k.style.display = "none";
		$("#divSubmit").show();
	}
	if (cur_page < pageHolder.length - 1) {
		k.style.display = "";
	}
	pageHolder[cur_page].style.display = "";
	initSlider();
	var h = document.getElementById("divMaxTime");
	if (h && h.style.display == "") {
		$("body,html").animate({
			scrollTop : 0
		}, 100);
	} else {
		pageHolder[cur_page].scrollIntoView();
	}
	showProgress();
	if (window.hasPageTime) {
		processMinMax();
	}
	fixBottom();
}
function initSlider() {
	if (window.hasSlider) {
		$(".field", pageHolder[cur_page]).each(function() {
			var b = $(this);
			var a = b.attr("type");
			if (a == "8" || a == "12" || a == "9" || a == "10") {
				setTimeout(function() {
					var c = $("input.ui-slider-input:visible", b);
					c.rangeslider({
						polyfill : false
					});
				}, 10);
			}
		});
	}
}
function initqSlider(a) {
	if (!window.hasSlider) {
		return;
	}
	if (a.hasInitSlider) {
		return;
	}
	a.hasInitSlider = true;
	var b = $("input.ui-slider-input:visible", a);
	b.rangeslider({
		polyfill : false
	});
}
function showProgress() {
	if (totalPage == 1) {
		return;
	}
	var c = cur_page + 1;
	if (c > totalPage) {
		c = totalPage;
	}
	var b = c + "/" + totalPage;
	$(".pagepercent").html(b + "页");
	var a = c * 100 / totalPage;
	$(".pagebar").width(a + "%");
}
function verifyCheckMinMax(a, c, k, e) {
	var d = a.attr("minvalue");
	var h = a.attr("maxvalue");
	var g = a[0];
	if (d == 0 && h == 0) {
		return "";
	}
	var f = 0;
	if (k) {
		f = $("li.ui-li-static[check='1']", a).length;
	} else {
		f = $("input:checked", a).length;
	}
	if (f == 0 && !a.attr("req")) {
		return;
	}
	var b = "";
	if (langVer == 0) {
		b = "&nbsp;&nbsp;&nbsp;您已经选择了" + f + "项";
	}
	var j = true;
	if (h > 0 && f > h) {
		if (e) {
			if (langVer == 0) {
				alert("此题最多只能选择" + h + "项");
			}
			$(e).trigger("click");
			return "";
		}
		if (langVer == 0) {
			b += ",<span style='color:red;'>多选择了" + (f - h) + "项</span>";
		} else {
			b = validate_info + validate_info_check4 + h + type_check_limit5;
		}
		j = false;
	} else {
		if (d > 0 && f < d) {
			if (langVer == 0) {
				b += ",<span style='color:red;'>少选择了" + (d - f) + "项</span>";
			} else {
				b = validate_info + validate_info_check5 + d
						+ type_check_limit5;
			}
			j = false;
			if (!k
					&& f == 1
					&& $("input:checked", a).parents(".ui-checkbox").hasClass(
							"huchi")) {
				j = true;
			}
		}
	}
	if (!g.errorMessage) {
		g.errorMessage = $(".errorMessage", a)[0];
	}
	if (!j) {
		if (!c) {
			g.errorMessage.innerHTML = b;
		} else {
			writeError(a[0], b, 3000);
		}
		return b;
	} else {
		g.errorMessage.innerHTML = "";
	}
	return "";
}
function checkOnly(c, e) {
	var d = $(e).attr("needonly");
	if (!d) {
		return;
	}
	var g = $(e).val();
	if (!g) {
		return;
	}
	if (g.length > 50) {
		return;
	}
	var b = "/Handler/AnswerOnlyHandler.ashx?q=" + activityId + "&at=" + g
			+ "&qI=" + getTopic(c) + "&o=true&t=" + (new Date()).valueOf();
	var a = $(c)[0];
	var f = "";
	if (!e.errorOnly) {
		e.errorOnly = new Object();
	}
	if (e.errorOnly[g]) {
		f = validate_only;
		if (a.verifycodeinput) {
			a.verifycodeinput.parentNode.style.display = "none";
		}
		writeError(a, f, 3000);
		return;
	}
	$.ajax({
		type : "GET",
		url : b,
		async : false,
		success : function(h) {
			if (h == "false1") {
				f = validate_only;
				e.errorOnly[g] = 1;
				if (a.verifycodeinput) {
					a.verifycodeinput.parentNode.style.display = "none";
				}
				writeError(a, f, 3000);
			}
		}
	});
}
function verifyTxt(a, e, d) {
	var c = $(e).val();
	var h = $(e).attr("verify");
	var j = $(e).attr("minword");
	var f = $(e).attr("maxword");
	var g = $(a)[0];
	var b = "";
	if (!c) {
		return b;
	}
	if (g.removeError) {
		g.removeError();
	}
	b = verifyMinMax(c, h, j, f);
	if (!b) {
		b = verifydata(c, h);
	}
	if (b) {
		if (!g.errorControl && d) {
			g.errorControl = $(e)[0];
		}
		writeError(g, b, 3000);
		return b;
	}
	if (!b && g.needsms && !g.issmsvalid) {
		b = "提示：您的手机号码没有通过验证，请先验证";
		writeError(g, b, 3000);
	}
	return b;
}
function validateMatrix(g, d) {
	var e = $("table.matrix-rating", $(g)), b;
	var f = "";
	$(g)[0].isMatrixFillError = false;
	$("tr[tp='d']", e).each(
			function() {
				var l = $(this).attr("fid"), m = $("a.rate-on", $(this));
				b = "";
				if (window.hasReferClient && this.style.display == "none") {
					return true;
				}
				if (m.length == 0) {
					if (d == "1") {
						f = "此题是必答题";
						if (langVer == 1) {
							f = "required";
						}
						$(g)[0].errorControl = $(this).prev("tr")[0];
						return false;
					} else {
						return true;
					}
				} else {
					b = $(m).attr("dval");
					var c = $(g).attr("ischeck");
					if (c) {
						b = "";
						var h = $(g).attr("minvalue");
						var a = $(g).attr("maxvalue");
						if (h && m.length - h < 0) {
							f = validate_info + validate_info_check5 + h
									+ type_check_limit5;
							$(g)[0].errorControl = $(this).prev("tr")[0];
							return false;
						} else {
							if (a && m.length - a > 0) {
								f = validate_info + validate_info_check4 + a
										+ type_check_limit5;
								$(g)[0].errorControl = $(this).prev("tr")[0];
								return false;
							}
						}
						$(m).each(
								function() {
									if (b) {
										b += ";";
									}
									b += $(this).attr("dval");
									var p = $(this).attr("needfill");
									if (p) {
										var q = this.fillvalue || "";
										q = replace_specialChar(q).replace(
												/;/g, "；").replace(/,/g, "，");
										b += spChars[2] + q;
										var o = $(this).attr("req");
										if (o && !q) {
											f = "此题是必答题";
											if (langVer == 1) {
												f = "required";
											}
											$(g)[0].isMatrixFillError = true;
											showMatrixFill(this, 1);
											return false;
										}
									}
								});
					} else {
						var k = $(m).attr("needfill");
						if (k) {
							var n = $(m)[0].fillvalue || "";
							n = replace_specialChar(n).replace(/;/g, "；")
									.replace(/,/g, "，");
							b += spChars[2] + n;
							var j = $(m).attr("req");
							if (j && !n) {
								f = "此题是必答题";
								if (langVer == 1) {
									f = "required";
								}
								$(g)[0].isMatrixFillError = true;
								showMatrixFill($(m)[0], 1);
								return false;
							}
						}
					}
					$("#" + l, $(g)).attr("value", b);
				}
			});
	return f;
}
function validateScaleRating(d) {
	var e = true, f = $("table.scale-rating", $(d));
	$("tr[tp='d']", f).each(function() {
		var a = $("a.rate-on", $(this));
		if (a.length == 0) {
			e = false;
		} else {
			$("input:hidden", $(d)).attr("value", $(a).attr("val"));
			if (a.attr("jumpto") == -1) {
				needSubmitNotValid = true;
			}
		}
	});
	return e;
}
function jump(c, e) {
	var d = $(c);
	var b = d.attr("type");
	var f = d.attr("hasjump");
	var a = d.attr("anyjump");
	if (f) {
		if (a > 0) {
			jumpAnyChoice(c);
		} else {
			if (a == 0 && b != "3" && b != "5" && b != "7") {
				jumpAnyChoice(c);
			} else {
				jumpByChoice(c, e);
			}
		}
	}
}
function jumpAnyChoice(c, f) {
	var d = $(c);
	var b = d.attr("type");
	var a = false;
	if (b == "1") {
		a = $("input", d).val().length > 0;
	} else {
		if (b == "2") {
			a = $("textarea", d).val().length > 0;
		} else {
			if (b == "3") {
				a = $("input[type='radio']:checked", d).length > 0;
			} else {
				if (b == "4") {
					a = $("input[type='checkbox']:checked", d).length > 0;
				} else {
					if (b == "5") {
						a = $("a.rate-on", d).length > 0;
					} else {
						if (b == "6") {
							a = $("a.rate-on", d).length > 0;
						} else {
							if (b == "7") {
								a = $("select", d).val() != -2;
							} else {
								if (b == "8") {
									a = $("input", d).val().length > 0;
								} else {
									if (b == "9" || b == "12") {
										$("input", d).each(function() {
											var g = $(this).val();
											if (g.length > 0) {
												a = true;
											}
										});
									} else {
										if (b == "10") {
											var e = d.attr("select") == "1";
											if (e) {
												$("select", d).each(function() {
													var g = $(this).val();
													if (g != -2) {
														a = true;
													}
												});
											} else {
												$("input", d).each(function() {
													var g = $(this).val();
													if (g.length > 0) {
														a = true;
													}
												});
											}
										} else {
											if (b == "11") {
												a = $("li[check='1']", d).length > 0;
											} else {
												if (b == "13") {
													a = d[0].fileName ? true
															: false;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	jumpAny(a, c, f);
}

function jumpByChoice(d, e) {
	var c = $(d).attr("type");
	var b = $(d)[0];
	if (e.value == "-2") {
		processJ(b.indexInPage - 0, 0);
	} else {
		if (e.value == "-1" || e.value == "") {
			processJ(b.indexInPage - 0, 0);
		} else {
			if ((c == "3" || c == "5" || c == "7")) {
				var f = e.value || $(e).attr("val");
				var a = $(e).attr("jumpto") - 0;
				processJ(b.indexInPage - 0, a);
			}
		}
	}
}

function jumpAny(c, e, g) {
	var f = $(e);
	var d = f.attr("type");
	var h = f.attr("hasjump");
	var a = f.attr("anyjump") - 0;
	var b = f[0];
	if (h) {
		if (c) {
			processJ(b.indexInPage - 0, a, g);
		} else {
			processJ(b.indexInPage - 0, 0, g);
		}
	}
}
function processJ(n, d, e) {
	var a = n + 1;
	var b = cur_page;
	var f = d == 1 || d == -1;
	for (var k = cur_page; k < pageHolder.length; k++) {
		var m = $(".field", pageHolder[k]);
		if (f) {
			b = k;
		}
		for (var h = a; h < m.length; h++) {
			var l = getTopic(m[h]);
			if (l == d || f) {
				b = k;
			}
			if (l < d || f) {
				m[h].style.display = "none";
			} else {
				if (relationNotDisplayQ[l]) {
					var g = 1;
				} else {
					m[h].style.display = "";
				}
				var c = $(m[h]).attr("hasjump");
				if (c && !e) {
					clearFieldValue(m[h]);
				}
			}
		}
		a = 0;
	}
	fixBottom();
}
function GetBacktoServer() {
	str = window.location.pathname;
	index = str.lastIndexOf("/");
	page = str.substr(index + 1, str.length - index);
	data = readCookie("history");
	if (data != null && data.toLowerCase() != page.toLowerCase()) {
		window.location.href = window.location.href;
	}
}
function readCookie(h) {
	for (var k = h + "=", j = document.cookie.split(";"), f = 0; f < j.length; f++) {
		var g = j[f];
		while (g.charAt(0) == " ") {
			g = g.substring(1, g.length);
		}
		if (g.indexOf(k) == 0) {
			return g.substring(k.length, g.length);
		}
	}
	return null;
}
function removeError() {
	if (this.errorMessage) {
		this.errorMessage.innerHTML = "";
		this.removeError = null;
		this.style.border = "solid 2px #f7f7f7";
		if (this.errorControl) {
			this.errorControl.style.background = "white";
			this.errorControl = null;
		}
	}
}
function writeError(a, c, b) {
	a = $(a)[0];
	a.style.border = "solid 2px #ff9900";
	if (a.errorMessage) {
		a.errorMessage.innerHTML = c;
	} else {
		a.errorMessage = $(".errorMessage", $(a))[0];
		a.errorMessage.innerHTML = c;
	}
	a.removeError = removeError;
	if (a.errorControl) {
		a.errorControl.style.background = "#FBD5B5";
	}
	if (!firstError) {
		firstError = a;
	}
	return false;
}
function verifydata(d, c) {
	if (!c) {
		return "";
	}
	var a = null;
	if (c.toLowerCase() == "email" || c.toLowerCase() == "msn") {
		a = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		if (!a.exec(d)) {
			return validate_email;
		} else {
			return "";
		}
	} else {
		if (c == "日期" || c == "生日" || c == "入学时间") {
			return "";
		} else {
			if (c == "固话") {
				a = /^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$/;
				if (!a.exec(d)) {
					return validate_phone.replace("，请注意使用英文字符格式", "");
				} else {
					return "";
				}
			} else {
				if (c == "手机") {
					a = /^\d{11}$/;
					if (!a.exec(d)) {
						return validate_mobile.replace("，请注意使用英文字符格式", "");
					} else {
						return "";
					}
				} else {
					if (c == "电话") {
						a = /(^\d{11}$)|(^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$)/;
						if (!a.exec(d)) {
							return validate_mo_phone
									.replace("，请注意使用英文字符格式", "");
						} else {
							return "";
						}
					} else {
						if (c == "汉字") {
							a = /^[\u4e00-\u9fa5]+$/;
							if (!a.exec(d)) {
								return validate_chinese;
							} else {
								return "";
							}
						} else {
							if (c == "英文") {
								a = /^[A-Za-z]+$/;
								if (!a.exec(d)) {
									return validate_english;
								} else {
									return "";
								}
							} else {
								if (c == "网址" || c == "公司网址") {
									a = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
									if (!a.exec(d)) {
										return validate_reticulation;
									} else {
										return "";
									}
								} else {
									if (c == "身份证号") {
										a = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
										if (!a.exec(d)) {
											return validate_idcardNum;
										} else {
											return "";
										}
									} else {
										if (c == "数字") {
											a = /^(\-)?\d+$/;
											if (!a.exec(d)) {
												return validate_num.replace(
														"，请注意使用英文字符格式", "");
											}
										} else {
											if (c == "小数") {
												a = /^(\-)?\d+(\.\d+)?$/;
												if (!a.exec(d)) {
													return validate_decnum;
												}
											} else {
												if (c.toLowerCase() == "qq") {
													a = /^\d+$/;
													var b = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
													if (!a.exec(d)
															&& !b.exec(d)) {
														return validate_qq;
													} else {
														return "";
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return "";
}
function verifyMinMax(e, d, c, a) {
	if (d == "数字" || d == "小数") {
		var b = /^(\-)?\d+$/;
		if (d == "小数") {
			b = /^(\-)?\d+(\.\d+)?$/;
		}
		if (!b.exec(e)) {
			if (d == "小数") {
				return validate_decnum;
			} else {
				return validate_num.replace("，请注意使用英文字符格式", "");
			}
		}
		if (e != 0) {
			e = e.replace(/^0+/, "");
		}
		if (c != "") {
			if (d == "数字" && parseInt(e) - parseInt(c) < 0) {
				return validate_num2 + c;
			} else {
				if (d == "小数" && parseFloat(e) - parseFloat(c) < 0) {
					return validate_num2 + c;
				}
			}
		}
		if (a != "") {
			if (d == "数字" && parseInt(e) - parseInt(a) > 0) {
				return validate_num1 + a;
			} else {
				if (d == "小数" && parseFloat(e) - parseFloat(a) > 0) {
					return validate_num1 + a;
				}
			}
		}
	} else {
		if (a != "" && e.length - a > 0) {
			return validate_info_wd3.format(a, e.length);
		}
		if (c != "" && e.length - c < 0) {
			return validate_info_wd4.format(c, e.length);
		}
	}
	return "";
}
function getTopic(a) {
	return $(a).attr("topic");
}
function displayRelationByType(d, c, b) {
	var a = getTopic(d);
	if (!relationQs[a]) {
		return;
	}
	d.hasDisplayByRelation = new Object();
	$(c, d).each(function() {
		var f = false;
		var g = "";
		if (b == 1 || b == 2 || b == 5) {
			g = this.value;
		} else {
			if (b == 3) {
				g = $("input[type=hidden]", this).val();
			} else {
				if (b == 4) {
					g = $(this).attr("val");
				}
			}
		}
		var h = a + "," + g;
		if (b == 3 && $(this).attr("check")) {
			f = true;
		} else {
			if (b == 4 && $(this).hasClass("rate-on")) {
				f = true;
			} else {
				if ((b == 1 || b == 2) && this.checked) {
					f = true;
				} else {
					if (b == 5 && this.selected) {
						f = true;
					}
				}
			}
		}
		displayByRelation(d, h, f);
		var e = a + ",-" + g;
		if (relationHT[e]) {
			displayByRelationNotSelect(d, e, f);
		}
	});
	fixBottom();
}
function displayByRelation(c, f, b) {
	var d = relationHT[f];
	if (!d) {
		return;
	}
	for (var a = 0; a < d.length; a++) {
		var e = getTopic(d[a]);
		if (c.hasDisplayByRelation[e]) {
			continue;
		}
		if (!b && d[a].style.display != "none") {
			loopHideRelation(d[a]);
		} else {
			if (b) {
				d[a].style.display = "";
				initqSlider(d[a]);
				c.hasDisplayByRelation[e] = "1";
				if (relationNotDisplayQ[e]) {
					relationNotDisplayQ[e] = "";
				}
			}
		}
	}
}
function displayByRelationNotSelect(c, f, b) {
	var d = relationHT[f];
	if (!d) {
		return;
	}
	for (var a = 0; a < d.length; a++) {
		var e = getTopic(d[a]);
		if (c.hasDisplayByRelation[e]) {
			continue;
		}
		if (b && d[a].style.display != "none") {
			loopHideRelation(d[a]);
		} else {
			if (!b) {
				d[a].style.display = "";
				initqSlider(d[a]);
				c.hasDisplayByRelation[e] = "1";
				if (relationNotDisplayQ[e]) {
					relationNotDisplayQ[e] = "";
				}
			}
		}
	}
}
function loopHideRelation(a) {
	var c = getTopic(a);
	var b = relationQs[c];
	if (b) {
		for (var d = 0; d < b.length; d++) {
			loopHideRelation(b[d], false);
		}
	}
	clearFieldValue(a);
	$(a)[0].style.display = "none";
	if (relationNotDisplayQ[c] == "") {
		relationNotDisplayQ[c] = "1";
	}
}
function checkHuChi(c, e) {
	var b = $(".huchi", c)[0];
	if (!b) {
		return;
	}
	var f = $(e);
	if (!$("input:checked", f)[0]) {
		return;
	}
	var a = $(".ui-checkbox", c);
	var d = f.hasClass("huchi");
	a.each(function() {
		if (this == e) {
			return true;
		}
		var g = $(this);
		if (!$("input:checked", g)[0]) {
			return true;
		}
		if (d) {
			g.trigger("click");
		} else {
			var h = g.hasClass("huchi");
			if (h) {
				g.trigger("click");
			}
		}
	});
}