Template.chartEditPreviewSingle.helpers({
  annoMode: function() {
    var annoMode = Session.get("annotationMode"),
      annoData = Session.get("annotationData");
    if (annoMode) {
      return 'preview-outer-container-annotation';
    }
  }
});

Template.chartEditPreviewSingle.events({
  "blur .editable-chart_title": function(event) {
    event.preventDefault();
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateHed", this.data, text);
  },
  "blur .editable-chart_qualifier": function(event) {
    event.preventDefault();
    var input = event.target.innerText;
    var text = removeNbsp(input).trim();
    updateAndSave("updateQual", this.data, text);
  },
  "click .editable-chart_source": function(event) {
    event.preventDefault();
    var currText = event.target.textContent.trim();
    if (currText === app_settings.chart.source || currText === "") {
      event.target.textContent = app_settings.chart.source + app_settings.source_suffix;
    }
    cursorManager.setEndOfContenteditable(event.target);
  },
  "blur .editable-chart_source": function(event) {
    event.preventDefault();
    var currText = event.target.textContent;
    var text;
    if (currText === app_settings.chart.source + app_settings.source_suffix || currText === "") {
      event.target.textContent = app_settings.chart.source;
      text = app_settings.chart.source
    } else {
      text = removeNbsp(currText).trim();
    }
    updateAndSave("updateSource", this.data, text);
  },
  'click .ct-type_bar .ct-series_group rect, click .ct-type_column .ct-series_group rect': function(event) {
    var currAnno = Session.get('currentAnnotation');
    if (currAnno.type === 'highlight') {
      var key = event.currentTarget.parentElement.getAttribute('data-key');
      updateAndSave("updateHighlightAnnotation", this.data, {
        key: key,
        color: currAnno.color
      });
    }
  }
});

Template.chartEditPreviewSingle.rendered = function() {

  this.autorun(function(comp) {

    var anno;

    if (Session.equals('annotationMode', true)) {
      anno = Session.get('annotationMode');
    }

    var dataContext = Router.current().data();

    var templateData = Template.currentData();

    if (!dataContext || !templateData) { return; }

    if (dataContext && templateData) {

      var data = dataContext;

      data.editable = true;

      Tracker.afterFlush(function() {
        if (anno) { data.options.tips = false; }

        data.options.annotations = true;

        drawChart('.' + templateData.type + '-preview-container', data);
      });

    }

  });
}
