
function createPieChart(mitt, barack) {
 
	var pieChart = new PieChart( "piechart", 
		{
			includeLabels: true, 
			data: [(mitt/100)*360,(barack/100)*360, (1-(mitt/100)-(barack/100))*360],
			labels: ["Romney", "Obama", "Other"],
			colors: [
            	["#B40404", "#B40404"],
            	["#08088A", "#08088A"],
            	["#0B610B", "#0b610B"]
			]
		}
	);

	pieChart.draw();



}
function clearPieChart() {
 
	var pieChart = new PieChart( "piechart", 
		{
			includeLabels: true, 
			data: [360],
			labels: [""],
			colors: [
            	["#000000", "#000000"]
			]
		}
	);

	pieChart.draw();



}

function PieChart(id, o) {
	this.includeLabels = false;
	if (o.includeLabels == undefined) {
		this.includeLabels = false;
	}
	else {
		this.includeLabels = o.includeLabels;
	}
	this.data = o.data ? o.data : [30, 70, 45, 65, 20, 130]; 
	this.labels = o.labels ? o.labels : ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
	this.colors = o.colors ? o.colors : [
        	["#bbddb3", "#1d8e04"],
        	["#e2f5b4", "#9edd08"], 
        	["#fdfbb4", "#faf406"], 
        	["#fbd4b7", "#f2700f"], 
        	["#f8bdb4", "#ea2507"],
        	["#e2bcbd", "#9e2126"] 
    	];

	this.canvas = document.getElementById(id);
}

PieChart.prototype = {

	select: function(segment) {
		var self = this;
		var context = this.canvas.getContext("2d");
		this.drawSegment(this.canvas, context, segment, this.data[segment], true, this.includeLabels);
	},

	draw: function() {
		var self = this;
		var context = this.canvas.getContext("2d");
		for (var i = 0; i < this.data.length; i++) {
			this.drawSegment(this.canvas, context, i, this.data[i], false, this.includeLabels);
		}
	},

	drawSegment: function(canvas, context, i, size, isSelected, includeLabels) {
		var self = this;
		context.save();
		var centerX = Math.floor(canvas.width / 2);
		var centerY = Math.floor(canvas.height / 2);
		radius = Math.floor(canvas.width / 2);

		var startingAngle = self.degreesToRadians(self.sumTo(self.data, i));
		var arcSize = self.degreesToRadians(size);
		var endingAngle = startingAngle + arcSize;

		context.beginPath();
		context.moveTo(centerX, centerY);
		context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
		context.closePath();

		isSelected ? 
			context.fillStyle = self.colors[i][1] :
			context.fillStyle = self.colors[i][0];

		context.fill();
		context.restore();

		if (includeLabels && (self.labels.length > i)) {
			self.drawSegmentLabel(canvas, context, i, isSelected);
		}
	},

	drawSegmentLabel: function(canvas, context, i, isSelected) {
		var self = this;
		context.save();
		var x = Math.floor(canvas.width / 2);
		var y = Math.floor(canvas.height / 2);
		var angle = self.degreesToRadians(self.sumTo(self.data, i));

		context.translate(x, y);
		context.rotate(angle);
		context.textAlign = "right";
		var fontSize = Math.floor(canvas.height / 25);
		context.font = fontSize + "pt Helvetica";

		var dx = Math.floor(canvas.width * 0.5) - 10;
		var dy = Math.floor(canvas.height * 0.05);
		context.fillText(self.labels[i], dx, dy);

		context.restore();
	},

	drawLabel: function(i) {
		var self = this;
		var context = this.canvas.getContext("2d");
		var size = self.data[i];

		self.drawSegmentLabel(this.canvas, context, i, size, false);
	},

	// helper functions
	degreesToRadians: function(degrees) {
		return (degrees * Math.PI)/180;
	},

	sumTo: function(a, i) {
		var sum = 0;
		for (var j = 0; j < i; j++) {
			sum += a[j];
		}
		return sum;
	}


}