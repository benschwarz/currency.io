var Currency = {	
	primary: function () {
		return localStorage["primary_currency"] || "AUD";
	},
	
	convert: function () {
		return localStorage["convert_currency"] || "JPY";
	},
	
	exchange: function () {
		return localStorage[Currency.primary()+Currency.convert()];
	},
	
	setPrimary: function (currency) {
		localStorage["primary_currency"] = currency;
		Currency.sync();
	},
	
	setConvert: function (currency) {
		localStorage["convert_currency"] = currency;
		Currency.sync();
	},
	
	sync: function () {
		$.ajax({
			url: "/exchange?from="+Currency.primary()+"&to="+Currency.convert(),
			success: function(response) {
				var exchange = parseFloat(response['query']['results']['json']['rhs']);
				Currency.setExchange(exchange);
			}
		});
	},
	
	setExchange: function (exchange) {
		localStorage[Currency.primary()+Currency.convert()] = exchange;
	},
	
	calculate: function (amount) {
		$("#converter output").text("That will cost " + amount / Currency.exchange() + " " + $("select#primary_currency option[value="+Currency.primary()+"]").text());
	},
	
	setPlaceHolder: function () {
		$("#converter input#spend").attr("placeholder", "In " + $("select#convert_currency option[value="+Currency.convert()+"]").text());
	}
};

$(function () {
	$("select#primary_currency").change(function () {
		Currency.setPrimary($(this).val());
	});
	
	$("select#convert_currency").change(function () {
		console.debug("changing to "+$(this).val())
		Currency.setConvert($(this).val());
		Currency.setPlaceHolder();
	});
	
	$("menu#settings button").click(function () {
		$(this).parent().toggleClass("active");
	});
	
	// Set the help text
	Currency.setPlaceHolder();
	
	// Select correct primary and convert currencies
	$("select#primary_currency option[value="+Currency.primary()+"]").attr("selected", true);
	$("select#convert_currency option[value="+Currency.convert()+"]").attr("selected", true);
	
	// Set spend
	$("#converter input#spend").keyup(function () {
		Currency.calculate($(this).val());
	})
	
	if(navigator.onLine) Currency.sync();
});