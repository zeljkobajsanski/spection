define(['services/data', 'services/messages', 'plugins/dialog'], function (data, msg, dlg) {
    var vm = function () {
        var that = this;
        var searchTypes = [{id: 1, label: 'alle'}, {id: 2, label: 'eine'}],
        filterTypes = [{id: 1, label: 'Autor'}, {id: 2, label: 'Bemerkung/Erganzung'}, {id: 3, label: 'Kommentare'}, {id: 4, label: 'Beschreibung'}, {id: 5, label: 'Herstellungkosten'}],
        operators = ko.observableArray([]),
        booleanOperators = [{id: 1, label: 'ist'}, {id: 2, label: 'ist nicht'}],
        textOperators = [{id: 3, label: 'enthalt'}, {id: 4, label: 'enthalt nicht'}],
        numericOperators = [{id: 5, label: '='}, {id: 6, label: '<'}, {id: 7, label: '>'}, {id: 8, label: '!='}],
        TEXT_EDITOR = 'text',
        NUMERIC_EDITOR = 'numeric',
        LOOKUP_EDITOR = 'select',
        filter = ko.mapping.fromJS({ID: undefined, Name: '', FilterType: 1, FilterItems: [], UserID: 1, ProjectID: 1});
        filter.Name.extend({required: true, message: 'Required'});
        
        var populate = function (item) {
            item.Fields = filterTypes;
            switch(ko.unwrap(item.Field)) {
                case 1:
                case 2:
                    item.Operators(booleanOperators);
                    item.Editor(LOOKUP_EDITOR);
                    break;
                case 3:
                case 4:
                    item.Operators(textOperators);
                    item.Editor(TEXT_EDITOR);
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                    item.Operators(numericOperators);
                    item.Editor(NUMERIC_EDITOR);
                    break;
            }
        };
        
        var addNewItem = function() {
            addItem();
        };
        
        var addItem = function (id, field, operator, value) {
            var item = ko.mapping.fromJS({ID: id, Field: field ? field : 1, Operator: 1, Value: value ? value : '', Operators: [], Editor: ''});
            populate(item);
            item.Field.subscribe(function(){populate(this);}, item);
            filter.FilterItems.push(item);
        };
        
        this.searchTypes = searchTypes;
        this.filter = filter;
        this.attached = function () {
            $("#dialog").modal({backdrop: 'static'}).modal('show');
            $('#dialog').on('hidden.bs.modal', function (e) {
                $(".modalBlockout").remove();
                $(".modalHost").remove();
            });
        };
        this.addItem = addNewItem;
        this.save = function () {
            
            if (!filter.Name.isValid()) {
                msg.showWarning("Filter name is missing");
                return;
            }
            
            var f = ko.mapping.toJS(filter);
            f.FilterItems.forEach(function(item){
                delete item.Fields;
                delete item.Operators;
                delete item.Editor;
            })
            data.saveFilter(f).done(function () {
                $("#dialog").modal('hide');
                dlg.close(that, true);
            }).fail(function() {
                
            });
        };
        this.activate = function (id) {
            if (id) {
                data.loadFilter(id).done(function (f) {
                    var items = f.FilterItems;
                    f.FilterItems = [];
                    ko.mapping.fromJS(f, filter);
                    items.forEach(function (item){
                        addItem(item.ID, item.Field, item.Operator, item.Value);
                    })
                });
            } else {
                addItem();
            }
        };
    };
    
    
    
    return vm;
    
    
});