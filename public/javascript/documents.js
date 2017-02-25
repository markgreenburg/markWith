Handlebars.registerHelper("totalCollabs", function(docs.owners, docs.collabs) {
    var totalCollabs = docs.owners.length + docs.collabs.length;
    return totalCollabs;
