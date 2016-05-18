/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define*/
define([
    'marionette',
    'underscore',
    'jquery',
    '../editor.view',
    'js/store',
    'component/property/property.collection.view',
    'component/loading/loading.view'
], function (Marionette, _, $, EditorView, store, PropertyCollectionView, LoadingView) {

    return EditorView.extend({
        className: 'is-metacard-basic',
        setDefaultModel: function(){
            this.model = store.getSelectedResults().first();
        },
        initialize: function(options){
            EditorView.prototype.initialize.call(this, options);
            this.getMetacardDetails();
        },
        getMetacardDetails: function(){
            var loadingView = new LoadingView();
            var self = this;
            $.when( $.get('/services/search/catalog/metacard/'+this.model.get('metacard').id +'/validation'),
                $.ajax({
                    url: '/services/search/catalog/metacards/',
                    data: JSON.stringify([this.model.get('metacard').id]),
                    method: 'POST',
                    contentType: 'application/json'
                })).done(function(validationResponse, metacardResponse){
                    self.editorProperties.show(PropertyCollectionView.generateSummaryPropertyCollectionView(metacardResponse[0]));
                    self.editorProperties.currentView.turnOnLimitedWidth();
                    self.editorProperties.currentView.$el.addClass("is-list");
                    self.editorProperties.currentView.updateValidation(validationResponse[0]);
                    loadingView.remove();
            });
        },
        getValidation: function(){
            var self = this;
            $.get('/services/search/catalog/metacard/'+this.model.get('metacard').id+'/validation').then(function(response){
                if (!self.isDestroyed && self.editorProperties.currentView){
                    self.editorProperties.currentView.updateValidation(response);
                }
            }).always(function(){
                if (!self.isDestroyed){

                }
            });
        },
        afterCancel: function(){

        },
        afterSave: function(editorJSON){
           if (editorJSON.length > 0){
               var payload = [
                   {
                       ids: [this.model.get('metacard').get('id')],
                       attributes: editorJSON
                   }
               ];
               var loadingView = new LoadingView();
               var self = this;
               setTimeout(function(){
                   $.ajax({
                       url: '/services/search/catalog/metacards',
                       type: 'PATCH',
                       data: JSON.stringify(payload),
                       contentType: 'application/json'
                   }).always(function(response){
                       var attributeMap = response.reduce(function(attributeMap, changes){
                           return changes.attributes.reduce(function(attrMap, chnges){
                               attrMap[chnges.attribute] = chnges.values;
                               return attrMap;
                           }, attributeMap);
                       }, {});
                       self.model.get('metacard').get('properties').set(attributeMap);
                       setTimeout(function(){  //let solr flush
                           loadingView.remove();
                           self.getMetacardDetails();
                       }, 1000);
                   });
               }, 1000);
           }
        }
    });
});